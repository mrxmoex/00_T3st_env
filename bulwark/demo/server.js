import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { destinationNovelty, learnBaseline } from "../src/baseline.js";
import { capabilityOf, destinationOf } from "../src/capabilities.js";
import { injectionSurface } from "../src/content.js";
import { DEFAULT_THRESHOLDS, assessSession, summarize } from "../src/engine.js";
import { buildCorpus, splitCorpus, listScenarios } from "../sim/index.js";

/**
 * Read-only inspector for the detection engine.
 *
 * The dashboard exists to make a decision auditable, so the API returns the
 * evidence behind a score rather than the score alone: the capability profile
 * of the tool, how familiar the destination is, what the content scanner saw,
 * and the causal path the engine walked. An analyst who disagrees with a
 * verdict should be able to find the input that produced it.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "public");
const PORT = Number(process.env.BULWARK_PORT) || 3001;

/** Bodies are tiny; the cap only exists so a stray upload cannot exhaust memory. */
const MAX_BODY = 1_000_000;

const { train, test } = splitCorpus(buildCorpus(1));
const baseline = learnBaseline(train);
const byId = new Map(test.map((session) => [session.id, session]));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function notFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("not found");
}

async function staticFile(res, urlPath) {
  const relative = urlPath === "/" ? "index.html" : urlPath.slice(1);
  const file = join(PUBLIC, relative);
  if (!file.startsWith(PUBLIC)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    notFound(res);
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/**
 * The engine only needs `tool`; everything else has a defined default. Rather
 * than accept a session that scores as a row of zeroes because a field was
 * misspelled, say which step is wrong.
 */
function validateSession(payload) {
  const candidate = payload?.session ?? payload;
  if (!candidate || typeof candidate !== "object") {
    return { error: "body must be a JSON object with a session" };
  }
  const { steps } = candidate;
  if (!Array.isArray(steps) || steps.length === 0) {
    return { error: "session.steps must be a non-empty array" };
  }
  for (const [index, step] of steps.entries()) {
    if (!step || typeof step !== "object") {
      return { error: `step ${index} is not an object` };
    }
    if (typeof step.tool !== "string" || !step.tool) {
      return { error: `step ${index} is missing a tool name` };
    }
  }
  return {
    session: {
      id: typeof candidate.id === "string" ? candidate.id : "ad-hoc",
      agent: candidate.agent ?? "unknown",
      task: candidate.task ?? "ad-hoc session",
      label: candidate.label ?? "unlabelled",
      archetype: candidate.archetype ?? "ad-hoc",
      hardNegative: Boolean(candidate.hardNegative),
      steps: steps.map((step, index) => ({
        ...step,
        id: typeof step.id === "string" && step.id ? step.id : `ad-hoc:${index + 1}`,
      })),
    },
  };
}

/**
 * Everything the UI needs to justify one step, gathered from the same modules
 * the engine scores with so the panel cannot drift from the verdict.
 */
function stepPayload(step, assessment) {
  const capability = capabilityOf(step.tool);
  const destination = destinationOf(step);
  const text = step.output?.text ?? "";
  const surface = capability.ingest > 0 ? injectionSurface(text) : null;

  return {
    id: step.id,
    ts: step.ts ?? null,
    tool: step.tool,
    params: step.params ?? {},
    inputs: step.inputs ?? [],
    output: { bytes: step.output?.bytes ?? 0, ok: step.output?.ok !== false },
    content: capability.ingest > 0 ? text : "",
    capability: {
      kind: capability.kind,
      ingest: capability.ingest,
      sensitivity: capability.sensitivity,
      egress: capability.egress,
    },
    destination,
    novelty: destination ? destinationNovelty(baseline, destination) : null,
    seenInBaseline: destination ? (baseline.destinations[destination] ?? 0) : null,
    contentScore: surface?.score ?? null,
    contentSignals: surface?.signals ?? [],
    assessment,
  };
}

function scenarioPayload(session) {
  const assessments = assessSession(session, { baseline });
  return {
    id: session.id,
    agent: session.agent,
    task: session.task,
    label: session.label,
    archetype: session.archetype,
    hardNegative: Boolean(session.hardNegative),
    thresholds: DEFAULT_THRESHOLDS,
    summary: summarize(assessments),
    steps: session.steps.map((step, index) => stepPayload(step, assessments[index])),
  };
}

function baselineSummary() {
  const tools = Object.entries(baseline.tools)
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count);
  const destinations = Object.entries(baseline.destinations)
    .map(([destination, count]) => ({
      destination,
      count,
      novelty: destinationNovelty(baseline, destination),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    sessions: baseline.sessions,
    steps: baseline.steps,
    tools,
    destinations,
    thresholds: DEFAULT_THRESHOLDS,
  };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    json(res, 200, {
      status: "ok",
      port: PORT,
      scenarios: test.length,
      baselineSessions: baseline.sessions,
      thresholds: DEFAULT_THRESHOLDS,
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/baseline") {
    json(res, 200, baselineSummary());
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/scenarios") {
    json(res, 200, { scenarios: listScenarios(test), thresholds: DEFAULT_THRESHOLDS });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/scenarios/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/scenarios/".length));
    const session = byId.get(id);
    if (!session) {
      json(res, 404, { error: `unknown scenario "${id}"` });
      return;
    }
    json(res, 200, scenarioPayload(session));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/assess") {
    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch (error) {
      json(res, 400, { error: `could not read request body: ${error.message}` });
      return;
    }
    const { error, session } = validateSession(payload);
    if (error) {
      json(res, 400, { error });
      return;
    }
    json(res, 200, scenarioPayload(session));
    return;
  }

  if (req.method === "GET") {
    await staticFile(res, url.pathname);
    return;
  }

  json(res, 405, { error: `${req.method} is not supported here` });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bulwark dashboard on http://0.0.0.0:${PORT}`);
});

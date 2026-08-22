import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { learnBaseline } from "../src/baseline.js";
import { assessSession, summarize } from "../src/engine.js";
import { buildCorpus, splitCorpus, listScenarios } from "../sim/corpus.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "public");
const PORT = Number(process.env.BULWARK_PORT) || 3001;

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

function scenarioPayload(session) {
  const assessments = assessSession(session, { baseline });
  return {
    id: session.id,
    agent: session.agent,
    task: session.task,
    label: session.label,
    archetype: session.archetype,
    hardNegative: Boolean(session.hardNegative),
    summary: summarize(assessments),
    steps: session.steps.map((step, index) => ({
      ...step,
      assessment: assessments[index],
    })),
  };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    json(res, 200, { status: "ok", port: PORT, scenarios: test.length });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/scenarios") {
    json(res, 200, { scenarios: listScenarios(test) });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/scenarios/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/scenarios/".length));
    const session = byId.get(id);
    if (!session) {
      json(res, 404, { error: "unknown scenario" });
      return;
    }
    json(res, 200, scenarioPayload(session));
    return;
  }

  if (req.method === "GET") {
    await staticFile(res, url.pathname);
    return;
  }

  res.writeHead(405).end();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bulwark dashboard on http://0.0.0.0:${PORT}`);
});

/**
 * What an agent's tools can actually do.
 *
 * Detection here is grounded in capability, not tool name. A tool matters
 * because of three properties:
 *
 *   ingest      Does it pull content the agent did not author into context?
 *               That content can carry instructions, so it is untrusted.
 *   sensitivity How valuable is what it returns if it leaves the building?
 *   egress      Can it move data somewhere the operator does not control?
 *
 * Only `egress` tools can complete an exfiltration, only `ingest` tools can
 * start an injection, and the damage is bounded by `sensitivity`. Every risk
 * score in the engine is built from those three numbers.
 */

/** @type {Record<string, {kind: string, ingest: number, sensitivity: number, egress: number, destination?: string}>} */
const CAPABILITIES = {
  // Reads of operator-controlled data. Trusted origin, varying sensitivity.
  "fs.read": { kind: "read", ingest: 0, sensitivity: 0.3, egress: 0 },
  "fs.list": { kind: "read", ingest: 0, sensitivity: 0.1, egress: 0 },
  "repo.search": { kind: "read", ingest: 0, sensitivity: 0.2, egress: 0 },
  "db.query": { kind: "read", ingest: 0, sensitivity: 0.7, egress: 0 },
  "secrets.read": { kind: "read", ingest: 0, sensitivity: 1.0, egress: 0 },
  "env.read": { kind: "read", ingest: 0, sensitivity: 0.9, egress: 0 },
  "cloud.credentials": { kind: "read", ingest: 0, sensitivity: 1.0, egress: 0 },

  // Reads of content authored outside the trust boundary. These start chains.
  "http.fetch": { kind: "ingest", ingest: 1.0, sensitivity: 0.1, egress: 0.1, destination: "url" },
  "web.search": { kind: "ingest", ingest: 0.8, sensitivity: 0.1, egress: 0.1 },
  "rag.retrieve": { kind: "ingest", ingest: 0.9, sensitivity: 0.2, egress: 0 },
  "email.read": { kind: "ingest", ingest: 1.0, sensitivity: 0.4, egress: 0 },
  "ticket.read": { kind: "ingest", ingest: 0.9, sensitivity: 0.3, egress: 0 },
  "mcp.call": { kind: "ingest", ingest: 0.7, sensitivity: 0.3, egress: 0.3, destination: "server" },

  // Local writes. Cannot exfiltrate on their own but can persist an attack.
  "fs.write": { kind: "write", ingest: 0, sensitivity: 0.2, egress: 0.1 },
  "repo.commit": { kind: "write", ingest: 0, sensitivity: 0.2, egress: 0.3 },

  // Egress. Only these can complete an exfiltration.
  "http.post": { kind: "egress", ingest: 0.3, sensitivity: 0.1, egress: 1.0, destination: "url" },
  "email.send": { kind: "egress", ingest: 0, sensitivity: 0.1, egress: 0.95, destination: "to" },
  "slack.post": { kind: "egress", ingest: 0, sensitivity: 0.1, egress: 0.7, destination: "channel" },
  "repo.push": { kind: "egress", ingest: 0, sensitivity: 0.1, egress: 0.8, destination: "remote" },
  "dns.resolve": { kind: "egress", ingest: 0, sensitivity: 0, egress: 0.5, destination: "host" },

  // Execution. Confers every capability at once, so it is treated as egress.
  "shell.exec": { kind: "execute", ingest: 0.2, sensitivity: 0.6, egress: 0.9, destination: "command" },
  "code.eval": { kind: "execute", ingest: 0.2, sensitivity: 0.5, egress: 0.85 },
  "pkg.install": { kind: "execute", ingest: 0.9, sensitivity: 0.3, egress: 0.7, destination: "package" },
};

const UNKNOWN_TOOL = { kind: "unknown", ingest: 0.5, sensitivity: 0.5, egress: 0.5 };

export function capabilityOf(tool) {
  return CAPABILITIES[tool] ?? UNKNOWN_TOOL;
}

export function isKnownTool(tool) {
  return Object.hasOwn(CAPABILITIES, tool);
}

export function knownTools() {
  return Object.keys(CAPABILITIES);
}

/**
 * Where a step is sending data, if anywhere. Used to tell a destination the
 * operator uses every day from one seen for the first time mid-session.
 */
export function destinationOf(step) {
  const { destination } = capabilityOf(step.tool);
  if (!destination) {
    return null;
  }
  const raw = step.params?.[destination];
  if (typeof raw !== "string" || !raw) {
    return null;
  }
  return normalizeDestination(raw);
}

/**
 * Reduces a destination to the identity that matters for reputation: the host
 * for URLs, the domain for email, the registry name for packages.
 */
export function normalizeDestination(raw) {
  const value = raw.trim();

  if (URL_SCHEME.test(value)) {
    return hostOf(value) ?? value.toLowerCase();
  }

  // A bare address, as opposed to a command line that happens to contain one.
  if (/^[^\s@]+@[^\s@]+$/.test(value)) {
    return value.split("@").pop().toLowerCase();
  }

  // Command lines are opaque, so reduce them to the identity that decides
  // whether data can leave: the endpoint they talk to, or failing that the
  // program being run. Keying on the whole invocation instead would give every
  // command a different identity, so an ops agent could never build the
  // reputation that keeps its routine deploys quiet.
  if (/\s/.test(value)) {
    const embedded = value.match(/[a-z][a-z0-9+.-]*:\/\/\S+/i);
    const host = embedded ? hostOf(embedded[0]) : null;
    if (host) {
      return host;
    }
    const address = value.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/);
    if (address) {
      return address[0];
    }
    return value.split(/\s+/)[0].split("/").pop().toLowerCase();
  }

  return value.toLowerCase();
}

const URL_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

function hostOf(value) {
  try {
    return new URL(value).host.toLowerCase() || null;
  } catch {
    return null;
  }
}

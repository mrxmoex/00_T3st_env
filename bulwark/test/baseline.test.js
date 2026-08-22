import { test } from "node:test";
import assert from "node:assert/strict";
import {
  capabilityRarity,
  destinationNovelty,
  emptyBaseline,
  isKnownDestination,
  learnBaseline,
  transitionSurprisal,
  volumeAnomaly,
} from "../src/baseline.js";

function sessionWith(id, steps) {
  return {
    id,
    agent: "test",
    task: "train",
    label: "benign",
    steps: steps.map((step, index) => ({
      id: `${id}:${index + 1}`,
      ts: index,
      tool: step.tool,
      params: step.params ?? {},
      inputs: [],
      output: { bytes: step.bytes ?? 10, text: "", ok: true },
    })),
  };
}

const DEPLOY = "https://prod-deploy.internal.example/release";

test("learnBaseline records destinations and transitions", () => {
  const baseline = learnBaseline([
    sessionWith("a", [{ tool: "fs.read" }, { tool: "http.post", params: { url: DEPLOY } }]),
    sessionWith("b", [{ tool: "fs.read" }, { tool: "http.post", params: { url: DEPLOY } }]),
  ]);
  assert.equal(baseline.sessions, 2);
  assert.equal(baseline.steps, 4);
  assert.ok(baseline.tools["http.post"] >= 2);
  assert.equal(isKnownDestination(baseline, "prod-deploy.internal.example"), true);
  assert.ok(destinationNovelty(baseline, "prod-deploy.internal.example") < 1);
  assert.equal(destinationNovelty(baseline, "collector.untrusted.example"), 1);
});

test("an unseen destination is maximally novel", () => {
  assert.equal(destinationNovelty(emptyBaseline(), "never-seen.example"), 1);
  assert.equal(destinationNovelty(emptyBaseline(), null), 0);
  assert.equal(isKnownDestination(emptyBaseline(), "never-seen.example"), false);
});

test("novelty falls as a destination is seen more often", () => {
  const once = learnBaseline([sessionWith("a", [{ tool: "http.post", params: { url: DEPLOY } }])]);
  const often = learnBaseline(
    Array.from({ length: 30 }, (_, i) =>
      sessionWith(`s${i}`, [{ tool: "http.post", params: { url: DEPLOY } }]),
    ),
  );
  assert.ok(
    destinationNovelty(often, "prod-deploy.internal.example") <
      destinationNovelty(once, "prod-deploy.internal.example"),
  );
});

test("common transitions are less surprising than rare ones", () => {
  const steps = [];
  for (let i = 0; i < 20; i += 1) {
    steps.push({ tool: "fs.read" }, { tool: "fs.write" });
  }
  const baseline = learnBaseline([sessionWith("long", steps)]);
  const expected = transitionSurprisal(baseline, "fs.read", "fs.write");
  const unusual = transitionSurprisal(baseline, "fs.read", "shell.exec");
  assert.ok(unusual > expected, `unusual ${unusual} should exceed expected ${expected}`);
  assert.ok(expected < 0.7);
  assert.ok(unusual <= 1);
});

test("surprisal is defined for a state the baseline has never seen", () => {
  const baseline = learnBaseline([sessionWith("a", [{ tool: "fs.read" }])]);
  const value = transitionSurprisal(baseline, "never.seen", "also.never.seen");
  assert.ok(value >= 0 && value <= 1, `expected a probability, got ${value}`);
});

test("volume anomaly needs evidence before it fires", () => {
  const small = learnBaseline([sessionWith("a", [{ tool: "http.post", bytes: 100 }])]);
  assert.equal(volumeAnomaly(small, "http.post", 5_000_000), 0, "one sample is not a distribution");

  const steps = Array.from({ length: 40 }, (_, i) => ({ tool: "http.post", bytes: 100 + i }));
  const learned = learnBaseline([sessionWith("b", steps)]);
  assert.equal(volumeAnomaly(learned, "http.post", 120), 0);
  assert.ok(volumeAnomaly(learned, "http.post", 500_000) > 0);
});

test("capability rarity is measured over sessions, not steps", () => {
  // A tool used once per session is routine even though it is a small share of
  // all steps. Reading that share as rarity made every session's first egress
  // look like an escalation.
  const chatty = Array.from({ length: 10 }, (_, i) =>
    sessionWith(`s${i}`, [
      { tool: "fs.read" },
      { tool: "fs.read" },
      { tool: "fs.read" },
      { tool: "fs.read" },
      { tool: "http.post", params: { url: DEPLOY } },
    ]),
  );
  const baseline = learnBaseline(chatty);
  assert.equal(baseline.toolSessions["http.post"], 10);
  assert.equal(capabilityRarity(baseline, "http.post"), 0, "used every session, so not an escalation");
  assert.equal(capabilityRarity(baseline, "shell.exec"), 1, "never used, so maximally unusual");
  assert.ok(
    baseline.tools["http.post"] / baseline.steps < 0.25,
    "and it is still a small share of steps, which is the measure this replaced",
  );
});

test("capability rarity is maximal with no evidence", () => {
  assert.equal(capabilityRarity(emptyBaseline(), "shell.exec"), 1);
});

test("a tool used in a minority of sessions stays unusual", () => {
  const sessions = Array.from({ length: 20 }, (_, i) =>
    sessionWith(`s${i}`, i < 2 ? [{ tool: "shell.exec" }] : [{ tool: "fs.read" }]),
  );
  const baseline = learnBaseline(sessions);
  assert.ok(capabilityRarity(baseline, "shell.exec") >= 0.85);
});

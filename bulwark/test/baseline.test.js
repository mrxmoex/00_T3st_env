import { test } from "node:test";
import assert from "node:assert/strict";
import {
  destinationNovelty,
  emptyBaseline,
  isKnownDestination,
  learnBaseline,
  transitionSurprisal,
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

test("learnBaseline records destinations and transitions", () => {
  const baseline = learnBaseline([
    sessionWith("a", [
      { tool: "fs.read" },
      { tool: "http.post", params: { url: "https://prod-deploy.internal.corp/release" } },
    ]),
    sessionWith("b", [
      { tool: "fs.read" },
      { tool: "http.post", params: { url: "https://prod-deploy.internal.corp/release" } },
    ]),
  ]);
  assert.equal(baseline.sessions, 2);
  assert.ok(baseline.tools["http.post"] >= 2);
  assert.equal(isKnownDestination(baseline, "prod-deploy.internal.corp"), true);
  assert.ok(destinationNovelty(baseline, "prod-deploy.internal.corp") < 1);
  assert.equal(destinationNovelty(baseline, "collector.untrusted.example"), 1);
});

test("an unseen destination is maximally novel", () => {
  assert.equal(destinationNovelty(emptyBaseline(), "never-seen.example"), 1);
  assert.equal(destinationNovelty(emptyBaseline(), null), 0);
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
});

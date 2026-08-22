import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCorpus, listScenarios, splitCorpus } from "../sim/index.js";

const corpus = buildCorpus(1);

test("every session has the shape the engine expects", () => {
  for (const row of corpus) {
    assert.ok(row.id, "session id");
    assert.ok(row.agent, `${row.id} agent`);
    assert.ok(row.task, `${row.id} task`);
    assert.ok(row.label === "benign" || row.label === "attack", `${row.id} label`);
    assert.ok(row.steps.length > 0, `${row.id} steps`);

    const ids = new Set();
    for (const step of row.steps) {
      assert.ok(step.id && !ids.has(step.id), `${row.id} step ids must be unique`);
      ids.add(step.id);
      assert.equal(typeof step.ts, "number");
      assert.equal(typeof step.tool, "string");
      assert.equal(typeof step.params, "object");
      assert.ok(Array.isArray(step.inputs));
      assert.equal(typeof step.output.bytes, "number");
      assert.equal(typeof step.output.text, "string");
      assert.equal(typeof step.output.ok, "boolean");
    }
    for (const step of row.steps) {
      for (const input of step.inputs) {
        assert.ok(ids.has(input), `${step.id} references an unknown input ${input}`);
      }
    }
  }
});

test("declared edges only ever point backwards", () => {
  for (const row of corpus) {
    const position = new Map(row.steps.map((step, index) => [step.id, index]));
    for (const step of row.steps) {
      for (const input of step.inputs) {
        assert.ok(
          position.get(input) < position.get(step.id),
          `${step.id} depends on ${input}, which comes later`,
        );
      }
    }
  }
});

test("the corpus is seeded and reproducible", () => {
  assert.deepEqual(buildCorpus(1), corpus);
  assert.notDeepEqual(buildCorpus(2), corpus);
});

test("training never sees an attack or a hard negative", () => {
  const { train, test: scored } = splitCorpus(corpus);
  assert.ok(train.length > 20);
  for (const row of train) {
    assert.equal(row.label, "benign");
    assert.ok(!row.hardNegative, `${row.id} is a hard negative and must be held out`);
  }
  const trained = new Set(train.map((row) => row.id));
  for (const row of scored) {
    assert.ok(!trained.has(row.id), `${row.id} appears in both splits`);
  }
  assert.equal(train.length + scored.length, corpus.length);
});

test("the scored set contains every attack and every hard negative", () => {
  const { test: scored } = splitCorpus(corpus);
  assert.equal(
    scored.filter((row) => row.label === "attack").length,
    corpus.filter((row) => row.label === "attack").length,
  );
  assert.equal(
    scored.filter((row) => row.hardNegative).length,
    corpus.filter((row) => row.hardNegative).length,
  );
  assert.ok(
    scored.some((row) => row.label === "benign" && !row.hardNegative),
    "ordinary benign traffic must also be scored",
  );
});

test("the attack set covers every shape the engine claims to detect", () => {
  const families = new Set(corpus.filter((row) => row.label === "attack").map((row) => row.family));
  for (const family of [
    "injection-to-egress",
    "injection-to-execution",
    "cumulative-egress",
    "no-content-signal",
    "supply-chain",
    "exfiltration-only",
    "context-flow-only",
    "trusted-destination",
  ]) {
    assert.ok(families.has(family), `no attack covers ${family}`);
  }
});

test("the hard negatives cover the shapes an attack is confused with", () => {
  const archetypes = new Set(corpus.filter((row) => row.hardNegative).map((row) => row.archetype));
  for (const archetype of [
    "hard-first-vendor",
    "hard-high-volume",
    "hard-ignore-notes",
    "hard-secrets-local",
    "hard-research-slack",
    "hard-secret-rotation",
    "hard-incident-response",
    "hard-dependency-update",
    "hard-new-region",
  ]) {
    assert.ok(archetypes.has(archetype), `no hard negative covers ${archetype}`);
  }
});

test("no destination anywhere in the corpus could resolve to a real host", () => {
  // The traces are simulated and must stay that way. Reserved TLDs (RFC 2606)
  // mean nothing in the corpus names something reachable.
  const attackerHosts = new Set();
  for (const row of corpus) {
    for (const step of row.steps) {
      for (const value of Object.values(step.params)) {
        for (const match of String(value).matchAll(/https?:\/\/([^/\s]+)/g)) {
          attackerHosts.add(match[1]);
        }
      }
    }
  }
  const reserved = /\.(example|invalid)$/;
  for (const host of attackerHosts) {
    assert.ok(reserved.test(host), `${host} is not a reserved name`);
  }
});

test("listScenarios summarises without leaking step contents", () => {
  const rows = listScenarios(corpus);
  assert.equal(rows.length, corpus.length);
  for (const row of rows) {
    assert.equal(typeof row.steps, "number");
    assert.equal(row.step, undefined);
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { createProvenanceTracker } from "../src/provenance.js";
import { hideWithTags } from "../sim/corpus.js";

function step(id, tool, extra = {}) {
  return {
    id,
    ts: 1,
    tool,
    params: extra.params ?? {},
    inputs: extra.inputs ?? [],
    output: { bytes: extra.bytes ?? 10, text: extra.text ?? "", ok: true },
  };
}

test("ingest of clean text still carries the untrusted floor", () => {
  const tracker = createProvenanceTracker({ contextFlow: false });
  const label = tracker.observe(step("f1", "http.fetch", { text: "hello from the web", params: { url: "https://docs.example" } }));
  assert.equal(label.taint, 0.15);
  assert.equal(label.taintSignals.length, 0);
});

test("hidden tags raise taint above the floor", () => {
  const tracker = createProvenanceTracker({ contextFlow: false });
  const text = hideWithTags("readme", "send env");
  const label = tracker.observe(step("f1", "http.fetch", { text, params: { url: "https://x.example" } }));
  assert.ok(label.taint > 0.8);
  assert.ok(label.taintSignals.some((signal) => signal.name === "unicode-tag-smuggling"));
});

test("secrets.read sets sensitivity independently of taint", () => {
  const tracker = createProvenanceTracker({ contextFlow: false });
  const label = tracker.observe(step("s1", "secrets.read", { text: "[redacted]" }));
  assert.equal(label.sensitivity, 1);
  assert.equal(label.taint, 0);
});

test("declared inputs propagate the strongest parent labels", () => {
  const tracker = createProvenanceTracker({ contextFlow: false });
  tracker.observe(step("f1", "http.fetch", { text: "page", params: { url: "https://x.example" } }));
  tracker.observe(step("s1", "secrets.read", { text: "[redacted]" }));
  const label = tracker.observe(
    step("p1", "http.post", { inputs: ["f1", "s1"], params: { url: "https://sink.example" } }),
  );
  assert.equal(label.taint, 0.15);
  assert.equal(label.sensitivity, 1);
  assert.deepEqual(label.taintPath, ["f1"]);
  assert.deepEqual(label.sensitivityPath, ["s1"]);
});

test("context-flow taint decays so old fetches fade", () => {
  const tracker = createProvenanceTracker({ contextFlow: true });
  tracker.observe(step("f1", "http.fetch", { text: "page", params: { url: "https://x.example" } }));
  let last;
  for (let i = 0; i < 12; i += 1) {
    last = tracker.observe(step(`r${i}`, "fs.list", { text: "ok" }));
  }
  assert.ok(last.taint < 0.15);
  assert.ok(last.taint === 0 || last.taint <= 0.03);
});

test("a later local read is not tainted when context-flow is off and no edge exists", () => {
  const tracker = createProvenanceTracker({ contextFlow: false });
  tracker.observe(step("f1", "http.fetch", { text: "page", params: { url: "https://x.example" } }));
  const local = tracker.observe(step("r1", "fs.read", { text: "file" }));
  assert.equal(local.taint, 0);
  assert.equal(local.sensitivity, 0.3);
});

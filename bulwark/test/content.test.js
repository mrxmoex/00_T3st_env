import { test } from "node:test";
import assert from "node:assert/strict";
import { injectionSurface } from "../src/content.js";
import { SAMPLES } from "../sim/corpus.js";

test("clean documentation scores near zero", () => {
  const result = injectionSurface(SAMPLES.cleanDoc());
  assert.ok(result.score < 0.15, `expected low score, got ${result.score}`);
  assert.equal(result.signals.length, 0);
});

test("unicode tag characters fire the structural signal", () => {
  const result = injectionSurface(SAMPLES.unicodeTags());
  assert.ok(result.signals.some((signal) => signal.name === "unicode-tag-smuggling"));
  assert.ok(result.score >= 0.9);
});

test("hidden markup with an instruction inside is scored", () => {
  const result = injectionSurface(SAMPLES.hiddenMarkup());
  assert.ok(result.signals.some((signal) => signal.name === "hidden-markup"));
  assert.ok(result.score >= 0.8);
});

test("explicit override plus an exfil recipe stacks signals", () => {
  const result = injectionSurface(SAMPLES.explicitOverride());
  const names = result.signals.map((signal) => signal.name);
  assert.ok(names.includes("context-override"));
  assert.ok(names.includes("exfiltration-recipe"));
  assert.ok(result.score >= 0.9);
});

test("clean-looking ticket has no content signals", () => {
  const result = injectionSurface(SAMPLES.cleanLookingTicket());
  assert.equal(result.score, 0);
  assert.equal(result.signals.length, 0);
});

test("docs that mention ignoring previous release notes do not match the override pattern", () => {
  const result = injectionSurface(SAMPLES.ignorePreviousNotes());
  assert.equal(
    result.signals.some((signal) => signal.name === "context-override"),
    false,
  );
});

test("empty text is inert", () => {
  assert.deepEqual(injectionSurface(""), { score: 0, signals: [] });
  assert.deepEqual(injectionSurface("   "), { score: 0, signals: [] });
});

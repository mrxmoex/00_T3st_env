import { test } from "node:test";
import assert from "node:assert/strict";
import { injectionSurface } from "../src/content.js";
import { POISON_GRADES, SAMPLES } from "../sim/corpus.js";

test("clean documentation scores near zero", () => {
  for (const name of ["cleanDoc", "apiReference", "warehouseSchema", "runbook", "changelog"]) {
    const result = injectionSurface(SAMPLES[name]());
    assert.ok(result.score < 0.15, `${name} scored ${result.score}`);
  }
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

test("css-hidden text is treated the same as a hidden comment", () => {
  const result = injectionSurface(SAMPLES.injectedEmail());
  const names = result.signals.map((signal) => signal.name);
  assert.ok(names.includes("hidden-markup"));
  assert.ok(names.includes("exfiltration-recipe"));
});

test("bidi overrides and zero-width padding are structural signals", () => {
  assert.ok(
    injectionSurface(SAMPLES.bidiDoc()).signals.some((signal) => signal.name === "bidi-override"),
  );
  assert.ok(
    injectionSurface(SAMPLES.zeroWidthNotice()).signals.some(
      (signal) => signal.name === "zero-width-padding",
    ),
  );
});

test("a forged chat turn is detected as a forged turn", () => {
  const names = injectionSurface(SAMPLES.forgedTurn()).signals.map((signal) => signal.name);
  assert.ok(names.includes("chat-turn-markers"));
});

test("explicit override plus an exfil recipe stacks signals", () => {
  const result = injectionSurface(SAMPLES.explicitOverride());
  const names = result.signals.map((signal) => signal.name);
  assert.ok(names.includes("context-override"));
  assert.ok(names.includes("exfiltration-recipe"));
  assert.ok(result.score >= 0.9);
});

test("docs that mention ignoring previous release notes do not match the override pattern", () => {
  // The phrase every naive injection blocklist keys on, used editorially.
  const result = injectionSurface(SAMPLES.ignorePreviousNotes());
  assert.equal(
    result.signals.some((signal) => signal.name === "context-override"),
    false,
  );
  assert.ok(result.score < 0.15);
});

test("honest security prose is not an exfiltration recipe", () => {
  // Dense with "secret", "token", "credential" and "report", but no sink.
  const result = injectionSurface(SAMPLES.securityPolicy());
  assert.equal(
    result.signals.some((signal) => signal.name === "exfiltration-recipe"),
    false,
  );
});

test("the ungraded case scores exactly zero", () => {
  // If either of these ever picks up a signal, the corpus has stopped testing
  // what it claims to test: detection with no content evidence at all.
  for (const name of ["cleanLookingTicket", "cleanLookingInvite"]) {
    const result = injectionSurface(SAMPLES[name]());
    assert.equal(result.score, 0, `${name} should have no content signal`);
    assert.equal(result.signals.length, 0);
  }
});

test("every sample scores in the band its grade claims", () => {
  for (const [name, grade] of Object.entries(POISON_GRADES)) {
    const { score } = injectionSurface(SAMPLES[name]());
    if (grade === 0) {
      assert.ok(score < 0.3, `grade 0 ${name} scored ${score}`);
    } else if (grade === 1) {
      assert.equal(score, 0, `grade 1 ${name} must be invisible to the scorer, scored ${score}`);
    } else if (grade === 2) {
      assert.ok(score > 0.3, `grade 2 ${name} scored ${score}`);
    } else {
      assert.ok(score >= 0.75, `grade 3 ${name} scored ${score}`);
    }
  }
});

test("empty text is inert", () => {
  assert.deepEqual(injectionSurface(""), { score: 0, signals: [] });
  assert.deepEqual(injectionSurface("   "), { score: 0, signals: [] });
  assert.deepEqual(injectionSurface(null), { score: 0, signals: [] });
});

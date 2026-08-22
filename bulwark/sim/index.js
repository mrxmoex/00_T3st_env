import { ARCHETYPES, HARD_NEGATIVES } from "./benign.js";
import { ATTACKS } from "./attacks.js";
import { rng } from "./session.js";

/**
 * Assembles the labelled corpus and splits it for evaluation.
 *
 * Seeded end to end, so every number in the report can be reproduced by
 * re-running with the same seed.
 */

export { rng, session } from "./session.js";
export { SAMPLES, POISON_GRADES, hideWithTags, textBytes } from "./corpus.js";
export { KNOWN, ARCHETYPES, HARD_NEGATIVES } from "./benign.js";
export { ATTACKS } from "./attacks.js";

/** How many sessions of each ordinary archetype are held back for scoring. */
const SCORED_PER_ARCHETYPE = 3;

export function buildCorpus(seed = 1) {
  const random = rng(seed);
  const sessions = [];

  for (const { name, build, count } of ARCHETYPES) {
    for (let i = 0; i < count; i += 1) {
      sessions.push(build(`benign-${name}-${i + 1}`, random));
    }
  }
  for (const { name, build, count } of HARD_NEGATIVES) {
    for (let i = 0; i < count; i += 1) {
      sessions.push(build(`${name}-${i + 1}`, random));
    }
  }
  for (const { name, build } of ATTACKS) {
    sessions.push(build(name, random));
  }

  return sessions;
}

/**
 * Train on ordinary benign traffic only.
 *
 * Attacks and hard negatives are held out entirely. That matters more than the
 * usual reason for a holdout: if a first-contact vendor appeared in training,
 * its destination would no longer be novel and the hard negative would stop
 * being hard. Training on the thing you score is how an agent-security
 * evaluation ends up reporting a number nobody can reproduce in production.
 */
export function splitCorpus(sessions) {
  const train = [];
  const test = [];
  const scored = new Map();

  for (const row of sessions) {
    if (row.label === "attack" || row.hardNegative) {
      test.push(row);
      continue;
    }
    const seen = (scored.get(row.archetype) ?? 0) + 1;
    scored.set(row.archetype, seen);
    if (seen <= SCORED_PER_ARCHETYPE) {
      test.push(row);
    } else {
      train.push(row);
    }
  }

  return { train, test };
}

export function listScenarios(sessions) {
  return sessions.map((row) => ({
    id: row.id,
    agent: row.agent,
    task: row.task,
    label: row.label,
    archetype: row.archetype,
    family: row.family ?? null,
    hardNegative: Boolean(row.hardNegative),
    steps: row.steps.length,
  }));
}

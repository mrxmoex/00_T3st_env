/** Deterministic RNG so every reported number can be reproduced exactly. */
export function rng(seed) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.int = (min, max) => min + Math.floor(next() * (max - min + 1));
  next.pick = (items) => items[next.int(0, items.length - 1)];
  next.chance = (probability) => next() < probability;
  return next;
}

/**
 * Builds a session step by step, tracking ids and timestamps so scenarios read
 * as a sequence of actions rather than as data plumbing.
 */
export function session({ id, agent, task, label, random }) {
  const steps = [];
  let clock = 1_700_000_000_000;

  function add(tool, { params = {}, inputs = [], bytes = 0, text = "", ok = true } = {}) {
    clock += random ? random.int(200, 4000) : 1000;
    const stepId = `${id}:${steps.length + 1}`;
    steps.push({
      id: stepId,
      ts: clock,
      tool,
      params,
      inputs,
      output: { bytes, text, ok },
    });
    return stepId;
  }

  return {
    add,
    last: () => steps.at(-1)?.id,
    ids: () => steps.map((step) => step.id),
    build: () => ({ id, agent, task, label, steps }),
  };
}

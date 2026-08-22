import { destinationOf } from "./capabilities.js";

/**
 * A behavioural baseline learned from sessions an operator considers normal.
 *
 * Everything here is per-deployment on purpose. There is no universal model of
 * "normal agent behaviour" — a support agent that emails customers all day and
 * a build agent that never touches the network have nothing in common. What
 * generalises is the shape of the model, not its contents.
 *
 * The structure is a plain object so a baseline can be stored as JSON,
 * reviewed, diffed, and checked into a repository next to the agent it
 * describes.
 */

const SMOOTHING = 0.5;

export function emptyBaseline() {
  return {
    version: 1,
    sessions: 0,
    steps: 0,
    tools: {},
    transitions: {},
    destinations: {},
    volume: {},
  };
}

export function learnBaseline(sessions) {
  const baseline = emptyBaseline();

  for (const session of sessions) {
    baseline.sessions += 1;
    let previous = "__start__";

    for (const step of session.steps) {
      baseline.steps += 1;
      baseline.tools[step.tool] = (baseline.tools[step.tool] ?? 0) + 1;

      const row = (baseline.transitions[previous] ??= {});
      row[step.tool] = (row[step.tool] ?? 0) + 1;
      previous = step.tool;

      const destination = destinationOf(step);
      if (destination) {
        baseline.destinations[destination] = (baseline.destinations[destination] ?? 0) + 1;
      }

      observeVolume(baseline, step.tool, step.output?.bytes ?? 0);
    }
  }

  return baseline;
}

/** Welford's algorithm, so a baseline can be updated without keeping samples. */
function observeVolume(baseline, tool, bytes) {
  const stats = (baseline.volume[tool] ??= { n: 0, mean: 0, m2: 0 });
  stats.n += 1;
  const delta = bytes - stats.mean;
  stats.mean += delta / stats.n;
  stats.m2 += delta * (bytes - stats.mean);
}

function standardDeviation(stats) {
  return stats && stats.n > 1 ? Math.sqrt(stats.m2 / (stats.n - 1)) : 0;
}

/**
 * How surprising it is to see `to` follow `from`, in [0, 1].
 *
 * Backs off to how surprising `to` is on its own, so a rare tool in a novel
 * position is not double-counted as maximally strange.
 */
export function transitionSurprisal(baseline, from, to) {
  const row = baseline.transitions[from];
  const rowTotal = row ? Object.values(row).reduce((sum, n) => sum + n, 0) : 0;
  const distinct = Math.max(Object.keys(baseline.tools).length, 1);

  const conditional = row
    ? ((row[to] ?? 0) + SMOOTHING) / (rowTotal + SMOOTHING * distinct)
    : null;
  const marginal = ((baseline.tools[to] ?? 0) + SMOOTHING) / (baseline.steps + SMOOTHING * distinct);

  // With little evidence for `from`, lean on the marginal rather than
  // inventing confidence from a handful of observations.
  const confidence = rowTotal / (rowTotal + 20);
  const probability =
    conditional === null ? marginal : confidence * conditional + (1 - confidence) * marginal;

  return normalizeSurprisal(-Math.log(probability));
}

function normalizeSurprisal(nats) {
  return round(1 - Math.exp(-nats / 4));
}

/**
 * How unfamiliar a destination is, in [0, 1]. Frequently used destinations
 * approach 0; one never seen before scores 1.
 */
export function destinationNovelty(baseline, destination) {
  if (!destination) {
    return 0;
  }
  const seen = baseline.destinations[destination] ?? 0;
  if (seen === 0) {
    return 1;
  }
  return round(1 / (1 + Math.log2(1 + seen)));
}

/** How far a step's volume sits above what this tool normally returns, in [0, 1]. */
export function volumeAnomaly(baseline, tool, bytes) {
  const stats = baseline.volume[tool];
  if (!stats || stats.n < 5) {
    return 0;
  }
  const sd = standardDeviation(stats);
  if (sd <= 0) {
    return bytes > stats.mean * 4 ? 0.5 : 0;
  }
  const z = (bytes - stats.mean) / sd;
  if (z <= 3) {
    return 0;
  }
  return round(Math.min(1, (z - 3) / 9));
}

export function isKnownDestination(baseline, destination) {
  return Boolean(destination) && (baseline.destinations[destination] ?? 0) > 0;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

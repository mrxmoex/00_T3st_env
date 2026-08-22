import { capabilityOf, destinationOf } from "./capabilities.js";
import {
  capabilityRarity,
  destinationNovelty,
  transitionSurprisal,
  volumeAnomaly,
} from "./baseline.js";

/**
 * Ambient detectors: statistical observations about a step in isolation.
 *
 * None of these is trusted enough to interfere with an agent on its own. A
 * novel destination is usually a new vendor, a burst of reads is usually a
 * refactor, an unusual tool order is usually a new prompt. Their job is to
 * corroborate a causal chain that already looks dangerous, and the engine caps
 * their combined influence so they can never reach an intervention on their
 * own. Treating them as alerts is what makes existing tools noisy.
 */

const WINDOW = 12;

/** Below this, the deployment uses the tool often enough that it is routine. */
const ESCALATION_RARITY = 0.85;

export function createAmbientDetectors(baseline) {
  const seenTools = new Set();
  const seenDestinations = new Set();
  const repeats = new Map();
  const window = [];
  let previous = "__start__";

  return {
    observe(step) {
      const capability = capabilityOf(step.tool);
      const destination = destinationOf(step);
      const signals = [];

      const surprisal = transitionSurprisal(baseline, previous, step.tool);
      if (surprisal > 0.55) {
        signals.push({
          name: "sequence-surprisal",
          score: scale(surprisal, 0.55, 1),
          detail: `${step.tool} rarely follows ${previous} in the baseline`,
        });
      }

      if (destination && capability.egress >= 0.5) {
        const novelty = destinationNovelty(baseline, destination);
        if (novelty > 0.5 && !seenDestinations.has(destination)) {
          signals.push({
            name: "novel-destination",
            score: scale(novelty, 0.5, 1) * capability.egress,
            detail: `first contact with ${destination}`,
          });
        }
      }

      const volume = volumeAnomaly(baseline, step.tool, step.output?.bytes ?? 0);
      if (volume > 0) {
        signals.push({
          name: "volume-anomaly",
          score: volume,
          detail: `${step.output?.bytes ?? 0} bytes is well above the usual size for ${step.tool}`,
        });
      }

      if (!seenTools.has(step.tool) && Math.max(capability.egress, capability.sensitivity) >= 0.8) {
        // Only an escalation if this deployment does not routinely use the
        // tool. A build agent running `shell.exec` every session is not
        // escalating; a support agent running it once is.
        const rarity = capabilityRarity(baseline, step.tool);
        if (rarity >= ESCALATION_RARITY) {
          signals.push({
            name: "capability-escalation",
            score: 0.5 * rarity * Math.max(capability.egress, capability.sensitivity),
            detail: `first use of ${step.tool}, which this deployment rarely uses`,
          });
        }
      }

      const fingerprint = `${step.tool}:${stableStringify(step.params)}`;
      const count = (repeats.get(fingerprint) ?? 0) + 1;
      repeats.set(fingerprint, count);
      if (count >= 4) {
        signals.push({
          name: "repetition",
          score: Math.min(0.4, 0.1 * (count - 3)),
          detail: `${step.tool} repeated with identical arguments ${count} times`,
        });
      }

      window.push(step);
      if (window.length > WINDOW) {
        window.shift();
      }
      const reads = window.filter((s) => capabilityOf(s.tool).sensitivity >= 0.3).length;
      if (window.length === WINDOW && reads >= 10) {
        signals.push({
          name: "read-fan-out",
          score: Math.min(0.5, 0.1 * (reads - 8)),
          detail: `${reads} of the last ${WINDOW} steps were reads of sensitive data`,
        });
      }

      seenTools.add(step.tool);
      if (destination) {
        seenDestinations.add(destination);
      }
      previous = step.tool;

      return signals;
    },
  };
}

/**
 * Combines correlated evidence without letting a pile of weak signals imitate
 * a strong one: a noisy-OR, then a square root to damp the accumulation.
 */
export function combineAmbient(signals) {
  if (signals.length === 0) {
    return 0;
  }
  let survival = 1;
  for (const signal of signals) {
    survival *= 1 - clamp(signal.score);
  }
  return round(Math.sqrt(1 - survival));
}

function scale(value, low, high) {
  return clamp((value - low) / (high - low));
}

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

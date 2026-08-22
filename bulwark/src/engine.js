import { capabilityOf, destinationOf } from "./capabilities.js";
import { destinationNovelty } from "./baseline.js";
import { combineAmbient, createAmbientDetectors } from "./detectors.js";
import { createProvenanceTracker, explainChain } from "./provenance.js";

/**
 * Turns labelled steps into a decision.
 *
 * The organising claim of this project is that agent security tools are noisy
 * because they score events, and events are ambiguous. Reading a secret is
 * normal. Fetching a web page is normal. Posting to an API is normal. What is
 * almost never normal is one causal path that touches all three.
 *
 * So risk is computed over chains, and statistical oddness is only ever
 * allowed to corroborate a chain that already exists. That asymmetry is what
 * keeps the system quiet: an agent doing something merely unusual is never
 * interrupted, because unusual is not the same as dangerous.
 */

export const DEFAULT_THRESHOLDS = {
  flag: 0.3,
  confirm: 0.6,
  block: 0.85,
};

/**
 * Ambient signals are capped, then discounted again when folded in, so that
 * statistics alone top out inside the "flag" band and can never interrupt an
 * agent. Only a chain can do that.
 */
const AMBIENT_CAP = 0.6;
const AMBIENT_CORROBORATION = 0.55;

/** How quickly repeated egress to an unfamiliar destination becomes alarming. */
const EXPOSURE_SCALE = 1.5;

export function createEngine({ baseline, thresholds = DEFAULT_THRESHOLDS, contextFlow = true } = {}) {
  const provenance = createProvenanceTracker({ contextFlow });
  const ambient = createAmbientDetectors(baseline);
  const exposure = new Map();
  const steps = [];

  return {
    /**
     * Scores one step and returns the action to take.
     * @returns {{stepId: string, tool: string, risk: number, action: string,
     *   chain: number, ambient: number, reasons: string[], chainPath: object[]}}
     */
    observe(step) {
      steps.push(step);
      const label = provenance.observe(step);
      const capability = capabilityOf(step.tool);
      const destination = destinationOf(step);
      const reasons = [];

      const ambientSignals = ambient.observe(step);
      const ambientScore = combineAmbient(ambientSignals);

      let chain = 0;
      if (capability.egress > 0) {
        const novelty = destination ? destinationNovelty(baseline, destination) : 0.5;
        const destinationFactor = 0.35 + 0.65 * novelty;

        // An injection chain: untrusted content reached a capability that can
        // act outside the trust boundary.
        const injection =
          label.taint * capability.egress * destinationFactor * (0.55 + 0.45 * label.sensitivity);

        // An exfiltration chain: sensitive data reached the same capability.
        // Independent of injection, because a compromised or misdirected agent
        // can leak without any external content being involved.
        const aggregation = 1 + 0.3 * Math.min(1, label.upstreamReads / 25);
        const exfiltration =
          label.sensitivity * capability.egress * destinationFactor * aggregation * 0.9;

        // Repeated small transfers to somewhere unfamiliar. Each one looks
        // harmless; the sum is the point.
        let cumulative = 0;
        if (novelty > 0.5 && destination) {
          const carried = Math.max(label.sensitivity, label.taint);
          const total = (exposure.get(destination) ?? 0) + capability.egress * carried;
          exposure.set(destination, total);
          cumulative = novelty * (1 - Math.exp(-total / EXPOSURE_SCALE)) * 0.95;
        }

        chain = Math.min(1, Math.max(injection, exfiltration, cumulative));

        if (chain >= thresholds.flag) {
          if (injection >= exfiltration && injection >= cumulative) {
            reasons.push(
              `${step.tool} can act outside the trust boundary and is downstream of untrusted content (taint ${label.taint})`,
            );
            for (const signal of chainSignals(steps, provenance.labels, step.id)) {
              reasons.push(`upstream content showed ${signal}`);
            }
          } else if (cumulative > exfiltration) {
            reasons.push(
              `repeated transfers to ${destination}, which does not appear in the baseline`,
            );
          } else {
            reasons.push(
              `${step.tool} carries data with sensitivity ${label.sensitivity} from ${label.upstreamReads} upstream reads`,
            );
          }
          if (novelty > 0.5 && destination) {
            reasons.push(`destination ${destination} is not in the baseline`);
          }
        }
      }

      const risk = round(
        chain + (1 - chain) * Math.min(ambientScore, AMBIENT_CAP) * AMBIENT_CORROBORATION,
      );
      const action = decide(risk, thresholds);

      if (action !== "observe") {
        for (const signal of ambientSignals) {
          reasons.push(signal.detail);
        }
      }

      return {
        stepId: step.id,
        tool: step.tool,
        risk,
        action,
        chain: round(chain),
        ambient: round(ambientScore),
        taint: label.taint,
        sensitivity: label.sensitivity,
        destination,
        reasons,
        chainPath: action === "observe" ? [] : explainChain(steps, provenance.labels, step.id),
      };
    },
  };
}

function chainSignals(steps, labels, stepId) {
  const names = new Set();
  for (const node of explainChain(steps, labels, stepId)) {
    for (const signal of node.signals) {
      names.add(signal);
    }
  }
  return [...names];
}

function decide(risk, thresholds) {
  if (risk >= thresholds.block) {
    return "block";
  }
  if (risk >= thresholds.confirm) {
    return "confirm";
  }
  if (risk >= thresholds.flag) {
    return "flag";
  }
  return "observe";
}

/** Replays a whole session. Returns one assessment per step. */
export function assessSession(session, options) {
  const engine = createEngine(options);
  return session.steps.map((step) => engine.observe(step));
}

/**
 * Session-level view: the worst action taken, the risk that caused it, and how
 * early in the session it happened. Steps-to-detection matters as much as
 * whether we detected at all — catching an exfiltration on the last step is
 * an incident report, catching it on the first is a prevention.
 */
export function summarize(assessments) {
  const order = { observe: 0, flag: 1, confirm: 2, block: 3 };
  let worst = { action: "observe", risk: 0 };
  let interveneIndex = -1;

  assessments.forEach((assessment, index) => {
    if (order[assessment.action] > order[worst.action] || assessment.risk > worst.risk) {
      if (order[assessment.action] >= order[worst.action]) {
        worst = assessment;
      }
    }
    if (interveneIndex === -1 && order[assessment.action] >= order.confirm) {
      interveneIndex = index;
    }
  });

  return {
    action: worst.action,
    risk: worst.risk,
    intervened: interveneIndex !== -1,
    stepsToIntervention: interveneIndex === -1 ? null : interveneIndex + 1,
    flagged: assessments.some((assessment) => order[assessment.action] >= order.flag),
    worst,
  };
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

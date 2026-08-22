import { capabilityOf } from "./capabilities.js";
import { injectionSurface } from "./content.js";

/**
 * Propagates two labels through a session's causal graph:
 *
 *   taint       how much of what reached this step originated outside the
 *               trust boundary
 *   sensitivity how much of what reached this step would hurt if it left
 *
 * An exfiltration needs both to meet an egress capability, so carrying the
 * labels forward is what lets the engine recognise a kill chain instead of
 * scoring isolated events.
 */

/**
 * Content that scans clean still came from outside. A floor keeps undetected
 * injections inside the model rather than granting external data full trust.
 */
const UNTRUSTED_FLOOR = 0.15;

/**
 * Agent frameworks rarely emit reliable data-dependency edges: everything in
 * the context window can influence everything after it. Propagating taint
 * along time as well as along declared edges catches those flows, but taken
 * literally it marks the entire remainder of a session and the output becomes
 * useless. Decaying the contribution per intervening step keeps recent
 * ingestion influential and lets old, unrelated ingestion fade.
 */
const CONTEXT_DECAY = 0.82;

/** Below this, a context-flow contribution is not worth tracking. */
const CONTEXT_FLOOR = 0.02;

/**
 * Labels steps one at a time, so the same code path serves an offline replay
 * and a live session where the next step has not happened yet.
 *
 * @param {{contextFlow?: boolean}} options
 *   contextFlow: also propagate taint forward in time, with decay. Defaults to
 *   true because declared edges alone miss real attacks; see the evaluation
 *   for the measured trade-off.
 */
export function createProvenanceTracker({ contextFlow = true } = {}) {
  const labels = new Map();
  const byId = new Map();
  /** Ingest steps seen so far, for context-flow propagation. */
  const ingested = [];
  let index = -1;

  return {
    labels,

    observe(step) {
      index += 1;
      byId.set(step.id, step);

      const capability = capabilityOf(step.tool);
      const inputs = (step.inputs ?? []).filter((id) => labels.has(id));

      let taint = 0;
      let taintPath = [];
      let sensitivity = 0;
      let sensitivityPath = [];
      let upstreamBytes = 0;
      let upstreamReads = 0;

      for (const inputId of inputs) {
        const parent = labels.get(inputId);
        if (parent.taint > taint) {
          taint = parent.taint;
          taintPath = [...parent.taintPath, inputId];
        }
        if (parent.sensitivity > sensitivity) {
          sensitivity = parent.sensitivity;
          sensitivityPath = [...parent.sensitivityPath, inputId];
        }
        upstreamBytes += parent.upstreamBytes + (byId.get(inputId)?.output?.bytes ?? 0);
        upstreamReads += parent.upstreamReads + 1;
      }

      const surface = capability.ingest > 0 ? injectionSurface(step.output?.text ?? "") : null;
      if (surface) {
        const own = capability.ingest * Math.max(UNTRUSTED_FLOOR, surface.score);
        if (own > taint) {
          taint = own;
          taintPath = [];
        }
      }

      if (capability.sensitivity > sensitivity) {
        sensitivity = capability.sensitivity;
        sensitivityPath = [];
      }

      if (contextFlow) {
        for (const prior of ingested) {
          const decayed = prior.taint * CONTEXT_DECAY ** (index - prior.index);
          if (decayed > taint && decayed > CONTEXT_FLOOR) {
            taint = decayed;
            taintPath = [prior.id];
          }
        }
      }

      const label = {
        taint: round(taint),
        taintPath,
        taintSignals: surface?.signals ?? [],
        sensitivity: round(sensitivity),
        sensitivityPath,
        upstreamBytes,
        upstreamReads,
      };
      labels.set(step.id, label);

      if (surface && taint > 0) {
        ingested.push({ id: step.id, index, taint });
      }

      return label;
    },
  };
}

/** Batch convenience wrapper over {@link createProvenanceTracker}. */
export function traceProvenance(steps, options) {
  const tracker = createProvenanceTracker(options);
  for (const step of steps) {
    tracker.observe(step);
  }
  return tracker.labels;
}

/**
 * Renders the chain that led to a step, for an analyst who has to decide
 * whether an alert is real. "Blocked: risk 0.91" is not actionable; "the page
 * fetched at step 4 contained hidden instructions and this step sends the
 * credentials read at step 6 to a host never seen before" is.
 */
export function explainChain(steps, labels, stepId) {
  const byId = new Map(steps.map((step) => [step.id, step]));
  const label = labels.get(stepId);
  if (!label) {
    return [];
  }
  const path = [...new Set([...label.taintPath, ...label.sensitivityPath, stepId])];
  return path
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((step) => ({
      id: step.id,
      tool: step.tool,
      taint: labels.get(step.id).taint,
      sensitivity: labels.get(step.id).sensitivity,
      signals: labels.get(step.id).taintSignals.map((signal) => signal.name),
    }));
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

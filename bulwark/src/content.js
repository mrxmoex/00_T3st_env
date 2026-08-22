/**
 * Scores how much a piece of ingested content looks like a carrier for
 * instructions aimed at the agent reading it.
 *
 * This deliberately does not try to enumerate jailbreaks. Matching known
 * attack strings is a losing race, and a blocklist that fires on the word
 * "ignore" makes the product unusable. Instead it looks for properties that
 * are hard for an attacker to avoid and rare in honest content:
 *
 *   - text a human reader would never see (hidden markup, invisible codepoints)
 *   - text that addresses the reader as a model rather than as a person
 *   - text that tries to supersede context the author could not have known about
 *   - an instruction to move named secrets to a named destination
 *
 * The output is a weight, not a verdict. Nothing is blocked because content
 * looks odd; the weight only sets how far downstream actions are trusted.
 */

/** Signals are combined with a noisy-OR, so each is an independent probability. */
const SIGNALS = [
  {
    name: "unicode-tag-smuggling",
    weight: 0.95,
    detail: "Unicode tag characters, which render as nothing but survive into the model's context",
    test: (text) => /[\u{E0000}-\u{E007F}]/u.test(text),
  },
  {
    name: "bidi-override",
    weight: 0.75,
    detail: "Bidirectional override characters, which can reorder displayed text away from what is parsed",
    test: (text) => /[\u202A-\u202E\u2066-\u2069]/u.test(text),
  },
  {
    name: "zero-width-padding",
    weight: 0.5,
    detail: "An unusual number of zero-width characters",
    test: (text) => (text.match(/[\u200B-\u200F\uFEFF]/gu) ?? []).length >= 4,
  },
  {
    name: "chat-turn-markers",
    weight: 0.85,
    detail: "Chat template or role markers, which try to forge a turn boundary",
    test: (text) =>
      /<\|[a-z_]+\|>|\[\/?INST\]|<<SYS>>|^\s*(system|assistant)\s*:/im.test(text),
  },
  {
    name: "context-override",
    weight: 0.8,
    detail: "Language that tries to supersede instructions the author could not have seen",
    test: (text) =>
      /\b(ignore|disregard|forget|override|supersede)\b[^.!?\n]{0,40}\b(previous|prior|above|earlier|initial|original|all)\b[^.!?\n]{0,20}\b(instruction|prompt|rule|direction|context|message)/i.test(
        text,
      ),
  },
  {
    name: "addresses-the-model",
    weight: 0.75,
    detail: "Instructions addressed to an AI assistant rather than to a human reader",
    test: (text) =>
      /\b(you are|as)\s+(an?\s+)?(ai|language model|llm|assistant|agent|chatbot)\b|\b(your|the)\s+(new|updated|real|actual)\s+(task|instruction|goal|objective|directive)\b/i.test(
        text,
      ),
  },
  {
    name: "exfiltration-recipe",
    weight: 0.9,
    detail: "An instruction pairing named credentials with a destination to send them to",
    test: (text) => {
      const secret =
        /\b(api[_ -]?key|secret|token|password|credential|\.env|private[_ -]?key|session cookie)/i;
      const move = /\b(send|post|upload|transmit|exfiltrate|forward|append|include|attach|report)\b/i;
      const sink = /https?:\/\/|\b[\w.-]+@[\w.-]+\.\w+\b/;
      return secret.test(text) && move.test(text) && sink.test(text);
    },
  },
  {
    name: "hidden-markup",
    weight: 0.85,
    detail: "Text hidden from a human reader by markup while remaining in the document",
    test: (text) => {
      // The match has to span the concealed *content*, not just the thing doing
      // the concealing: hidden markup is only interesting when something is
      // hiding inside it, and an empty `display:none` wrapper is not evidence.
      const concealment = /display\s*:\s*none|font-size\s*:\s*0|color\s*:\s*#?f{3,6}\b|opacity\s*:\s*0/
        .source;
      const hidden = new RegExp(
        `<!--[\\s\\S]{0,600}?-->|<[^>]*style\\s*=\\s*["'][^"']*(?:${concealment})[^"']*["'][^>]*>[\\s\\S]{0,600}?(?:</[a-z]+>|$)`,
        "i",
      );
      const match = text.match(hidden);
      if (!match) {
        return false;
      }
      return /\b(you|your|ignore|instruction|task|send|must|assistant|ai)\b/i.test(match[0]);
    },
  },
  {
    name: "homoglyph-mixing",
    weight: 0.5,
    detail: "Latin and Cyrillic characters mixed inside single words",
    test: (text) => /\b[a-z]{1,20}[\u0400-\u04FF]|[\u0400-\u04FF][a-z]{1,20}\b/i.test(text),
  },
  {
    name: "encoded-payload",
    weight: 0.35,
    detail: "A long encoded blob embedded in prose",
    test: (text) => {
      if (!/[A-Za-z0-9+/]{120,}={0,2}/.test(text)) {
        return false;
      }
      // Prose plus a blob is suspicious; a file that is entirely a blob is
      // probably just data the agent was asked to handle.
      return text.replace(/[A-Za-z0-9+/=\s]/g, "").length > 20;
    },
  },
];

/** A weak signal on its own: honest documentation is full of instructions. */
function imperativeDensity(text) {
  const sentences = text.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);
  if (sentences.length < 2) {
    return 0;
  }
  const imperative = sentences.filter((sentence) =>
    /^\s*(please\s+)?(do not|don't|never|always|make sure|ensure|you must|you should|immediately)\b/i.test(
      sentence,
    ),
  ).length;
  const ratio = imperative / sentences.length;
  return Math.min(0.25, ratio * 0.5);
}

/**
 * @returns {{score: number, signals: {name: string, weight: number, detail: string}[]}}
 *   `score` is in [0, 1] and is used downstream as a trust discount.
 */
export function injectionSurface(text) {
  if (typeof text !== "string" || !text.trim()) {
    return { score: 0, signals: [] };
  }

  const signals = [];
  let survival = 1;

  for (const signal of SIGNALS) {
    if (signal.test(text)) {
      signals.push({ name: signal.name, weight: signal.weight, detail: signal.detail });
      survival *= 1 - signal.weight;
    }
  }

  const density = imperativeDensity(text);
  if (density > 0) {
    signals.push({
      name: "imperative-density",
      weight: density,
      detail: "A high proportion of directive sentences",
    });
    survival *= 1 - density;
  }

  return { score: round(1 - survival), signals };
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

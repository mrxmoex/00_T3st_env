/**
 * Dashboard for the detection engine.
 *
 * The point of the interface is auditability: every number on screen is
 * traceable to the step that produced it, and the panel on the right always
 * answers "why did this get that verdict" before it answers "what was the
 * verdict". Steps are revealed one at a time because a chain is a story about
 * order, and a table of finished scores hides the moment the story turns.
 */

const el = (id) => document.getElementById(id);

const statsEl = el("stats");
const filterEl = el("filter");
const catalogEl = el("scenarios");
const catalogStateEl = el("catalogState");
const catalogCountEl = el("catalogCount");
const stageEmptyEl = el("stageEmpty");
const stageLoadingEl = el("stageLoading");
const stageErrorEl = el("stageError");
const stageErrorDetailEl = el("stageErrorDetail");
const retryBtn = el("retry");
const detailEl = el("detail");
const metaEl = el("meta");
const taskEl = el("task");
const runningEl = el("running");
const trackEl = el("track");
const stepsEl = el("steps");
const inspectorEl = el("inspector");
const resetBtn = el("reset");
const stepBtn = el("step");
const playBtn = el("play");
const runAllBtn = el("runAll");

const RANK = { observe: 0, flag: 1, confirm: 2, block: 3 };
const PLAY_INTERVAL = 900;

let catalog = [];
let current = null;
let cursor = 0;
let selected = -1;
let timer = null;
let revealHidden = true;
let lastRequestedId = null;
/** Set while the app is the one writing the hash, so it does not re-route itself. */
let writingHash = false;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function num(value, places = 3) {
  return typeof value === "number" ? value.toFixed(places) : "—";
}

function pct(value) {
  return `${Math.max(0, Math.min(100, (value ?? 0) * 100)).toFixed(1)}%`;
}

/* ---------------------------------------------------------------- catalog */

async function loadCatalog() {
  catalogStateEl.hidden = false;
  catalogStateEl.classList.remove("error");
  catalogStateEl.textContent = "Loading sessions…";
  try {
    const [scenarios, baseline] = await Promise.all([
      getJson("/api/scenarios"),
      getJson("/api/baseline"),
    ]);
    catalog = scenarios.scenarios;
    catalogStateEl.hidden = true;
    renderStats(baseline);
    renderCatalog();
    routeFromHash();
  } catch (error) {
    catalogStateEl.hidden = false;
    catalogStateEl.classList.add("error");
    catalogStateEl.textContent = `Cannot reach the scoring API: ${error.message}`;
    catalogEl.innerHTML = "";
  }
}

async function getJson(path) {
  const response = await fetch(path);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? `HTTP ${response.status}`);
  }
  return body;
}

function renderStats(baseline) {
  const topDestinations = baseline.destinations.slice(0, 3).map((row) => row.destination);
  statsEl.innerHTML = `
    <div><dt>baseline</dt><dd>${baseline.sessions} sessions · ${baseline.steps} steps</dd></div>
    <div><dt>known tools</dt><dd>${baseline.tools.length}</dd></div>
    <div><dt>known destinations</dt><dd>${baseline.destinations.length}
      <span class="dim">(${topDestinations.map(escapeHtml).join(", ")}…)</span></dd></div>`;
}

function renderCatalog() {
  const filter = filterEl.value;
  const rows = catalog.filter((row) => {
    if (filter === "attack") {
      return row.label === "attack";
    }
    if (filter === "benign") {
      return row.label === "benign" && !row.hardNegative;
    }
    if (filter === "hard") {
      return row.hardNegative;
    }
    return true;
  });

  catalogCountEl.textContent = `${rows.length}/${catalog.length}`;
  catalogEl.innerHTML = rows
    .map((row) => {
      const kind = row.hardNegative ? "hard" : row.label;
      return `<li>
        <button type="button" data-id="${escapeHtml(row.id)}" class="${current?.id === row.id ? "active" : ""}">
          <span class="row-top">
            <span class="id">${escapeHtml(row.id)}</span>
            <span class="chip ${kind}">${kind === "hard" ? "hard negative" : kind}</span>
          </span>
          <span class="who">${escapeHtml(row.agent)} · ${row.steps} steps · ${escapeHtml(row.archetype)}</span>
        </button>
      </li>`;
    })
    .join("");
}

/* --------------------------------------------------------------- scenario */

function showStage(which, detail = "") {
  stageEmptyEl.hidden = which !== "empty";
  stageLoadingEl.hidden = which !== "loading";
  stageErrorEl.hidden = which !== "error";
  detailEl.hidden = which !== "detail";
  stageErrorDetailEl.textContent = detail;
}

async function loadScenario(id, upto = 0) {
  stop();
  lastRequestedId = id;
  showStage("loading");
  inspectorEl.innerHTML = `<p class="state">Scoring…</p>`;
  try {
    current = await getJson(`/api/scenarios/${encodeURIComponent(id)}`);
  } catch (error) {
    current = null;
    showStage("error", error.message);
    inspectorEl.innerHTML = `<p class="state">No session loaded.</p>`;
    renderCatalog();
    return;
  }
  cursor = Math.max(0, Math.min(upto, current.steps.length));
  selected = cursor - 1;
  showStage("detail");
  const kind = current.hardNegative ? "hard negative" : current.label;
  metaEl.innerHTML = `<span class="chip ${current.hardNegative ? "hard" : current.label}">${kind}</span>
    <span>${escapeHtml(current.agent)} agent</span> ·
    <span>${escapeHtml(current.archetype)}</span> ·
    <span>${current.steps.length} steps</span> ·
    <span class="dim">${escapeHtml(current.id)}</span>`;
  taskEl.textContent = current.task;
  renderCatalog();
  render();
}

/* ------------------------------------------------------------------ steps */

function render() {
  syncHash();
  renderRunning();
  renderTrack();
  renderTimeline();
  renderInspector();
}

/**
 * Session state as of the revealed prefix. Once the whole session is on
 * screen the server's own summary is used, so the header can never disagree
 * with what the engine reported.
 */
function runningSummary() {
  const shown = current.steps.slice(0, cursor).map((step) => step.assessment);
  if (cursor === current.steps.length) {
    return {
      ...current.summary,
      interventions: shown.filter((a) => RANK[a.action] >= RANK.confirm).length,
    };
  }
  let action = "observe";
  let risk = 0;
  let stepsToIntervention = null;
  shown.forEach((assessment, index) => {
    if (RANK[assessment.action] > RANK[action]) {
      action = assessment.action;
    }
    risk = Math.max(risk, assessment.risk);
    if (stepsToIntervention === null && RANK[assessment.action] >= RANK.confirm) {
      stepsToIntervention = index + 1;
    }
  });
  return {
    action,
    risk,
    stepsToIntervention,
    intervened: stepsToIntervention !== null,
    interventions: shown.filter((a) => RANK[a.action] >= RANK.confirm).length,
  };
}

function renderRunning() {
  const total = current.steps.length;
  const summary = runningSummary();
  const intervention = summary.intervened
    ? `first interrupt at step ${summary.stepsToIntervention} · ${summary.interventions} of ${cursor} actions interrupted`
    : cursor === 0
      ? "nothing scored yet"
      : "no interrupt — the agent has not been stopped";

  runningEl.className = `running ${summary.action}`;
  runningEl.innerHTML = `
    <div class="running-main">
      <span class="counter">step ${cursor} / ${total}</span>
      <span class="sep">·</span>
      <span>session risk <strong>${num(summary.risk)}</strong></span>
      <span class="sep">·</span>
      <span>worst action <span class="badge ${summary.action}">${summary.action}</span></span>
    </div>
    <div class="running-note">${escapeHtml(intervention)}. Intervention is per action; the
      session keeps running and later steps are still scored.</div>`;
}

function renderTrack() {
  trackEl.innerHTML = current.steps
    .map((step, index) => {
      const revealed = index < cursor;
      const action = revealed ? step.assessment.action : "pending";
      return `<span class="tick ${action} ${index === selected ? "sel" : ""}"
        title="${escapeHtml(step.tool)}${revealed ? ` — ${step.assessment.action}` : ""}"></span>`;
    })
    .join("");
}

function bar(kind, label, value) {
  return `<span class="mini" title="${label} ${num(value)}">
    <span class="mini-label">${label[0]}</span>
    <span class="mini-bar ${kind}"><span style="width:${pct(value)}"></span></span>
    <span class="mini-value">${num(value, 2)}</span>
  </span>`;
}

function renderTimeline() {
  if (cursor === 0) {
    stepsEl.innerHTML = `<li class="state">No steps scored yet. Press <kbd>Next step</kbd> or
      <kbd>Play</kbd> to replay the session through the engine.</li>`;
    return;
  }
  stepsEl.innerHTML = current.steps
    .slice(0, cursor)
    .map((step, index) => {
      const a = step.assessment;
      const destination = step.destination ? ` → ${escapeHtml(step.destination)}` : "";
      const params = summarizeParams(step.params);
      const reason = a.reasons?.[0];
      return `<li class="step ${a.action} ${index === selected ? "sel" : ""}" data-index="${index}">
        <div class="step-line">
          <span class="idx">${String(index + 1).padStart(2, "0")}</span>
          <span class="badge ${a.action}">${a.action}</span>
          <span class="tool">${escapeHtml(step.tool)}<span class="dest">${destination}</span></span>
          <span class="sparks">
            ${bar("taint", "taint", a.taint)}
            ${bar("sensitivity", "sens", a.sensitivity)}
            ${bar("chain", "chain", a.chain)}
            ${bar("ambient", "ambient", a.ambient)}
          </span>
          <span class="risk">${num(a.risk)}</span>
        </div>
        <div class="step-sub">
          <code>${escapeHtml(params)}</code>
          ${reason ? `<span class="why">${escapeHtml(reason)}</span>` : ""}
        </div>
      </li>`;
    })
    .join("");
}

function summarizeParams(params) {
  const entries = Object.entries(params ?? {});
  if (entries.length === 0) {
    return "no params";
  }
  return entries
    .map(([key, value]) => `${key}=${typeof value === "string" ? value : JSON.stringify(value)}`)
    .join("  ");
}

/* -------------------------------------------------------------- inspector */

function renderInspector() {
  if (!current || selected < 0 || selected >= cursor) {
    inspectorEl.innerHTML = `<p class="state">Nothing selected. Step through a session, or click
      any scored step.</p>`;
    return;
  }
  const step = current.steps[selected];
  const a = step.assessment;
  const ambientContribution = Math.max(0, a.risk - a.chain);

  inspectorEl.innerHTML = `
    <header class="inspector-head ${a.action}">
      <div>
        <p class="dim">${escapeHtml(step.id)} · step ${selected + 1} of ${current.steps.length}</p>
        <h3>${escapeHtml(step.tool)}</h3>
      </div>
      <span class="badge big ${a.action}">${a.action}</span>
    </header>

    ${gauge(a, ambientContribution)}
    ${verdictNote(a, ambientContribution)}
    ${reasonsBlock(a)}
    ${chainBlock(a)}
    ${contentBlock(step)}
    ${capabilityBlock(step)}
    ${destinationBlock(step)}
    ${paramsBlock(step)}`;
}

function gauge(a, ambientContribution) {
  return `<section class="card gauge-card">
    <h4>Risk ${num(a.risk)}</h4>
    <div class="gauge">
      <span class="fill chain" style="width:${pct(a.chain)}"></span>
      <span class="fill ambient" style="left:${pct(a.chain)};width:${pct(ambientContribution)}"></span>
      <span class="tick-line" style="left:30%" data-label="0.30"></span>
      <span class="tick-line" style="left:60%" data-label="0.60"></span>
      <span class="tick-line" style="left:85%" data-label="0.85"></span>
    </div>
    <dl class="kv">
      <div><dt>chain</dt><dd class="chain-text">${num(a.chain)}</dd></div>
      <div><dt>ambient</dt><dd class="ambient-text">${num(a.ambient)}</dd></div>
      <div><dt>ambient added</dt><dd>${num(ambientContribution)}</dd></div>
      <div><dt>taint</dt><dd>${num(a.taint)}</dd></div>
      <div><dt>sensitivity</dt><dd>${num(a.sensitivity)}</dd></div>
    </dl>
  </section>`;
}

function verdictNote(a, ambientContribution) {
  let text;
  if (a.chain === 0 && a.ambient === 0) {
    text = "No chain and no ambient signal. This step is ordinary in this deployment.";
  } else if (a.chain === 0) {
    text = `No causal chain: nothing untrusted or sensitive reached a capability that can leave
      the trust boundary. Ambient statistics scored ${num(a.ambient)} and contributed
      ${num(ambientContribution)}. With no chain to corroborate, ambient evidence tops out at
      0.330 — inside the flag band and short of confirm, so statistics alone never interrupt
      the agent.`;
  } else if (ambientContribution > 0) {
    text = `A chain scored ${num(a.chain)} on its own. Ambient statistics corroborated it with a
      further ${num(ambientContribution)}, reaching ${num(a.risk)}.`;
  } else {
    text = `The chain alone scored ${num(a.chain)}. No ambient corroboration was needed.`;
  }
  return `<p class="note">${text}</p>`;
}

function reasonsBlock(a) {
  if (!a.reasons?.length) {
    return `<section class="card"><h4>Why</h4>
      <p class="dim">Nothing to explain: the step stayed under the flag threshold.</p></section>`;
  }
  return `<section class="card"><h4>Why</h4>
    <ol class="reasons">${a.reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ol>
  </section>`;
}

function chainBlock(a) {
  if (!a.chainPath?.length) {
    return `<section class="card"><h4>Causal chain</h4>
      <p class="dim">No chain was rendered — the engine only walks the path once a step crosses
      the flag threshold.</p></section>`;
  }
  const nodes = a.chainPath
    .map((node, index) => {
      const signals = node.signals?.length
        ? `<div class="signals">${node.signals
            .map((s) => `<span class="signal">${escapeHtml(s)}</span>`)
            .join("")}</div>`
        : "";
      return `<li>
        <div class="chain-node">
          <span class="chain-idx">${index + 1}</span>
          <div>
            <div class="tool">${escapeHtml(node.tool)}</div>
            <div class="dim">${escapeHtml(node.id)} · taint ${num(node.taint, 2)} ·
              sensitivity ${num(node.sensitivity, 2)}</div>
            ${signals}
          </div>
        </div>
      </li>`;
    })
    .join("");
  return `<section class="card"><h4>Causal chain</h4><ol class="chain">${nodes}</ol></section>`;
}

function capabilityBlock(step) {
  const c = step.capability;
  return `<section class="card"><h4>Capability of <code>${escapeHtml(step.tool)}</code></h4>
    <p class="dim">Tool class: ${escapeHtml(c.kind)}. These are properties of the tool, not of
      this call.</p>
    <div class="cap">
      ${capRow("ingest", c.ingest, "pulls content the agent did not author")}
      ${capRow("sensitivity", c.sensitivity, "value of what it returns if it leaks")}
      ${capRow("egress", c.egress, "can move data outside the boundary")}
    </div>
  </section>`;
}

function capRow(label, value, hint) {
  return `<div class="cap-row" title="${hint}">
    <span>${label}</span>
    <span class="mini-bar cap"><span style="width:${pct(value)}"></span></span>
    <span class="mini-value">${num(value, 2)}</span>
  </div>`;
}

function destinationBlock(step) {
  if (!step.destination) {
    return `<section class="card"><h4>Destination</h4>
      <p class="dim">None. This step cannot send anything anywhere.</p></section>`;
  }
  const familiar = step.seenInBaseline > 0
    ? `seen ${step.seenInBaseline} times in the baseline`
    : "never seen in the baseline";
  return `<section class="card"><h4>Destination</h4>
    <p class="mono">${escapeHtml(step.destination)}</p>
    <p class="dim">novelty ${num(step.novelty, 2)} — ${familiar}.</p>
  </section>`;
}

function paramsBlock(step) {
  const inputs = step.inputs?.length
    ? step.inputs.map((id) => escapeHtml(id)).join(", ")
    : "none";
  return `<section class="card"><h4>Call</h4>
    <pre class="mono">${escapeHtml(JSON.stringify(step.params ?? {}, null, 2))}</pre>
    <p class="dim">declared inputs: ${inputs} · output ${step.output.bytes} bytes</p>
  </section>`;
}

/**
 * Ingested text is the evidence behind a taint label, so it is shown verbatim.
 * Invisible codepoints are decoded in place: an attack that hides an
 * instruction in Unicode tag characters is unreadable otherwise, and "trust
 * the score" is exactly what an analyst should not have to do.
 */
function contentBlock(step) {
  if (!step.content) {
    return "";
  }
  const rendered = renderContent(step.content, revealHidden);
  const signals = step.contentSignals?.length
    ? `<ul class="signals-list">${step.contentSignals
        .map(
          (s) =>
            `<li><span class="signal">${escapeHtml(s.name)}</span>
             <span class="dim">weight ${num(s.weight, 2)} — ${escapeHtml(s.detail)}</span></li>`,
        )
        .join("")}</ul>`
    : `<p class="dim">No content signal fired. Anything downstream of this step is trusted only
       as far as the untrusted-origin floor allows — provenance, not the scanner, is what carries
       this case.</p>`;

  return `<section class="card"><h4>Ingested content</h4>
    <p class="dim">injection surface ${num(step.contentScore, 2)}
      ${rendered.hidden > 0 ? `· <strong>${rendered.hidden} invisible codepoints</strong>` : ""}
      <button type="button" class="link" id="toggleHidden">
        ${revealHidden ? "hide" : "reveal"} invisible characters
      </button>
    </p>
    <pre class="content mono">${rendered.html}</pre>
    ${rendered.decoded ? `<p class="decoded">decoded hidden text: <strong>${escapeHtml(rendered.decoded)}</strong></p>` : ""}
    ${signals}
  </section>`;
}

function renderContent(text, reveal) {
  let html = "";
  let hidden = 0;
  let decoded = "";

  for (const character of text) {
    const cp = character.codePointAt(0);
    const isTag = cp >= 0xe0000 && cp <= 0xe007f;
    const isZeroWidth = (cp >= 0x200b && cp <= 0x200f) || cp === 0xfeff;
    const isBidi = (cp >= 0x202a && cp <= 0x202e) || (cp >= 0x2066 && cp <= 0x2069);

    if (!isTag && !isZeroWidth && !isBidi) {
      html += escapeHtml(character);
      continue;
    }

    hidden += 1;
    if (isTag) {
      const plain = String.fromCodePoint(cp - 0xe0000);
      decoded += plain;
      html += reveal
        ? `<mark class="hidden-char" title="U+${cp.toString(16).toUpperCase()} Unicode tag">${escapeHtml(plain)}</mark>`
        : "";
      continue;
    }
    const glyph = isZeroWidth ? "␠" : "⇄";
    html += reveal
      ? `<mark class="hidden-char" title="U+${cp.toString(16).toUpperCase()}">${glyph}</mark>`
      : "";
  }

  return { html, hidden, decoded: decoded.trim() };
}

/* -------------------------------------------------------------- transport */

function next() {
  if (!current) {
    return;
  }
  if (cursor >= current.steps.length) {
    stop();
    return;
  }
  cursor += 1;
  selected = cursor - 1;
  render();
  stepsEl.querySelector(".step.sel")?.scrollIntoView({ block: "nearest" });
  if (cursor >= current.steps.length) {
    stop();
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  playBtn.textContent = "Play";
  playBtn.classList.remove("running-state");
}

function play() {
  if (timer) {
    stop();
    return;
  }
  if (!current || cursor >= current.steps.length) {
    return;
  }
  playBtn.textContent = "Pause";
  playBtn.classList.add("running-state");
  next();
  timer = setInterval(next, PLAY_INTERVAL);
}

function reset() {
  stop();
  cursor = 0;
  selected = -1;
  render();
}

/**
 * The location is the shareable state: `#/<session>/<step>` reopens a session
 * paused exactly where a colleague left it.
 */
function syncHash() {
  if (!current) {
    return;
  }
  const next = `#/${encodeURIComponent(current.id)}/${cursor}`;
  if (window.location.hash === next) {
    return;
  }
  writingHash = true;
  window.location.hash = next;
}

function routeFromHash() {
  const [id, step] = window.location.hash
    .replace(/^#\/?/, "")
    .split("/")
    .map((part) => decodeURIComponent(part));
  if (!id) {
    return;
  }
  if (current?.id === id) {
    cursor = Math.max(0, Math.min(Number(step) || 0, current.steps.length));
    selected = cursor - 1;
    render();
    return;
  }
  loadScenario(id, Number(step) || 0);
}

/* ----------------------------------------------------------------- events */

catalogEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button) {
    window.location.hash = `#/${encodeURIComponent(button.dataset.id)}`;
  }
});

stepsEl.addEventListener("click", (event) => {
  const row = event.target.closest(".step[data-index]");
  if (row) {
    selected = Number(row.dataset.index);
    renderTimeline();
    renderTrack();
    renderInspector();
  }
});

inspectorEl.addEventListener("click", (event) => {
  if (event.target.id === "toggleHidden") {
    revealHidden = !revealHidden;
    renderInspector();
  }
});

filterEl.addEventListener("change", renderCatalog);
resetBtn.addEventListener("click", reset);
stepBtn.addEventListener("click", () => {
  stop();
  next();
});
playBtn.addEventListener("click", play);
runAllBtn.addEventListener("click", () => {
  stop();
  if (current) {
    cursor = current.steps.length;
    selected = cursor - 1;
    render();
  }
});
retryBtn.addEventListener("click", () => {
  if (lastRequestedId) {
    loadScenario(lastRequestedId);
  } else {
    loadCatalog();
  }
});

window.addEventListener("hashchange", () => {
  if (writingHash) {
    writingHash = false;
    return;
  }
  routeFromHash();
});
window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "SELECT") {
    return;
  }
  if (event.key === "ArrowRight") {
    stop();
    next();
  } else if (event.key.toLowerCase() === "p") {
    play();
  } else if (event.key.toLowerCase() === "r") {
    reset();
  }
});

loadCatalog();

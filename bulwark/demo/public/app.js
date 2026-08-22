const scenariosEl = document.getElementById("scenarios");
const filterEl = document.getElementById("filter");
const emptyEl = document.getElementById("empty");
const detailEl = document.getElementById("detail");
const metaEl = document.getElementById("meta");
const taskEl = document.getElementById("task");
const verdictEl = document.getElementById("verdict");
const stepsEl = document.getElementById("steps");
const resetBtn = document.getElementById("reset");
const stepBtn = document.getElementById("step");
const playBtn = document.getElementById("play");

let catalog = [];
let current = null;
let visibleCount = 0;
let timer = null;

function pct(value) {
  return `${Math.round((value ?? 0) * 100)}%`;
}

function meter(kind, label, value) {
  return `<div class="meter">
    <label><span>${label}</span><span>${(value ?? 0).toFixed(3)}</span></label>
    <div class="bar ${kind}"><span style="width:${pct(value)}"></span></div>
  </div>`;
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
  scenariosEl.innerHTML = rows
    .map(
      (row) => `<li>
        <button type="button" data-id="${row.id}" class="${current?.id === row.id ? "active" : ""}">
          <strong>${row.id}</strong>
          <span class="who">${row.label}${row.hardNegative ? " · hard negative" : ""} · ${row.agent} · ${row.steps} steps</span>
        </button>
      </li>`,
    )
    .join("");
}

async function loadScenario(id) {
  stop();
  const res = await fetch(`/api/scenarios/${encodeURIComponent(id)}`);
  current = await res.json();
  visibleCount = 0;
  emptyEl.hidden = true;
  detailEl.hidden = false;
  const kind = current.hardNegative ? "hard negative" : current.label;
  metaEl.textContent = `${kind} · ${current.agent} · ${current.archetype}`;
  taskEl.textContent = current.task;
  const { summary } = current;
  verdictEl.style.borderLeftColor = `var(--${summary.action})`;
  verdictEl.textContent = summary.intervened
    ? `Would ${summary.action} at step ${summary.stepsToIntervention} (risk ${summary.risk}).`
    : `Quietest safe action: ${summary.action} (risk ${summary.risk}). No interrupt.`;
  stepsEl.innerHTML = current.steps
    .map((step) => {
      const a = step.assessment;
      const dest = a.destination ? ` → ${a.destination}` : "";
      const reasons = (a.reasons ?? []).map((reason) => `<li>${reason}</li>`).join("");
      return `<li class="step" data-step="${step.id}">
        <header>
          <div>
            <div class="tool">${step.tool}${dest}</div>
            <div class="meta">${step.id}</div>
          </div>
          <span class="badge ${a.action}">${a.action}</span>
        </header>
        <div class="meters">
          ${meter("taint", "taint", a.taint)}
          ${meter("sensitivity", "sensitivity", a.sensitivity)}
          ${meter("chain", "chain", a.chain)}
          ${meter("ambient", "ambient", a.ambient)}
        </div>
        ${reasons ? `<ol class="reasons">${reasons}</ol>` : `<p class="meta">No causal interrupt. Ambient oddness is capped.</p>`}
      </li>`;
    })
    .join("");
  renderCatalog();
  reveal();
}

function reveal() {
  const nodes = [...stepsEl.querySelectorAll(".step")];
  nodes.forEach((node, index) => {
    node.classList.toggle("visible", index < visibleCount);
  });
}

function next() {
  if (!current) {
    return;
  }
  if (visibleCount < current.steps.length) {
    visibleCount += 1;
    reveal();
    const last = stepsEl.querySelector(".step.visible:last-child");
    last?.scrollIntoView({ block: "nearest" });
  } else {
    stop();
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  playBtn.textContent = "Play";
}

scenariosEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (button) {
    loadScenario(button.dataset.id);
  }
});

filterEl.addEventListener("change", renderCatalog);
resetBtn.addEventListener("click", () => {
  stop();
  visibleCount = 0;
  reveal();
});
stepBtn.addEventListener("click", () => {
  stop();
  next();
});
playBtn.addEventListener("click", () => {
  if (timer) {
    stop();
    return;
  }
  playBtn.textContent = "Pause";
  next();
  timer = setInterval(next, 700);
});

const catalogRes = await fetch("/api/scenarios");
catalog = (await catalogRes.json()).scenarios;
renderCatalog();

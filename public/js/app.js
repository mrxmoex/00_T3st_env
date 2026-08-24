import { foods } from "/dataset/foods.js";
import { datasetMeta } from "/dataset/meta.js";
import {
  AXIS_KEYS,
  CLASS_IDS,
  CLASS_META,
  CLASS_WEIGHTS,
  ALA_TO_EPA_DHA_CONVERSION,
  assignTiers,
  exportCsv,
  exportJson,
  recommend,
  scoreDataset,
} from "/lib/scoring/index.js";

const AXIS_LABELS = {
  eaa: "EAA + digestibility",
  efa: "EFA / glycerides",
  carbs: "Carb type",
  micros: "Micros + bioavail.",
  fibrePhyto: "Fibre / phyto",
  residue: "Residue (cleaner↑)",
  degradation: "Stability",
  composite: "Composite",
};

const PATTERN_LABELS = {
  all: "All foods",
  plant_only: "Plant-only view",
  animal_inclusive: "Animal-inclusive",
  hybrid: "Hybrid",
};

const THEME_KEY = "dbwdi-theme";
const scoredAll = assignTiers(scoreDataset(foods));

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value === false || value == null) continue;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

function parseHash() {
  const raw = (window.location.hash || "#/").replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  const head = parts[0] || "matrix";
  switch (head) {
    case "matrix":
      return { name: "matrix" };
    case "food":
      return { name: "food", id: decodeURIComponent(parts[1] || "") };
    case "compare":
      return {
        name: "compare",
        left: decodeURIComponent(parts[1] || ""),
        right: decodeURIComponent(parts[2] || ""),
      };
    case "recommend":
      return { name: "recommend" };
    case "methodology":
      return { name: "methodology" };
    default: {
      return { name: "matrix" };
    }
  }
}

function applyTheme(theme) {
  const resolved =
    theme === "light" || theme === "dark"
      ? theme
      : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  document.documentElement.dataset.theme = resolved;
}

function heatStyle(score) {
  if (score >= 75) return { background: "var(--heat-high)", color: "var(--text)" };
  if (score >= 45) return { background: "var(--heat-mid)", color: "var(--text)" };
  return { background: "var(--heat-low)", color: "var(--text)" };
}

function formatScore(score) {
  return Number(score).toFixed(0);
}

function foodById(id) {
  return scoredAll.find((food) => food.id === id) ?? null;
}

function filterFoods(state) {
  return scoredAll.filter((food) => {
    if (state.pattern === "plant_only" && food.kingdom === "animal") return false;
    if (state.classId !== "all" && food.classId !== state.classId) return false;
    if (state.query) {
      const hay = `${food.name} ${food.classId} ${food.id}`.toLowerCase();
      if (!hay.includes(state.query)) return false;
    }
    return true;
  });
}

function sortFoods(list, sortKey, dir) {
  const copy = [...list];
  copy.sort((a, b) => {
    let av;
    let bv;
    if (sortKey === "name") {
      av = a.name;
      bv = b.name;
      return dir * String(av).localeCompare(String(bv));
    }
    if (sortKey === "class") {
      av = CLASS_META[a.classId].label;
      bv = CLASS_META[b.classId].label;
      return dir * String(av).localeCompare(String(bv));
    }
    if (sortKey === "tier") {
      const order = { S: 5, A: 4, B: 3, C: 2, D: 1 };
      return dir * ((order[a.tier] || 0) - (order[b.tier] || 0));
    }
    av = sortKey === "composite" ? a.composite : a.axes[sortKey];
    bv = sortKey === "composite" ? b.composite : b.axes[sortKey];
    return dir * (av - bv);
  });
  return copy;
}

function downloadBlob(filename, mime, text) {
  const safeName = filename.replace(/[^\w.-]+/g, "_");
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = el("a", { href: url, download: safeName });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setNav(active) {
  for (const link of document.querySelectorAll("[data-nav]")) {
    if (link.getAttribute("data-nav") === active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

function renderFilters(root, state, onChange) {
  const classSelect = el("select", { id: "filter-class" });
  classSelect.append(el("option", { value: "all", text: "All classes" }));
  for (const id of CLASS_IDS) {
    classSelect.append(el("option", { value: id, text: CLASS_META[id].label }));
  }
  classSelect.value = state.classId;

  const axisSelect = el("select", { id: "filter-axis" });
  for (const key of ["composite", ...AXIS_KEYS]) {
    axisSelect.append(el("option", { value: key, text: AXIS_LABELS[key] }));
  }
  axisSelect.value = state.highlightAxis;

  const patternSelect = el("select", { id: "filter-pattern" });
  for (const [value, label] of Object.entries(PATTERN_LABELS)) {
    patternSelect.append(el("option", { value, text: label }));
  }
  patternSelect.value = state.pattern;

  const search = el("input", {
    id: "filter-search",
    type: "search",
    placeholder: "Search foods…",
    value: state.query,
    autocomplete: "off",
  });

  classSelect.addEventListener("change", () => onChange({ ...state, classId: classSelect.value }));
  axisSelect.addEventListener("change", () => onChange({ ...state, highlightAxis: axisSelect.value }));
  patternSelect.addEventListener("change", () => onChange({ ...state, pattern: patternSelect.value }));
  search.addEventListener("input", () => onChange({ ...state, query: search.value.trim().toLowerCase() }));

  root.append(
    el("div", { className: "filters" }, [
      el("label", { className: "field", text: "Class" }, [classSelect]),
      el("label", { className: "field", text: "Highlight axis" }, [axisSelect]),
      el("label", { className: "field", text: "Dietary pattern" }, [patternSelect]),
      el("label", { className: "field", text: "Search" }, [search]),
    ]),
  );
}

function renderMatrix(root, state) {
  setNav("matrix");
  const rows = sortFoods(filterFoods(state), state.sortKey, state.sortDir);
  root.append(
    el("p", {
      className: "meta-line",
      text: `Dataset v${datasetMeta.version} · verified ${datasetMeta.verifiedAt} · ${rows.length} foods · tiers are within class`,
    }),
  );
  renderFilters(root, state, (next) => {
    window.__dbwdiState = next;
    paint();
  });

  if (state.pattern === "plant_only") {
    root.append(
      el("div", { className: "notice warn" }, [
        el("strong", { text: "Plant-only is not complete. " }),
        document.createTextNode(
          "B12 fortification or supplementation is required. ALA is not EPA/DHA. Creatine, taurine, and carnosine are absent unless supplemented.",
        ),
      ]),
    );
  }

  const toolbar = el("div", { className: "toolbar" }, [
    el("div", { className: "meta-line", text: "Click a header to sort. Heat = axis score 0–100." }),
    el("div", {}, [
      el("button", {
        className: "ghost",
        type: "button",
        text: "Export CSV",
        onclick: () => downloadBlob("du-bist-was-du-isst.csv", "text/csv;charset=utf-8", exportCsv(rows)),
      }),
      document.createTextNode(" "),
      el("button", {
        className: "ghost",
        type: "button",
        text: "Export JSON",
        onclick: () =>
          downloadBlob(
            "du-bist-was-du-isst.json",
            "application/json;charset=utf-8",
            JSON.stringify(exportJson(rows, { version: datasetMeta.version, verifiedAt: datasetMeta.verifiedAt }), null, 2),
          ),
      }),
    ]),
  ]);
  root.append(toolbar);

  const table = el("table", { className: "matrix" });
  const head = el("tr");
  const headers = [
    ["name", "Food"],
    ["class", "Class"],
    ["tier", "Tier"],
    ["composite", "EVN"],
    ...AXIS_KEYS.map((key) => [key, AXIS_LABELS[key]]),
  ];
  for (const [key, label] of headers) {
    const th = el("th", {
      className: key === "name" || key === "class" ? "left" : "",
      text: label,
    });
    th.addEventListener("click", () => {
      const dir = state.sortKey === key ? -state.sortDir : key === "name" || key === "class" ? 1 : -1;
      window.__dbwdiState = { ...state, sortKey: key, sortDir: dir };
      paint();
    });
    head.append(th);
  }
  table.append(el("thead", {}, [head]));
  const body = el("tbody");
  for (const food of rows) {
    const tr = el("tr");
    const nameCell = el("td", { className: "left" }, [
      el("a", { className: "name-link", href: `#/food/${food.id}`, text: food.name }),
      el("div", { className: "class-pill", text: food.protein.kind.replaceAll("_", " ") }),
    ]);
    tr.append(nameCell);
    tr.append(el("td", { className: "left", text: CLASS_META[food.classId].label }));
    tr.append(el("td", {}, [el("span", { className: `tier ${food.tier}`, text: food.tier })]));
    const keys = ["composite", ...AXIS_KEYS];
    for (const key of keys) {
      const value = key === "composite" ? food.composite : food.axes[key];
      const td = el("td", { className: "heat", text: formatScore(value) });
      const style = heatStyle(value);
      td.style.background = style.background;
      if (state.highlightAxis === key) td.style.outline = "2px solid var(--accent)";
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(body);
  root.append(el("div", { className: "table-wrap" }, [table]));
}

function axisList(food) {
  const wrap = el("div");
  for (const key of ["composite", ...AXIS_KEYS]) {
    const value = key === "composite" ? food.composite : food.axes[key];
    wrap.append(el("div", { className: "kv" }, [el("span", { text: AXIS_LABELS[key] }), el("span", { text: formatScore(value) })]));
    const bar = el("div", { className: "axis-bar" }, [el("i")]);
    bar.firstChild.style.width = `${value}%`;
    wrap.append(bar);
  }
  return wrap;
}

function renderFood(root, id) {
  setNav("matrix");
  const food = foodById(id);
  if (!food) {
    root.append(el("p", { text: "Food not found." }));
    return;
  }
  root.append(el("p", { className: "meta-line" }, [el("a", { href: "#/", text: "← Matrix" })]));
  root.append(el("h2", { text: food.name }));
  root.append(
    el("p", {
      className: "meta-line",
      text: `${CLASS_META[food.classId].label} · ${food.kingdom} · tier ${food.tier} · ${food.serving.kcal} kcal / 100 g`,
    }),
  );
  const grid = el("div", { className: "grid-2" });
  const left = el("div", { className: "panel" }, [el("h3", { text: "Scores" }), axisList(food)]);
  const right = el("div", { className: "panel" });
  right.append(el("h3", { text: "Protein honesty" }));
  right.append(el("p", { text: food.claims.proteinNote }));
  right.append(
    el("div", { className: "kv" }, [
      el("span", { text: "Kind" }),
      el("span", { text: food.protein.kind }),
      el("span", { text: "DIAAS" }),
      el("span", { text: String(food.protein.diaas) }),
      el("span", { text: "PDCAAS (capped)" }),
      el("span", { text: String(food.protein.pdcaas) }),
      el("span", { text: "Limiting AA" }),
      el("span", { text: food.protein.limitingAA }),
      el("span", { text: "Equivalent to animal protein?" }),
      el("span", { text: "no" }),
    ]),
  );
  right.append(el("h3", { text: "Bioavailability flags" }));
  right.append(
    el("div", { className: "kv" }, [
      el("span", { text: "Bioavailable iron (mg)" }),
      el("span", { text: String(food.micros.bioavailableIronMg) }),
      el("span", { text: "Iron absorption coeff." }),
      el("span", { text: String(food.micros.ironAbsorptionCoeff) }),
      el("span", { text: "Zinc absorption coeff." }),
      el("span", { text: String(food.micros.zincAbsorptionCoeff) }),
      el("span", { text: "Effective vitamin A RAE" }),
      el("span", { text: String(food.micros.effectiveVitaminARaeUg) }),
      el("span", { text: "ALA conversion used" }),
      el("span", { text: String(ALA_TO_EPA_DHA_CONVERSION) }),
      el("span", { text: "Effective LC n-3 (g)" }),
      el("span", { text: String(food.lipids.effectiveLongChainN3G) }),
      el("span", { text: "Active / passive carbs (g)" }),
      el("span", { text: `${food.carbs.activeG} / ${food.carbs.passiveG}` }),
    ]),
  );
  grid.append(left, right);
  root.append(grid);

  if (food.flags.estimatedFields.length) {
    root.append(
      el("p", { className: "flag", text: `Estimated or converted fields: ${food.flags.estimatedFields.join(", ")}` }),
    );
  }

  const method = el("details", { className: "method" });
  method.append(el("summary", { text: "Source & Method" }));
  method.append(el("p", { className: "meta-line", text: `Verified ${datasetMeta.verifiedAt} · engine ${datasetMeta.engineVersion}` }));
  for (const [axis, formula] of Object.entries(food.trace)) {
    method.append(el("p", {}, [el("strong", { text: `${axis}: ` }), document.createTextNode(formula)]));
  }
  if (food.sources?.length) {
    const ul = el("ul");
    for (const source of food.sources) {
      ul.append(
        el("li", {
          text: source.fdcId
            ? `USDA FDC ${source.fdcId} — ${source.fields || ""}`
            : source.note || source.standard,
        }),
      );
    }
    method.append(ul);
  }
  method.append(
    el("p", {
      text: `Class weights: ${JSON.stringify(CLASS_WEIGHTS[food.classId])}`,
    }),
  );
  root.append(method);
  root.append(
    el("p", {}, [
      el("a", { className: "ghost", href: `#/compare/${food.id}/`, text: "Compare this food" }),
    ]),
  );
}

function foodSelect(selected, id) {
  const select = el("select", { id });
  select.append(el("option", { value: "", text: "Choose a food" }));
  for (const food of scoredAll) {
    select.append(el("option", { value: food.id, text: `${food.name} (${CLASS_META[food.classId].label})` }));
  }
  select.value = selected;
  return select;
}

function renderCompare(root, leftId, rightId) {
  setNav("compare");
  root.append(el("h2", { text: "Side-by-side" }));
  const leftSel = foodSelect(leftId, "compare-left");
  const rightSel = foodSelect(rightId, "compare-right");
  const go = () => {
    window.location.hash = `#/compare/${leftSel.value}/${rightSel.value}`;
  };
  leftSel.addEventListener("change", go);
  rightSel.addEventListener("change", go);
  root.append(el("div", { className: "filters" }, [el("label", { className: "field", text: "Food A" }, [leftSel]), el("label", { className: "field", text: "Food B" }, [rightSel])]));

  const a = foodById(leftId);
  const b = foodById(rightId);
  if (!a || !b) {
    root.append(el("p", { className: "meta-line", text: "Pick two foods. Classes stay distinct — this is not a licence to equate them." }));
    return;
  }
  if (a.kingdom !== b.kingdom) {
    root.append(
      el("div", { className: "notice" }, [
        document.createTextNode(
          "Different kingdoms. A closer EAA number does not make these proteins equivalent. Plant proteins remain incomplete.",
        ),
      ]),
    );
  }
  const grid = el("div", { className: "grid-2" });
  for (const food of [a, b]) {
    const card = el("div", { className: "panel food-card" });
    card.append(el("h3", { text: food.name }));
    card.append(el("p", { className: "meta-line", text: `${CLASS_META[food.classId].label} · tier ${food.tier} · ${food.protein.kind}` }));
    card.append(axisList(food));
    card.append(el("a", { href: `#/food/${food.id}`, text: "Deep dive" }));
    grid.append(card);
  }
  root.append(grid);
}

function renderRecommend(root) {
  setNav("recommend");
  root.append(el("h2", { text: "Best-practice recommendations" }));
  const select = el("select", { id: "rec-pattern" });
  for (const value of ["animal_inclusive", "hybrid", "plant_only"]) {
    select.append(el("option", { value, text: PATTERN_LABELS[value] }));
  }
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  select.value = params.get("pattern") || "animal_inclusive";
  const mount = el("div");
  const draw = () => {
    mount.replaceChildren();
    const rec = recommend(scoredAll, select.value);
    if (!rec.patternCompleteWithoutFortification) {
      mount.append(el("div", { className: "notice warn", text: "This pattern is not complete without fortification or supplementation." }));
    } else {
      mount.append(el("div", { className: "notice", text: rec.rationale }));
    }
    const notes = el("ul");
    for (const note of rec.requiredNotes) notes.append(el("li", { text: note }));
    mount.append(notes);
    const cards = el("div", { className: "grid-2" });
    for (const pick of rec.picks) {
      const food = foodById(pick.id);
      if (!food) continue;
      cards.append(
        el("div", { className: "rec-card" }, [
          el("a", { href: `#/food/${food.id}`, className: "name-link", text: food.name }),
          el("div", { className: "class-pill", text: `${CLASS_META[food.classId].label} · EVN ${formatScore(food.composite)} · ${food.tier}` }),
        ]),
      );
    }
    mount.append(cards);
  };
  select.addEventListener("change", draw);
  root.append(el("label", { className: "field", text: "Pattern" }, [select]));
  root.append(mount);
  draw();
}

function renderMethodology(root) {
  setNav("methodology");
  root.append(el("h2", { text: "Methodik — what this will not claim" }));
  const prose = el("div", { className: "method-prose panel" });
  prose.append(el("p", { text: `Dataset v${datasetMeta.version}, last verified ${datasetMeta.verifiedAt}. Engine ${datasetMeta.engineVersion}.` }));
  prose.append(el("p", { text: "Scores are arithmetic over raw tables and published coefficients. They are not AI scores." }));
  const claims = [
    "Plant proteins are incomplete; animal proteins are complete. Equality of a 0–100 cell is not biochemical equivalence.",
    "Non-heme iron, phytate-bound zinc, and carotenoid vitamin A are down-weighted versus heme iron, animal zinc, and retinol.",
    "Fibre and phytochemicals are plant advantages. B12, creatine, taurine, carnosine, and long-chain EPA/DHA are animal advantages (or need algae oil / supplements).",
    "Water-soluble vitamins degrade with time, oxygen, light, cutting, and heat. Fat-soluble vitamins oxidise.",
    "Residue scores are class-typical MRL-informed indices, not a lab certificate for your grocery bag.",
    "Active carbs (sugars + starch) are scored separately from passive/structural carbs (fibre + resistant starch).",
    "ALA conversion is 0.08 combined. Algae, mushrooms, sprouts, kraut, legumes, and leafy salads are distinct classes.",
    "A plant-only pattern is never marked complete without fortification. This app is not medical advice.",
  ];
  const ul = el("ul");
  for (const item of claims) ul.append(el("li", { text: item }));
  prose.append(ul);
  prose.append(el("p", {}, [el("a", { href: "/docs/methodology-non-claims.md", text: "Full non-claims document" }), document.createTextNode(" · "), el("a", { href: "/docs/scoring-formulas.md", text: "Formulas" }), document.createTextNode(" · "), el("a", { href: "/docs/sources.md", text: "Source map" })]));
  root.append(prose);

  const std = el("div", { className: "panel", style: "margin-top:1rem" });
  std.append(el("h3", { text: "Primary standards" }));
  const list = el("ul");
  for (const source of datasetMeta.primaryStandards) {
    list.append(
      el("li", {}, [
        el("a", { href: source.url, target: "_blank", rel: "noreferrer", text: source.name }),
        document.createTextNode(` — ${source.role}`),
      ]),
    );
  }
  std.append(list);
  root.append(std);
}

function paint() {
  const root = document.getElementById("view");
  root.replaceChildren();
  const route = parseHash();
  const state = window.__dbwdiState ?? {
    classId: "all",
    highlightAxis: "composite",
    pattern: "all",
    query: "",
    sortKey: "composite",
    sortDir: -1,
  };
  switch (route.name) {
    case "matrix":
      renderMatrix(root, state);
      break;
    case "food":
      renderFood(root, route.id);
      break;
    case "compare":
      renderCompare(root, route.left, route.right);
      break;
    case "recommend":
      renderRecommend(root);
      break;
    case "methodology":
      renderMethodology(root);
      break;
    default: {
      const unexpected = route.name;
      throw new Error(`Unhandled route: ${unexpected}`);
    }
  }
}

function initHeader() {
  document.getElementById("dataset-stamp").textContent =
    `v${datasetMeta.version} · ${datasetMeta.verifiedAt}`;
  const stored = localStorage.getItem(THEME_KEY) || "system";
  applyTheme(stored);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, current);
    applyTheme(current);
  });
}

window.__dbwdiState = {
  classId: "all",
  highlightAxis: "composite",
  pattern: "all",
  query: "",
  sortKey: "composite",
  sortDir: -1,
};

initHeader();
paint();
window.addEventListener("hashchange", paint);

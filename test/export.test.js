import { test } from "node:test";
import assert from "node:assert/strict";
import { assignTiers, csvEscape, exportCsv, exportJson, scoreDataset } from "../lib/scoring/index.js";

test("csvEscape quotes commas, quotes, and newlines", () => {
  assert.equal(csvEscape("plain"), "plain");
  assert.equal(csvEscape('a,b'), '"a,b"');
  assert.equal(csvEscape('say "hi"'), '"say ""hi"""');
  assert.equal(csvEscape("line\nbreak"), '"line\nbreak"');
});

test("CSV export does not interpolate raw HTML or formulas from names", () => {
  const scored = assignTiers(
    scoreDataset([
      {
        id: "evil",
        name: '=cmd|"/c calc",<script>alert(1)</script>',
        classId: "eggs",
        kingdom: "animal",
        serving: { grams: 100, kcal: 140 },
        protein: {
          grams: 12,
          eaaMgPerGProtein: {
            his: 24,
            ile: 56,
            leu: 86,
            lys: 72,
            met: 38,
            cys: 27,
            phe: 54,
            tyr: 42,
            thr: 44,
            trp: 16,
            val: 68,
          },
          ilealDigestibility: 0.97,
          fecalDigestibility: 0.97,
        },
        lipids: {
          totalG: 9,
          sfaG: 3,
          mufaG: 3,
          pufaG: 1,
          omega3G: 0.1,
          omega6G: 1,
          alaG: 0,
          epaG: 0,
          dhaG: 0,
          oddChainG: 0,
          claG: 0,
        },
        carbs: { totalG: 0, sugarsG: 0, starchG: 0, fiberG: 0, resistantStarchG: 0 },
        micros: {
          ironMg: 1,
          hemeIronMg: 0.3,
          nonhemeIronMg: 0.7,
          zincMg: 1,
          vitaminARaeUg: 100,
          retinolUg: 100,
          carotenoidsUg: 0,
          b12Ug: 0.8,
          folateUg: 40,
          vitaminCMg: 0,
          vitaminDUg: 1,
          vitaminEMg: 1,
          vitaminKUg: 0,
          calciumMg: 50,
          seleniumUg: 20,
          iodineUg: 20,
          magnesiumMg: 10,
          potassiumMg: 100,
          cholineMg: 200,
          creatineG: 0,
          taurineMg: 0,
          carnosineMg: 0,
        },
        phytochemicals: { polyphenolsMg: 0, glucosinolatesMg: 0, uniquePigmentsMg: 0 },
        antinutrients: { phytateMg: 0, oxalateMg: 0, lectinFlag: false, goitrogenFlag: false },
        residues: { pesticideRisk: 0.1, heavyMetalRisk: 0.1, persistentOrganicRisk: 0.1 },
        degradation: {
          waterSolubleVitaminLoad: 0.2,
          cutSurfaceIndex: 0.1,
          heatLability: 0.2,
          pufaOxidationRisk: 0.2,
        },
        flags: { estimatedFields: [] },
      },
    ]),
  );
  const csv = exportCsv(scored);
  assert.match(csv, /^id,name,/);
  assert.match(csv, /""\/c calc""/);
  assert.equal(csv.includes("<script>"), true);
  assert.ok(csv.startsWith("id,name,"));
  const payload = exportJson(scored);
  assert.equal(payload.foods[0].name.includes("<script>"), true);
  assert.equal(typeof payload.meta.exportedAt, "string");
});

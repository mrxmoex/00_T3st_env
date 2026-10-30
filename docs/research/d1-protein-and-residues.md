# D1 research: protein digestibility and pesticide residues

Compiled 2026-10-30 by a research pass for data track D1. Rule followed: every value below was read from the cited source (page text, table, or abstract as stated). Where a value could not be verified, the cell says **NOT FOUND**. Derived numbers (simple arithmetic on published counts) are labelled "derived". Nothing is estimated.

**Status.**
- Section A: every value the app uses was checked again against the journal's own table before it entered `src/data/foods/` (Hodgkinson 2025 Tables 2–3, Hodgkinson 2022, Walther 2019 Table 1, Rutherfurd 2015 Table 1, Bailey & Stein 2020 Table 4, Lackey & Fleming 2021, Freitas 2012 Table 4). Rows the app does not use (House 2019, Ahrens 2005, Han 2019, Cervantes-Pahm 2014, Mathai 2017, Mitchell & Beadles 1937, Merrill & Watt) were not re-checked. How the values are chosen: `docs/data-sources.md` § Protein digestibility.
- Section B: not yet checked against the EFSA reports and not used by the app; input for D2.
- Contaminants, glycemic index, and bioactives were planned as sections C to E; the pass did not reach them.

Conventions: digestibility is a 0–1 coefficient. Abbreviations: TID = true ileal digestibility; SID = standardized ileal digestibility (basal endogenous correction, Stein lab terminology); TIND/TFND = true ileal / true fecal nitrogen digestibility; TFPD/TPD = true fecal protein digestibility (rat AOAC 991.29 type assay); IAA = indispensable amino acids; MRL = maximum residue level; LOQ = limit of quantification.

---

## A. Protein digestibility

Hierarchy requested: human > pig > rat; ileal preferred over fecal. All rows for a food are listed best-first. Hodgkinson 2022 [A2] found pig and adult-human true ileal AA digestibility interchangeable (human = 1.00 × pig − 0.010, overall mean of all AA; slope ≠ 1 and intercept ≠ 0 both n.s.), and states that values from foods fed **raw** to pigs when humans eat them **cooked** "cannot be considered valid" for a human database — rows from [A6]/[A7] (raw ground grain, feed-ingredient studies) are therefore flagged.

Note on [A1] (Hodgkinson et al. 2025): "true" there = corrected for basal gut endogenous AA measured per pig on a protein-free diet (the same correction Stein's group calls "standardized"). Values below are the Table 2 **Nitrogen** row; n = 6 pigs per food unless stated.

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| **Apple (with skin)** | 0.247 | Pig TID of nitrogen. Fresh Gala apple, NZ, "fresh, cored and grated" (peel removal not stated). Very low-protein food; several AA TIDs below detection ("—") in Table 2. | [A1] Hodgkinson SM et al. *J Nutr* 2025 (online 12 Aug 2025). doi:10.1016/j.tjnut.2025.08.004 — Table 2 (Nitrogen row, "Apple"); prep Table 1 |
| Pear | 0.266 | Pig TID of nitrogen. Beurre Bosc, NZ, fresh, cored and grated. AA TIDs partly below detection. | [A1] Table 2 ("Pear"); Table 1 |
| Banana | 0.607 | Pig TID of nitrogen. Bonita, Ecuador, fresh, lightly mashed. | [A1] Table 2 ("Banana"); Table 1 |
| Orange | NOT FOUND | No in vivo (human/pig/rat) protein digestibility found for orange. | — |
| Kiwi | NOT FOUND | No in vivo value found. | — |
| Strawberries | NOT FOUND | No in vivo value found. | — |
| Blueberries | NOT FOUND | No in vivo value found. | — |
| Raspberries | NOT FOUND | No in vivo value found. | — |
| Blackcurrants | NOT FOUND | No in vivo value found. | — |
| Grapes | NOT FOUND | No in vivo value found. | — |
| Avocado | 0.727 | Pig TID of nitrogen. Mixture of varieties, NZ, fresh, lightly mashed. | [A1] Table 2 ("Avocado"); Table 1 |
| Apricot, fresh | NOT FOUND | No in vivo value found. | — |
| Apricot, dried | NOT FOUND | No in vivo value found. | — |
| **Almonds** | 0.723 | Pig TID of nitrogen. Raw Carmel Supreme almonds (USA), hammer-milled. | [A1] Table 2 ("Almonds"); Table 1 |
| Almonds | 0.857–0.899 | Rat TFPD, raw almonds, 4 Californian varieties (2017 harvest): Butte 0.862, Independence 0.889, Monterey 0.899, Nonpareil 0.857. | [A10] House JD, Hill K, Neufeld J, Franczyk A, Nosworthy MG. Determination of the protein quality of almonds (*Prunus dulcis* L.) as assessed by in vitro and in vivo methodologies. *Food Sci Nutr* 2019;7(9):2932–2938. doi:10.1002/fsn3.1146 — Table 2 (%TFPD) |
| Almonds | 0.8855 / 0.9225 / 0.8262 | Rat true protein digestibility (±0.0126/0.0105/0.0147) for Carmel / Mission / Nonpareil. | [A9] Ahrens S, Venkatachalam M, Mistry AM, Lapsley K, Sathe SK. Almond (*Prunus dulcis* L.) protein quality. *Plant Foods Hum Nutr* 2005;60:123–128. doi:10.1007/s11130-005-6840-2 — abstract (values as % TPD) |
| **Walnuts** | 0.8622 | Rat true protein digestibility (±0.0183), **defatted** raw walnut, n = 4 rats per group. No pig/human value found. | [A11] Lackey KA, Fleming SA. Brief Research Report: Estimation of the Protein Digestibility-Corrected Amino Acid Score of Defatted Walnuts. *Front Nutr* 2021;8:702857. doi:10.3389/fnut.2021.702857 — Table 3 |
| **Hazelnuts** | NOT FOUND | Mitchell & Beadles 1937 measured filbert true digestibility in rats, but the number is only in the PDF (not opened). A 2026 review states PDCAAS/DIAAS have not been determined for hazelnuts. | [A13] (see sources not opened) |
| **Cashews** | 0.877 | Pig TID of nitrogen. Raw cashew kernels (Vietnam), hammer-milled. | [A1] Table 2 ("Cashew nuts"); Table 1 |
| Cashews | 0.8766 | Rat true protein digestibility (±0.0174), cashews purchased roasted, n = 4 rats. | [A12] Freitas JB, Fernandes DC, Czeder LP, Lima JCR, Sousa AGO, Naves MMV. Edible seeds and nuts grown in Brazil as sources of protein for human nutrition. *Food Nutr Sci* 2012;3(6):857–862. doi:10.4236/fns.2012.36114 — Table 4 |
| Cashews | 0.96 | Rat true digestibility (form not stated in summary). | [A13] Mitchell HH, Beadles JR. The nutritive value of the proteins of nuts in comparison with the nutritive value of beef proteins. *J Nutr* 1937;14(6):597–608. doi:10.1093/jn/14.6.597 — "Summary and Conclusions" (journal abstract page) |
| **Peanuts (roasted)** | 0.909 (ileal) / 0.984 (fecal) | Rat TIND / TFND, **roasted peanuts** (supermarket). | [A4] Rutherfurd SM, Fanning AC, Miller BJ, Moughan PJ. Protein digestibility-corrected amino acid scores and digestible indispensable amino acid scores differentially describe protein quality in growing male rats. *J Nutr* 2015;145:372–379. doi:10.3945/jn.114.195438 — Table 1 |
| Peanuts (roasted) | 0.9114 | Rat true protein digestibility (±0.0051), peanuts roasted 140 °C × 30 min. | [A12] Table 4 |
| Peanuts (not roasted) | 0.815 | Pig TID of nitrogen — **blanched, dehusked** peanuts (Argentina), hammer-milled; *not roasted*. | [A1] Table 2 ("Peanut"); Table 1 |
| Peanut butter (context) | 0.926 | Pig TID of nitrogen, smooth peanut butter. | [A1] Table 2 ("Peanut Butter") |
| Peanut butter (context) | 0.95 | Human true (fecal N) digestibility. | [A3] Joint FAO/WHO/UNU. *Energy and protein requirements.* WHO Tech Rep Ser 724, 1985 — Table 36 "Values for the digestibility of protein in man" (data from Hopkins DT 1981, in Bodwell CE et al., eds., *Protein quality in humans*, AVI, pp. 178–181). HTML mirror: https://www.fao.org/4/aa040e/aa040e08.htm |
| **Pistachios** | 0.9445 (raw) / 0.8519 (roasted) | Pig SID of crude protein. STTD of CP: 0.9211 raw / 0.9164 roasted (Table 5). | [A8] Bailey HM, Stein HH. Raw and roasted pistachio nuts (*Pistacia vera* L.) are 'good' sources of protein based on their digestible indispensable amino acid score as determined in pigs. *J Sci Food Agric* 2020;100(10):3878–3885. doi:10.1002/jsfa.10429 — Table 4 (SID), Table 5 (STTD) |
| **Brazil nuts** | 0.8920 | Rat true protein digestibility (±0.0151), raw Brazil nut without rind, n = 4 rats. No pig/human value found. | [A12] Table 4 |
| **Sunflower seeds** | 0.657 | Pig TID of nitrogen. Raw kernels (USA), broken in food processor. | [A1] Table 2 ("Sunflower seeds"); Table 1 |
| **Pumpkin seeds** | 0.668 | Pig TID of nitrogen. "Shine skin" heat-treated kernels (China), pulsed in food processor. | [A1] Table 2 ("Pumpkin seeds"); Table 1 |
| **Flaxseed / linseed** | 0.603 | Pig TID of nitrogen. Broken linseed (NL), raw. | [A1] Table 2 ("Linseed"); Table 1 |
| **Chia seeds** | 0.286 | Pig TID of nitrogen. Black chia, soaked in water overnight. | [A1] Table 2 ("Chia seeds"); Table 1 |
| **Sesame seeds** | NOT FOUND | No measured in vivo value found. (One 2019 tahini rat paper used an assumed "85%" sesame factor taken from literature — not a measurement, not used.) | — |
| **Rolled oats** | 0.828 | Pig TID of nitrogen. Quaker oatmeal simmered in water 15 min. | [A1] Table 2 ("Oatmeal"); Table 1 |
| Rolled oats | 0.86 ± 0.07 | Human true (fecal N) digestibility, "Oatmeal". | [A3] Table 36 |
| Rolled oats | 0.885 (ileal) / 0.952 (fecal) | Rat TIND / TFND, rolled oats cooked ~100 °C, 15 min. | [A4] Table 1 |
| Rolled oats | 0.874 | Rat mean TID of IAA (cooked oats). | [A5] Han F, Han F, Wang Y, Fan L, Song G, Chen X, Jiang P, Miao H, Han Y. Digestible indispensable amino acid scores of nine cooked cereal grains. *Br J Nutr* 2019;121(1):30–41. doi:10.1017/S0007114518003033 — Table 5 ("Mean" of IAA) |
| Oats (raw grain, flagged) | 0.846 | Pig SID of crude protein, **raw** dehulled oats (feed-ingredient form). | [A6] Cervantes-Pahm SK, Liu Y, Stein HH. Digestible indispensable amino acid score and digestible amino acids in eight cereal grains. *Br J Nutr* 2014;111(9):1663–1672. doi:10.1017/S0007114513004273 — Table 4 |
| **Wholemeal rye bread** | 0.456 | Pig TID of nitrogen. "Rye bread (wholeseed)", Friesian-style, baked at WUR, cut to 1 cm pieces. | [A1] Table 2 ("Rye bread"); Table 1 |
| Rye (raw grain, flagged) | 0.705 | Pig SID of crude protein, raw rye grain. | [A6] Table 4 |
| **Wholemeal wheat bread** | 0.707 | Pig TID of nitrogen. Whole wheat bread (Aunt Millie's, USA), diced 1–2 cm. | [A1] Table 2 ("Whole wheat bread"); Table 1 |
| Wholemeal wheat bread | 0.947 | Rat mean TID of IAA; wheat baked into bread (Chinese standard LST 3204-1993). | [A5] Table 5 ("Whole wheat") |
| Whole wheat (form unspecified) | 0.86 ± 0.05 | Human true (fecal N) digestibility, "Wheat, whole". | [A3] Table 36 |
| Wheat (raw grain, flagged) | 0.91 (SID) / 0.86 (STTD) | Pig, raw wheat grain fed with soya flour; SID by difference. | [A7] Mathai JK, Liu Y, Stein HH. Values for DIAAS for some dairy and plant proteins may better describe protein quality than values calculated using the concept for PDCAAS. *Br J Nutr* 2017;117(4):490–499. doi:10.1017/S0007114517000125 — Table 5 |
| Wheat (raw grain, flagged) | 0.750 | Pig SID of crude protein, raw wheat grain. | [A6] Table 4 |
| **White wheat bread** | 0.94 | **Human** (adult ileostomates, n = 5) overall mean true ileal IAA digestibility, **toasted wheat bread**; pig value in same study also 0.94 (n = 6). | [A2] Hodgkinson SM, Stroebinger N, van der Wielen N, Mensink M, Montoya C, Hendriks WH, de Vries S, Stein HH, Moughan PJ. Comparison of true ileal amino acid digestibility between adult humans and growing pigs. *J Nutr* 2022;152(7):1635–1646. doi:10.1093/jn/nxac077 — Results text (after Table 3) and Figure 1D |
| White wheat bread | 0.940 | Pig TID of nitrogen, "White bread" (Table 2, n = 18 pigs) = "Wheat bread, baked at Illinois University, toasted lightly" (Table 1). | [A1] Table 2 ("White bread"); Table 1 ("Wheat bread") |
| White wheat (form unspecified) | 0.96 ± 0.04 | Human true (fecal N) digestibility, "Wheat, refined". | [A3] Table 36 |
| **Brown rice (boiled)** | 0.899 | Pig TID of nitrogen. Long-grain jasmine (Thailand), rice cooker. | [A1] Table 2 ("Rice, brown"); Table 1 |
| Brown rice (boiled) | 0.844 | Rat mean TID of IAA, cooked brown rice. | [A5] Table 5 |
| **White rice (boiled)** | 0.951 | Pig TID of nitrogen. Thai Hom Mali (Thailand), rice cooker. | [A1] Table 2 ("Rice, white"); Table 1 |
| White rice | 0.88 ± 0.04 | Human true (fecal N) digestibility, "Rice, polished". | [A3] Table 36 |
| White rice (boiled) | 0.782 | Rat mean TID of IAA, cooked polished rice. | [A5] Table 5 |
| Rice, cooked (type unspecified) | 0.728 (ileal) / 0.866 (fecal) | Rat TIND / TFND; rice type not stated. | [A4] Table 1 |
| White rice (raw, flagged) | 0.881 | Pig SID of crude protein, raw polished white rice. | [A6] Table 4 |
| **Durum pasta, white (boiled)** | 0.852 | Pig TID of nitrogen. "Pasta" = dry fettuccine from durum wheat (Italy), simmered, cut 3 cm. | [A1] Table 2 ("Pasta"); Table 1 ("Wheat noodles (pasta)") |
| **Durum pasta, wholemeal (boiled)** | NOT FOUND | No in vivo value found. | — |
| **Quinoa (boiled)** | 0.854 | Pig TID of nitrogen. White quinoa, soaked 10 min then rice cooker. | [A1] Table 2 ("Quinoa"); Table 1 |
| **Buckwheat (boiled)** | 0.827 | Pig TID of nitrogen. Buckwheat simmered 25 min. | [A1] Table 2 ("Buckwheat"); Table 1 |
| Buckwheat (boiled) | 0.882 | Rat mean TID of IAA, cooked buckwheat (common; tartary buckwheat 0.781). | [A5] Table 5 |
| **Millet (boiled)** | 0.688 | Pig TID of nitrogen. Millet (species not stated), simmered. | [A1] Table 2 ("Millet"); Table 1 |
| Millet | 0.79 | Human true (fecal N) digestibility, "Millet" (no SD; species not stated). | [A3] Table 36 |
| Millet (boiled) | 0.802 (proso) / 0.899 (foxtail) | Rat mean TID of IAA, cooked. | [A5] Table 5 |
| **Onion** | NOT FOUND (measured) | Fallback only: Merrill & Watt applied the **potato** protein factor to "other underground vegetables such as beets, carrots, onions…"; potato protein = average **apparent** human digestibility 74% (10 investigations, "tentative"). Group assumption, not an onion measurement. | [A14] Merrill AL, Watt BK. *Energy value of foods — basis and derivation.* USDA Agriculture Handbook No. 74, 1955 (rev. 1973) — sections "Potatoes" and "Other vegetables" |
| **Garlic** | NOT FOUND | Not named in the readable Handbook 74 text; no measurement found. | — |
| **Leek** | NOT FOUND (measured) | Fallback only: group factor for "remaining vegetables" = 0.65 apparent human protein digestibility (median of 14 experiments on assorted vegetables). | [A14] section "Other vegetables" |
| **Cucumber** | NOT FOUND (measured) | Fallback only: same group factor 0.65 (apparent). | [A14] section "Other vegetables" |
| **Asparagus** | NOT FOUND (measured) | Fallback only: same group factor 0.65 (apparent). | [A14] section "Other vegetables" |
| **Green beans** | 0.858 | Pig TID of nitrogen. Grade A whole green beans, simmered, diced 1–2 cm. | [A1] Table 2 ("Green beans"); Table 1 |
| **Green peas** | 0.905 | Pig TID of nitrogen. Frozen green peas, simmered. | [A1] Table 2 ("Peas, green"); Table 1 |
| Green peas | 0.884 (ileal) / 0.890 (fecal) | Rat TIND / TFND, fresh garden peas cooked 4 min at 100 °C. | [A4] Table 1 |
| Peas, mature (context only) | 0.88 | Human true (fecal N) digestibility, "Peas, mature" — dried peas, **not** green peas. | [A3] Table 36 |

Section A completeness: 26 of the 43 listed foods have at least one measured in vivo value — human true ileal for white bread only; human true fecal (1985 WHO table, food form often unspecified) for oats, white rice, millet and wheat; pig TID for 24 foods; rat only for walnuts and Brazil nuts. For roasted peanuts the pig value is for blanched (not roasted) peanuts; roasted values are rat. 17 foods are NOT FOUND: orange, kiwi, strawberries, blueberries, raspberries, blackcurrants, grapes, apricot (fresh and dried), hazelnuts, sesame, wholemeal pasta, garlic, and onion/leek/cucumber/asparagus (the last four have only Merrill & Watt group-level apparent fallbacks, which are not food measurements).

---

## B. Pesticide residues (EFSA annual reports, EU-coordinated multiannual control programme, EU MACP)

The EU MACP rotates 12 commodities on a 3-year cycle, so each food's most recent data year differs: **2021** data (bananas, table grapes, wheat), **2022** data (apples, strawberries, oats, barley), **2023** data (pears, oranges, kiwi fruits, rice, rye, onions).

- "No quantified residues" = residues below LOQ (EFSA wording on commodity pages: "no pesticide residues were found").
- "Quantified" column is **derived** = total − samples below LOQ (EFSA does not print this per commodity).
- "Above MRL" = measured value > MRL; "non-compliant" = exceeds MRL after measurement uncertainty.
- Per-commodity numbers are from each report's interactive Appendix (2021/2022: "Appendix D – Annex I"; 2023: "Appendix B – Annex I – chapter one"), which is the report's own detailed-results annex. Commodity texts were read from the EFSA multimedia pages (2021/2022 deep links work; 2023 deep links return 404, so the text was read from the app's own bundle at the root URL — same text the app displays).
- **Caveat on multiple residues:** in the 2021 and 2022 main reports (Section 3), the per-commodity "rate of multiple residues" (e.g. apples 18.6%, table grapes 22.2%) is the commodity's **share of all multi-residue samples** (apples 699/3,760 = 18.6%), not the within-commodity rate. The within-commodity rates below (apples 51.6%) come from the appendix commodity text. The 2023 report's main text (pears 65%, oranges 64%) uses within-commodity rates.

Report citations:
- **[B21]** EFSA, Carrasco Cabrera L, Di Piazza G, Dujardin B, Medina Pastor P. The 2021 European Union report on pesticide residues in food. *EFSA Journal* 2023;21(4):e07939. doi:10.2903/j.efsa.2023.7939 — Section 3 + Appendix D – Annex I: https://multimedia.efsa.europa.eu/pesticides-report-2021/commodity/<commodity>/
- **[B22]** EFSA, Carrasco Cabrera L, Di Piazza G, Dujardin B, Marchese E, Medina Pastor P. The 2022 European Union report on pesticide residues in food. *EFSA Journal* 2024;22(4):e8753. doi:10.2903/j.efsa.2024.8753 — Section 3 + Appendix D – Annex I: https://multimedia.efsa.europa.eu/pesticides-report-2022/commodity/<commodity>/
- **[B23]** EFSA, Carrasco Cabrera L, Di Piazza G, Dujardin B, Marchese E, Medina Pastor P. The 2023 European Union report on pesticide residues in food. *EFSA Journal* 2025;23(5):e9398. doi:10.2903/j.efsa.2025.9398 — Section 3 + Appendix B – Annex I – chapter one: https://multimedia.efsa.europa.eu/pesticides-report-2023/ (select commodity)

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| **Apples** (2022 data) | n = 1,354; quantified **71.0%** (962, derived); multiple **51.6%** (699); above MRL **1.6%** (22); non-compliant **0.8%** (11) | Below LOQ 28.9% (392). | [B22] Appendix D – Annex I, commodity "Apples" (…/pesticides-report-2022/commodity/apples/); Section 3 |
| **Pears** (2023) | n = 1,128; quantified **78.7%** (888, derived); multiple **64.8%** (731); above MRL **3.2%** (36); non-compliant **1.6%** (18) | Below LOQ 21.3% (240). Highest multi-residue rate of 2023 MACP (main text "65%"). | [B23] Appendix B – Annex I ch. one, "Pears"; Section 3 |
| **Strawberries** (2022) | n = 1,078; quantified **75.8%** (817, derived); multiple **61.1%** (659); above MRL **2.04%** (22); non-compliant **0.56%** (6) | Below LOQ 24.2% (261). | [B22] Appendix D – Annex I, "Strawberries" (…/pesticides-report-2022/commodity/strawberries/) |
| **Table grapes** (2021) | n = 1,223; quantified **81.8%** (1,000, derived); multiple **67.9%** (830); above MRL **2.1%** (26); non-compliant **0.8%** (10) | Below LOQ 18.2% (223). | [B21] Appendix D – Annex I, "Table grapes"; Section 3 |
| **Oranges** (2023) | n = 1,106; quantified **76.8%** (849, derived); multiple **64.3%** (711); above MRL **2.4%** (26); non-compliant **1.2%** (13) | Below LOQ 23.2% (257). | [B23] Appendix B – Annex I ch. one, "Oranges"; Section 3 |
| **Bananas** (2021) | n = 1,241; quantified **68.8%** (854, derived); multiple **55.6%** (690); above MRL **2.3%** (28); non-compliant **1.3%** (16) | Below LOQ 31.2% (387). Bananas are peeled before eating; EFSA analyses whole fruit. | [B21] Appendix D – Annex I, "Bananas" (…/pesticides-report-2021/commodity/bananas/); Section 3 |
| **Kiwi** (2023) | n = 850; quantified **41.4%** (352, derived); multiple **16.2%** (138); above MRL **1.5%** (13); non-compliant **0.8%** (7) | Below LOQ 58.6% (498). Green, red and yellow kiwi fruits pooled. | [B23] Appendix B – Annex I ch. one, "Kiwi fruits" |
| Other berries (blueberries, raspberries, blackcurrants) | NOT FOUND | Not in the EU MACP 2021–2023 (strawberries are the only berry); no per-commodity national-programme figures found in the report text. | [B21]–[B23] Section 3 commodity lists |
| **Oats** (2022) | n = 553 (83 whole-grain flour); quantified **26.2%** (145, derived); multiple **11.6%** (64); above MRL **1.45%** (8); non-compliant **0.90%** (5) | Below LOQ 73.8% (408). Below the 683-sample target. Main text rounds exceedance to 1.5%. | [B22] Appendix D – Annex I, "Oat"; Section 3 |
| **Wheat** (2021) | n = 1,245 (239 wholemeal flour); quantified **31.1%** (387, derived); multiple **11.3%** (141); above MRL **1.5%** (19); non-compliant **1.1%** (14) | Below LOQ 68.9% (858). | [B21] Appendix D – Annex I, "Wheat" (…/pesticides-report-2021/commodity/wheat/); Section 3 |
| **Rye** (2023) | n = 654 (235 wholemeal flour); quantified **25.4%** (166, derived); multiple **9.5%** (62); above MRL **0.8%** (5); non-compliant **0.3%** (2) | Below LOQ 74.6% (488). Below the 683 target. | [B23] Appendix B – Annex I ch. one, "Rye"; Section 3 |
| **Rice** (2023) | n = 971; quantified **37.8%** (367, derived); multiple **18.1%** (176); above MRL **5.1%** (50); non-compliant **3.4%** (33) | Below LOQ 62.2% (604). Main text calls the commodity "brown rice"; highest-risk cereal (tricyclazole, propiconazole, imidacloprid, chlormequat; mainly India/Pakistan origin). Applies to brown rice; white rice NOT FOUND separately. | [B23] Appendix B – Annex I ch. one, "Rice"; Section 3 |
| Barley (2022, context) | n = 495; quantified 36.0% (178, derived); multiple 19.8% (98); above MRL 2.8% (14); non-compliant 1.1% (5) | Not on the food list; included as "other cereal". | [B22] Appendix D – Annex I, "Barley" |
| Onion (2023, bonus) | n = 1,098; quantified 24.0% (264, derived); multiple 6.6% (73); above MRL 0.8% (9); non-compliant 0.4% (4) | On the vegetable list. Below LOQ 76.0% (834). | [B23] Appendix B – Annex I ch. one, "Onions" |
| Buckwheat (context, **not** MACP) | Non-compliance 14.9% | 2022 overall programmes (MACP + risk-based national MANCP), "buckwheat and other pseudo-cereals", unprocessed products with >100 samples. Driven mainly by copper compounds, which EFSA lists as "natural presence of the substance in the crop". Risk-based sampling — **not representative** of the market. Not in the 2023 list of >10% non-compliance foods. | [B22] Section 4.3.1 and Section 4.4; copper detail Section 4.2 |
| Nuts (all listed) | NOT FOUND | Nuts are not in the EU MACP 2021–2023. The interactive report only gives a pooled "Fruits and tree nuts" category (organic vs conventional), which mixes fruits and nuts and is not usable per nut. | [B21]–[B23] Section 3; Appendix overview charts |

Programme-level context (same reports, Section 3): EU MACP overall — 2021: 13,845 samples, 41.9% quantified, 27.0% multiple, 2.1% above MRL, 1.3% non-compliant; 2022: 11,727 samples, 48.6% quantified, 32.1% multiple, 1.6% above MRL, 0.9% non-compliant; 2023: 13,246 samples, 30.1% quantified, 16.9% multiple, 1.9% above MRL, 1.0% non-compliant.

Section B completeness: all requested fruits except "other berries" and all requested cereals (oats, wheat, rye, rice) have complete figures (n, % quantified [derived], % multiple, % above MRL, % non-compliant). Nuts and non-strawberry berries: NOT FOUND (not covered). Note: a 2024-data report may exist (cycle repeats bananas/table grapes/wheat); it was out of the requested 2021–2023 scope and was not used.

---

## C. Contaminants

Scope: EFSA occurrence values are for food **as sampled (raw grain / as sold)**, not as cooked, unless a row says otherwise. LB / MB / UB = lower / middle / upper bound (results below LOD/LOQ set to 0 / half the limit / the limit). "Left-censored" = results below LOD/LOQ. EU maximum levels (MLs) are given only as context for interpreting the occurrence numbers.

Report citations:
- **[C1]** EFSA CONTAM Panel. Scientific Opinion on Arsenic in Food. *EFSA Journal* 2009;7(10):1351. doi:10.2903/j.efsa.2009.1351 — read from the full PDF mirrored by Istituto Superiore di Sanità: https://www.iss.it/documents/20126/5708435/AsOpinion2009.pdf/a20060e5-8f41-da0e-fb26-1f39cb92bd66
- **[C2]** EFSA. Dietary exposure to inorganic arsenic in the European population. *EFSA Journal* 2014;12(3):3597. doi:10.2903/j.efsa.2014.3597 — Table 3 (p. 17), read from a PDF mirror (the Wiley original returned 403).
- **[C3]** EFSA. Chronic dietary exposure to inorganic arsenic. *EFSA Journal* 2021;19(1):6380. doi:10.2903/j.efsa.2021.6380 — values read directly from its Annex B, Table B3 ("Occurrence values of inorganic arsenic in food (µg/kg) as used for the exposure assessment"; samples 2013–2018), Zenodo doi:10.5281/zenodo.4322963, file "Annex B.xlsx". The sheet's column header says "mg/kg", but the Zenodo record says µg/kg and the magnitudes match the µg/kg figures quoted in [C4], so µg/kg is used.
- **[C4]** EFSA CONTAM Panel (Schrenk D et al.). Update of the risk assessment of inorganic arsenic in food. *EFSA Journal* 2024;22(1):e8488. doi:10.2903/j.efsa.2024.8488 — Section 3.4.1 (occurrence, taken from [C3]); Table 2 (EU MLs from Reg. (EU) 2023/915, and Codex MLs).
- **[C5]** EFSA CONTAM Panel. Cadmium in food – Scientific Opinion of the Panel on Contaminants in the Food Chain. *The EFSA Journal* (2009) 980, 1–139. doi:10.2903/j.efsa.2009.980 — Tables 5, 6, 8 and 12 (pp. 27–31); read from the ISS PDF mirror: https://www.iss.it/documents/20126/5708435/Cd_Opinion2009.pdf/1534a7cc-c54c-58bc-ce88-ba86fca21fb9
- **[C6]** EFSA. Cadmium dietary exposure in the European population. *EFSA Journal* 2012;10(1):2551. doi:10.2903/j.efsa.2012.2551 — Table 2. **The primary text could not be opened (Wiley 403).** Values below come from the secondary summary at https://heavymetalindex.com/sources/efsa2012-cadmium-dietary-exposure-europe and are labelled **SECONDARY**.
- **[C7]** Commission Regulation (EU) 2023/915 of 25 April 2023 on maximum levels for certain contaminants in food and repealing Regulation (EC) No 1881/2006. OJ L 119, 5.5.2023. CELEX 32023R0915 — Annex I, section 1.1 (aflatoxins) and section 3.2 (cadmium): https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A32023R0915. Annex I footnote 1 defines food categories by Annex I of Reg. (EC) 396/2005; in that annex (as replaced by Reg. (EU) 2018/62) pumpkin seeds are an oilseed (code 0401100): https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018R0062
- **[C8]** EFSA CONTAM Panel (Schrenk D et al.). Risk assessment of aflatoxins in food. *EFSA Journal* 2020;18(3):6040. doi:10.2903/j.efsa.2020.6040 — Tables 8 and 9 (FoodEx level 1); per-food values read directly from Annex B, Table B.7 (FoodEx level 3; samples collected 2013–2018), Zenodo doi:10.5281/zenodo.3607186, file "Annex B_ON-6040.xlsx".
- **[C9]** EFSA CONTAM Panel. Scientific Opinion on acrylamide in food. *EFSA Journal* 2015;13(6):4104, 321 pp. doi:10.2903/j.efsa.2015.4104 — Table 6 (Section 4.1.3), Appendix B Table B1, Section 4.4.2 with Figure 6 (toasting), Section on scenario B1 (Table 12) and Appendix D Table D5; read from the BVL mirror: https://www.bvl.bund.de/SharedDocs/Downloads/01_Lebensmittel/acrylamid/EFSA_Gutachten.pdf?__blob=publicationFile&v=2
- **[C10]** Chang JC, Gutenmann WH, Reid CM, Lisk DJ. Selenium content of Brazil nuts from two geographic locations in Brazil. *Chemosphere* 1995;30(4):801–802. doi:10.1016/0045-6535(94)00409-N — abstract (read via Europe PMC, PMID 7889353).
- **[C11]** Silva Junior EC, Wadt LHO, Silva KE, Lima RMB, Batista KD, Guedes MC, Carvalho GS, Carvalho TS, Reis AR, Lopes G, Guilherme LRG. Natural variation of selenium in Brazil nuts and soils from the Amazon region. *Chemosphere* 2017;188:650–658. doi:10.1016/j.chemosphere.2017.08.158 — abstract, Results (Fig. 3) and Conclusions; full text from the UNESP repository: https://repositorio.unesp.br/server/api/core/bitstreams/322b2c62-eeed-4b25-8333-22e11c5f7ec3/content
- **[C12]** USDA Agricultural Research Service. FoodData Central, SR Legacy, "Nuts, brazilnuts, dried, unblanched", FDC ID 170569 (publication date 2019-04-01), nutrient "Selenium, Se" — read via the FDC API: https://fdc.nal.usda.gov/food-details/170569

### C1. Inorganic arsenic (iAs) in rice

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| **White rice** (raw grain; EFSA 2021 data, used by EFSA 2024) | **73.9–78.5** (LB–UB mean); median 72–74; P95 134.6 | µg/kg iAs. n = 337 (34 left-censored). | [C3] Annex B Table B3, row "Rice, white" |
| **Brown rice** (raw grain; EFSA 2021 data, used by EFSA 2024) | **127.8–130.6** (LB–UB mean); median 116.7–118; P95 236 | µg/kg iAs. n = 382 (11 left-censored). EFSA 2024 quotes it as "128–131 µg/kg". | [C3] Table B3, row "Rice, brown"; [C4] Section 3.4.1 |
| Other rice types (EFSA 2021 data) | Unspecified rice 79.3–85.4 (n = 405); long-grain 76.8–86.9 (n = 502); parboiled 97.8–101.6 (n = 131); red 232.4 (n = 7); wild 130.7 (n = 4); rice flakes 123.4–125.9 (n = 113); rice cakes/waffles/crackers 146.1–148.0 (n = 579) | µg/kg iAs, LB–UB mean. | [C3] Table B3 |
| White rice (EFSA 2014) | 84.3 / 88.7 / 93.0 (LB/MB/UB mean); P95 149.1–155.4 | µg/kg iAs. n = 189. | [C2] Table 3 (p. 17) |
| Brown rice (EFSA 2014) | 150.7 / 151.9 / 153.1 (LB/MB/UB mean); P95 250 | µg/kg iAs. n = 94. | [C2] Table 3 (p. 17) |
| Other rice (EFSA 2014) | Unspecified 79.0 / 93.6 / 108.1 (n = 201); long-grain 77.6 / 88.1 / 98.6 (n = 130); parboiled 92.8 / 105.1 / 117.4 (n = 70; P95 234); red 162.4 (n = 12); wild 71.5 / 75.9 / 80.2 (n = 8); all rice 92.5 / 101.2 / 109.9 (n = 706; 17% left-censored) | µg/kg iAs, LB/MB/UB mean. | [C2] Table 3 (p. 17) |
| Rice grains (EFSA 2009) | **Total** arsenic 0.136–0.142 (LB–UB mean); median 0.110; P95 0.36; max 1.18 | mg/kg **total** As, not iAs. n = 1,122; 9.8% below LOD. No white/brown split in EFSA's own data. In ~200 rice samples with speciation, iAs was 50–60% of total As (p. 57). The exposure scenario used 0.100 mg/kg iAs for rice (70% of 0.142; Table 31, p. 74). | [C1] Table 6 (p. 42); Section 5.5 (p. 57); Table 31 (p. 74) |
| Rice literature quoted by EFSA 2009 | Swedish study (Jorhem et al. 2008): total As long-grain brown 0.240, parboiled white 0.210, white 0.100; iAs mean 0.110 (64% of total) | mg/kg. Literature summary, not EFSA occurrence data. | [C1] Section 5.1 (p. 32) |
| Cereal grains excluding rice (EFSA 2009, context) | Total As 0.015–0.041 (LB–UB mean) | mg/kg. n = 2,215; 77% below LOD. | [C1] Table 6 (p. 42) |
| Rice ML context | White (non-parboiled milled) rice 0.15; parboiled and husked (brown) rice 0.25; rice waffles/wafers/crackers/cakes, rice flakes, popped breakfast rice 0.30; rice for food for infants and young children 0.10. Codex: polished 0.2, husked 0.35 | mg/kg iAs. EU MLs (Reg. (EU) 2023/915) as tabulated by EFSA. | [C4] Table 2 and text below it |
| Boiled rice (as eaten) | NOT FOUND | EFSA occurrence tables report raw grain only; no EFSA mean for boiled white or brown rice was found. | [C1]–[C4] |

### C2. Cadmium

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| Oilseeds, pooled (EFSA 2009) | **0.2268** mean (SD 0.2306); median 0.152; P95 0.705; max 1.105 | mg/kg. n = 1,819; 4.9% below LOD. Category "04B6 Oil seeds" = poppy, sunflower, sesame and linseed (soybeans moved to legumes). | [C5] Table 8 (p. 29); category list in the opinion's food-classification annex |
| Oilseeds, pooled (EFSA 2012) | 371 (LB = MB = UB mean) | µg/kg. n = 3,496. **SECONDARY** — primary not opened. | [C6] Table 2 (via secondary summary) |
| **Sunflower seeds** | NOT FOUND (seed-specific EFSA mean) | EFSA 2009 and 2012 report oilseeds only as a pooled group. EU ML: 0.50 mg/kg. | [C5]; [C6]; ML: [C7] Annex I 3.2.11.5 |
| **Flaxseed / linseed** | NOT FOUND (seed-specific EFSA mean) | Pooled as above. EU ML: 0.50 mg/kg. | [C5]; [C6]; ML: [C7] Annex I 3.2.11.5 |
| **Pumpkin seeds** | NOT FOUND | Not named in the EFSA 2009 oilseed category; no seed-specific EFSA 2012 value seen. EU ML: 0.10 mg/kg ("oilseeds except" rape, peanut, soy, mustard, linseed, sunflower, poppy); pumpkin seeds are an oilseed in the legal food classification (code 0401100). | ML: [C7] Annex I 3.2.11.1 and Reg. (EU) 2018/62 |
| Nuts, pooled (EFSA 2009, context) | 0.0434 mean (SD 0.0672); median 0.014; P95 0.19; max 0.41 | mg/kg. n = 1,418; 32% below LOD. EU ML tree nuts 0.20 mg/kg (pine nuts 0.30). | [C5] Table 8 (p. 29); ML: [C7] 3.2.1.5 |
| **Cocoa** (powder or bean; EFSA 2009) | **0.1776** mean (SD 0.2568); median 0.1328; P95 0.50; max 2.075 | mg/kg. n = 542; 1.1% below LOD. | [C5] Table 12 (p. 31) |
| Chocolate (EFSA 2009) | 0.0896 mean (n = 1,022). Dark chocolate 0.1637 (19 samples) vs milk chocolate 0.0253 (122 samples) | mg/kg. EFSA: the dark/milk split rests on a small subset and "should be interpreted with caution". | [C5] Table 6 and text (p. 28) |
| Cocoa and chocolate (EFSA 2012) | Cocoa powder 183 (n = 732); bitter chocolate 123 (n = 30); bitter-sweet chocolate 135 (n = 58); chocolate 80.1–81.8 (n = 1,286) | µg/kg, LB–UB mean. **SECONDARY**. | [C6] Table 2 (via secondary summary) |
| Cocoa ML context | Chocolate ≥ 50% cocoa solids 0.80; chocolate < 50% or milk chocolate ≥ 30% 0.30; milk chocolate < 30% 0.10; cocoa powder sold to the final consumer 0.60 | mg/kg, EU MLs. | [C7] Annex I 3.2.15 |
| Wheat grains and flour (EFSA 2009) | 0.0300 mean (SD 0.0250); median 0.026; P95 0.080; max 0.158 | mg/kg. n = 4,243; 12% below LOD. Includes wholegrain flour and some bran, so EFSA expects it to read higher than wheat products. | [C5] Table 5 (p. 27) |
| Wheat products: bread, pasta (EFSA 2009) | 0.0137 mean (SD 0.0141); median 0.010; P95 0.041; max 0.082 | mg/kg. n = 1,976; 17% below LOD. | [C5] Table 5 (p. 27) |
| Rice (EFSA 2009) | 0.0253 mean (SD 0.0236); median 0.020; P95 0.073; max 0.134 | mg/kg. n = 1,000; 12% below LOD. No sample above the ML in force then (0.20 mg/kg). | [C5] Table 5 (p. 27) |
| Other cereals and cereal products (EFSA 2009) | 0.0171 mean (SD 0.0201); median 0.010; P95 0.060; max 0.130 | mg/kg. n = 4,216; 16% below LOD. Pools muesli, oat, buckwheat, barley and mixed-cereal products — oats, rye, buckwheat, millet and quinoa are not reported separately. | [C5] Table 5 (p. 27) |
| Bran and germ (EFSA 2009) | 0.0647 mean (SD 0.0347); P95 0.13; max 0.22 | mg/kg. n = 348. | [C5] Table 5 (p. 27) |
| Individual cereals (EFSA 2012) | NOT FOUND | Primary report not opened; the secondary summary lists no per-cereal values. | [C6] |
| Cereal ML context | Cereals 0.10; barley and rye 0.050; rice, quinoa, wheat bran, wheat gluten 0.15; durum wheat 0.18; wheat germ 0.20 | mg/kg, EU MLs. | [C7] Annex I 3.2.12 |

### C3. Aflatoxins in nuts and seeds (EFSA 2020)

Values are LB–UB means in µg/kg from Annex B Table B.7 (FoodEx level 3). AFB1 = aflatoxin B1; AFT = sum of B1, B2, G1 and G2. Most results are below the LOQ, so the upper bound is largely driven by the LOQ. FoodEx level 3 does not distinguish raw, roasted or in-shell product. EU MLs are for product placed on the market for the final consumer, given as AFB1 / AFT.

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| **Almonds** (sweet) | AFB1 0.84–1.20; AFT 1.52–2.31 | µg/kg. AFB1 n = 1,836 (91.7% left-censored); AFT n = 1,538. EU ML 8.0 / 10.0. | [C8] Annex B Table B.7; ML: [C7] 1.1.9 |
| **Walnuts** | AFB1 0.09–0.48; AFT 0.15–1.08 | µg/kg. AFB1 n = 1,092 (96.4%); AFT n = 643. EU ML (tree nuts) 2.0 / 4.0. | [C8] Table B.7; [C7] 1.1.7 |
| **Hazelnuts** | AFB1 0.99–1.29 (P95 4.29); AFT 1.86–2.59 (P95 9.0–9.6) | µg/kg. AFB1 n = 3,919 (72.0%); AFT n = 3,459. EU ML 5.0 / 10.0. | [C8] Table B.7; [C7] 1.1.11 |
| **Cashews** | AFB1 0.00–0.41; AFT 0.01–0.90 | µg/kg. AFB1 n = 616 (98.5%); AFT n = 430. EU ML (tree nuts) 2.0 / 4.0. | [C8] Table B.7; [C7] 1.1.7 |
| **Peanuts** | AFB1 2.25–2.91 (P95 4.50); AFT 2.95–4.49 (P95 6.0–7.8) | µg/kg. AFB1 n = 10,290 (88.3%); AFT n = 9,505. Roasted vs raw not distinguished. Peanut butter: AFB1 1.57–1.94 (n = 352). EU ML 2.0 / 4.0. | [C8] Table B.7; [C7] 1.1.5 |
| **Pistachios** | AFB1 2.90–3.20 (P95 7.50); AFT 3.43–4.12 (P95 9.4–10.3) | µg/kg. AFB1 n = 6,126 (83.5%); AFT n = 5,806. Highest of the listed nuts. EU ML 8.0 / 10.0. | [C8] Table B.7; [C7] 1.1.9 |
| **Brazil nuts** | AFB1 0.67–0.96 (P95 2.10); AFT 1.18–1.89 (P95 4.2–4.9) | µg/kg. AFB1 n = 311 (75.2%); AFT n = 277. EU ML 5.0 / 10.0. | [C8] Table B.7; [C7] 1.1.11 |
| **Sunflower seeds** | AFB1 0.09–0.54; AFT 0.18–1.24 | µg/kg. AFB1 n = 656 (97.1%); AFT n = 505. EU ML (oilseeds) 2.0 / 4.0. | [C8] Table B.7; [C7] 1.1.5 |
| **Pumpkin seeds** | AFB1 0.15–0.59; AFT 0.27–1.24 | µg/kg. AFB1 n = 406 (93.1%); AFT n = 368. EU ML (oilseeds) 2.0 / 4.0. | [C8] Table B.7; [C7] 1.1.5 |
| **Flaxseed / linseed** | AFB1 0.00–0.36; AFT 0.01–0.77 | µg/kg. AFB1 n = 175 (98.9%); AFT n = 161. | [C8] Table B.7 |
| **Sesame seeds** | AFB1 0.29–0.63; AFT 0.37–1.16 | µg/kg. AFB1 n = 352 (89.5%); AFT n = 329. | [C8] Table B.7 |
| **Chia seeds** | NOT FOUND | No chia category in Table B.7. A pooled "Other seeds" row exists (AFB1 4.07–4.62, n = 71), but its contents are not stated, so it cannot be attributed to chia. | [C8] Table B.7 |
| "Legumes, nuts and oilseeds" (group context) | AFB1 1.72–2.18 (n = 27,772; 86% left-censored); AFT 2.39–3.47 (n = 24,507) | µg/kg, FoodEx level 1. | [C8] Tables 8 and 9 |
| Grains (context) | AFB1: rice 0.37–0.70 (n = 1,374; 82.7%); oats 0.00–0.58 (n = 240; 100%); wheat 0.02–0.47 (n = 1,116); rye 0.00–0.45 (n = 110); buckwheat 0.06–0.25 (n = 132); millet 0.00–0.40 (n = 27) | µg/kg grain. | [C8] Table B.7 |
| Apricots (context) | AFB1: dried 0.01–0.31 (n = 285); fresh 0.01–0.94 (n = 177) | µg/kg. | [C8] Table B.7 |

### C4. Acrylamide in bread and toast (EFSA 2015)

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| Soft bread, all | **42** MB mean [LB–UB 36–49]; P95 156 | µg/kg. n = 543; 48.8% left-censored; samples collected since 2010. | [C9] Table 6 (Section 4.1.3) |
| **Wheat soft bread** | **38** [33–44]; P95 120 | µg/kg. n = 302; 45.0% left-censored. | [C9] Table 6; Appendix B Table B1 |
| **Rye soft bread** | **57** [53–61]; P95 240 | µg/kg. n = 85; 37.6% left-censored (Table B1, "Soft bread – Rye"). Table 6 "Other soft bread": 57 [51–62], n = 107. | [C9] Appendix B Table B1; Table 6 |
| **Toasted bread** (sampled as sold) | **43** [37–48] | µg/kg. n = 39; 33.3% left-censored. EFSA: "similar levels as 'Soft bread'". | [C9] Appendix B Table B1; Section 4.1.3.3 |
| Home toasting experiment | Sifted-wheat bread 3.0 → 31; wheat-and-rye bread 41.6 → 118 (untoasted → toasting time 4). "Medium" toast 16–61 | µg/kg fresh weight; household toaster, 4 breads. Untoasted: 3–8 (white) and 29–42 (rye-containing). Data are a personal communication (Hellenäs 2014) reported by EFSA, not a peer-reviewed study. | [C9] Section 4.4.2, Figure 6 (p. 52) |
| Well-toasted scenario | 100 assumed for all toasted bread → mean exposure up to +2.4%, P95 up to +7.6% | µg/kg (value from Claus et al. 2005). | [C9] Scenario B1, Table 12; Appendix D Table D5 |
| Crisp bread (context) | 171 [166–176]; P95 486. Crisp bread/rusk by cereal: wheat 126, rye 245 | µg/kg. n = 528. | [C9] Table 6; Appendix B Table B1 |
| Wholemeal vs white bread | NOT FOUND | EFSA splits bread by main cereal (wheat, rye), not by flour type/extraction rate. | [C9] |

### C5. Selenium variability in Brazil nuts

| Food | Value | Unit/notes | Source (full citation + DOI/URL + table/page) |
|---|---|---|---|
| **Brazil nuts, individual nuts** | Acre–Rondônia: mean 3.06 ± 4.01, range **0.03–31.7**. Manaus–Belém: mean 36.0 ± 50.0, range **1.25–512.0** | µg/g (ppm) fresh weight; 162 nuts per region, each analysed individually. Per 100 g (derived, × 100): 3–3,170 and 125–51,200 µg/100 g. | [C10] abstract |
| Brazil nuts, by tree and state | Kernel Se **<0.5 to 146.6**; state medians **2.07** (Mato Grosso) to **68.15** (Amazonas) | mg/kg (= µg/g) dry weight; 71 trees in 5 states, 3 nuts per tree. The Results text gives slightly different medians (Mato Grosso 2.4, Acre 3.0, Roraima 10.2, Amapá 51.2, Amazonas 66.1) than the abstract/Conclusions (2.07, 2.52, 9.96, 50.93, 68.15). Authors: one nut supplies 11% (Mato Grosso) to 288% (Amazonas) of a 70 µg/day requirement, i.e. ≈ 8–202 µg Se per nut (derived). | [C11] abstract; Results (Fig. 3); Conclusions |
| Brazil nuts, food-composition value | **1,917** | µg/100 g, dried, unblanched. 15 data points; min 136, max 2,740 µg/100 g. | [C12] |

Section C completeness: inorganic arsenic in raw white and brown rice is complete for EFSA 2014 and for the 2021 dataset used by EFSA 2024 (verified from EFSA's own annex); EFSA 2009 gives total arsenic only; boiled rice is NOT FOUND. Cadmium is complete at EFSA 2009 group level (oilseeds pooled, cocoa, wheat, rice, other cereals, bran); seed-specific values for sunflower, flax and pumpkin seeds are NOT FOUND in EFSA, and EFSA 2012 values are SECONDARY only. Aflatoxins are complete for every listed nut and seed except chia (NOT FOUND). Acrylamide is complete for wheat and rye soft bread and toast; wholemeal vs white is NOT FOUND. Brazil-nut selenium is complete (two peer-reviewed ranges plus a USDA composition value).

---

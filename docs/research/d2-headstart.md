# Head start: glycemic index, coenzyme Q10, contaminants, pesticides

Read 2026-11-03 from the sources named below. A number is entered in the app only when the source prints it. Several study rows are not averaged. Missing stays missing.

## Glycemic index

Source: Atkinson et al. 2021, Am J Clin Nutr 114:1625, Supplemental Table 1 (ISO 26642). doi:10.1093/ajcn/nqab233. The table text used is the supplemental PDF.

Entered in `src/data/glycemic.ts`:

| Food | GI | What the table prints |
|---|---|---|
| Apple, raw | 44 | one ISO test, 44 ± 5; no mean line |
| Strawberries, raw | 40 | one ISO test, 40 ± 7 |
| Oat porridge | 58 | porridge from rolled oats, mean of eight foods |
| Oat flakes | 58 | same mean, marked as carried over; dry flakes were not tested |
| White wheat bread | 73 | white wheat-flour bread, mean of 35 foods |
| Wholemeal wheat bread | 75 | mean of eight foods |
| Wholemeal rye bread | 60 | rye breads, mean of 13 foods; wholeseed loaf not listed apart |
| Pasta, boiled | 47 | white spaghetti, boiled, mean of 11 foods |
| Wholemeal pasta | 50 | wholemeal spaghetti, boiled, mean of five foods |
| Quinoa, boiled | 53 | mean of four foods |
| Green peas, boiled | 36 | frozen peas, mean of two studies; boiled not listed apart |

Left as no data, with the rows that were read and not averaged:

| Food | Rows read | Why it is not entered |
|---|---|---|
| Banana, raw | 47 ± 5; lady finger 49 ± 5 and 53 ± 4; overripe 57 ± 8 | four raw rows, no mean line |
| Grapes | crimson 50 ± 3; green 54 ± 4; black 59 ± 5 | three varieties, no mean line |
| Pear | Williams under-ripe 24 ± 3; ripe 33 ± 4 | two ripeness stages, no mean line |
| Apricot, raw | 34 ± 3 and 42 ± 5 | two tests, no mean line |
| Orange, kiwi, blueberries, raspberries, blackcurrants, avocado | no ISO row found for the raw fruit | not in the supplemental table text that was read |
| White rice, brown rice | jasmine white mean of 18 studies is 89; basmati white mean of 10 is 60; long-grain mean of six is 62; brown rows are single rices (51, 54, 72) | no mean for "white rice" or "brown rice" as a class |

## Coenzyme Q10

Source: Pravst, Žmitek and Žmitek 2010, Crit Rev Food Sci Nutr 50:269, Table 1. doi:10.1080/10408390902773037. The table is in mg/kg. The app stores mg/100 g, which is that number divided by 10.

| Food | mg/kg in the table | Entered |
|---|---|---|
| Peanuts, roasted | 26.7 | 2.67 mg/100 g |
| Pistachios, roasted | 20.1 | 2.01; the catalog entry is raw, and the chip says roasted |
| Walnuts, raw | 19.0 | 1.9 |
| Hazelnuts, roasted | 16.7 | 1.67; the catalog entry is raw, and the chip says roasted |
| Avocado | 9.5 | 0.95 |
| Blackcurrant | 3.4 | 0.34 |
| Apple | 1.2, range 1.1–1.3 | 0.12, range 0.11–0.13 |
| Banana | 0.8 | 0.08 |
| Kiwi | 0.5 | 0.05 |
| Asparagus | 2.2 | 0.22 |
| Whole-grain oats | below detection | not detected |
| Whole rice | below detection | not detected on brown rice |
| Almonds | 5.0–13.8, no single figure | not entered |
| Sesame, roasted | 17.6–23.0 | not entered |
| Orange | 1.0–2.2 | not entered |
| Strawberry | 1.4 and 0.5, two references | not entered |
| Garlic | 2.7–3.5 | not entered |
| White rice, bread, pasta, quinoa | not the whole-grain row | left as no data |

L-carnitine for these foods was not read from Demarquoy 2004 this turn. Do not copy the lentil value onto peas.

## Contaminants

Shown as class notes, not as a concentration in the food. Residue scores are unchanged.

| Note | Where it now appears | Source |
|---|---|---|
| Inorganic arsenic | brown rice and white rice | EFSA CONTAM 2009, EFSA Journal 7(10):1351. Average consumers 0.13–0.56 µg/kg body weight per day. BMDL01 0.3–8 µg/kg per day for lung, skin and bladder cancers and skin lesions. Rice grains are named as a cereal contributor. |
| Aflatoxins | nuts and seeds | EFSA CONTAM 2009, EFSA Journal 7(6):1168. The statement cites the EU maximum of 4 µg/kg total aflatoxins in almonds, hazelnuts and pistachios, and says exposure should stay as low as reasonably achievable because aflatoxins are genotoxic and carcinogenic. |
| Acrylamide | baked grains, including the breads, in addition to the hot dry potato foods already tagged | EFSA CONTAM 2015, EFSA Journal 13(6):4104. Already the source of the acrylamide card. Boiled porridge and boiled rice are not tagged. |
| Cadmium | nuts and seeds, in addition to offal, leafy crops and algae | EFSA CONTAM 2009, EFSA Journal 7(3):980. The card already cites it; the where-line now names nuts and oilseeds. |

## Pesticides

Section B of `d1-protein-and-residues.md` still has the EFSA 2021–2023 commodity rates (apples 71.0 % quantified, pears 78.7 %, grapes 81.8 %, kiwi 41.4 %, oats 26.2 %, rice 37.8 % with 5.1 % above the limit). Those figures were not re-read from the EFSA report pages on this turn, and they do not change the residue score. Using them as `typicalMrlProximity` is still a scoring decision.

## What the next phase can do without a new decision

1. Phase 6: cite the role sentences in `BIOACTIVE_ROLES`. The new coenzyme Q10 chips already carry Pravst 2010.
2. Enter a glycemic mean the day the tables print one. Do not average the banana, grape, pear or apricot rows unless the user asks for that rule to change.
3. L-carnitine: read Demarquoy 2004 Table for nuts, fruit and peas before typing a number.
4. Fats and oils still wait on a "not applicable" protein display.

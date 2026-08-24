# Primary matrix UI — wireframe / components

Mobile-first. Dark-mode capable (`data-theme` on `<html>`).

```
┌─────────────────────────────────────────────┐
│ Du bist was du isst          nav · theme    │  sticky topbar
├─────────────────────────────────────────────┤
│ Title + one-paragraph lede (no marketing)   │
│ [search] [kingdom] [class] [pattern] [axis] │  Filters
│ [CSV] [JSON]  n foods                       │
├────────┬──────┬────┬────┬────┬────┬────┬───┤
│ Food   │Class │Tier│EAA │EFA │…  │ Σ  │+col│
│ (sticky)                                    │  horizontal scroll on small screens
│ Spinat │Leafy │ B  │▓▓  │░   │    │    │    │
│ Linsen │Legum │ A  │    │    │    │    │    │
│ Ei     │Eggs  │ S  │    │    │    │    │    │
└─────────────────────────────────────────────┘
│ Pattern banner: required gaps, no flattery  │
│ <details> Source & Method </details>        │
└─────────────────────────────────────────────┘
```

## Components

| Component | Role |
| --- | --- |
| `Layout` | Brand, routes, version, footer non-advice line |
| `Filters` | Category, axis, dietary pattern, search |
| `MatrixTable` | Sortable heat-map table; class extras when one class is selected |
| `HeatCell` | 0–100 diverging rust→teal |
| `SourcePanel` | Collapsible provenance + coefficients |
| `FoodPage` | Deep dive: bars, flags, raw method traces |
| `ComparePage` | 3-column picker + axis table |
| `RecommendPage` | Gap cards (required / material / contextual) + plate checkboxes |

## Interaction notes

- Click a heat header to sort that axis.
- Food name opens `/food/:id`.
- Pattern `plant-only` hides animal rows in the matrix and still prints B12/protein/DHA gaps.
- Class filter reveals extra biochemical columns (e.g. analogue B12 on algae, CLA on ruminants).
- Export downloads the **current filtered** matrix.

## Visual language

Journal/lab, not wellness. Serif title (Source Serif 4), IBM Plex Sans/Mono for data. Accent is brass, not “superfood green.”

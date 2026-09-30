#!/usr/bin/env python3
"""Build src/data/sources/processing-evidence.json from Open Food Facts.

For each product category the catalog uses as a processing reference, count how the
products on sale are classified (NOVA groups) and which additives (E numbers) their
ingredient lists contain. Only aggregate counts are stored, with the retrieval date.

Source: Open Food Facts, https://world.openfoodfacts.org, Open Database License (ODbL)
1.0; queried through the search API at https://search.openfoodfacts.org.

Usage:
  python3 scripts/data/processing_evidence.py
"""

from __future__ import annotations

import collections
import datetime
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "src" / "data" / "sources" / "processing-evidence.json"
SEARCH = "https://search.openfoodfacts.org/search"
USER_AGENT = "du-bist-was-du-isst/1.0 (https://github.com/mrxmoex/00_T3st_env)"
CATEGORIES = ["en:instant-mashed-potatoes", "en:canned-potatoes"]
TOP_ADDITIVES = 6
E_NUMBER = re.compile(r"en:(e\d{3})[a-z]?")


def fetch_category(category: str) -> list[dict]:
    hits: list[dict] = []
    page = 1
    while True:
        query = urllib.parse.urlencode({
            "q": f'categories_tags:"{category}"',
            "page_size": 100,
            "page": page,
            "fields": "code,nova_group,ingredients_n,ingredients_tags,countries_tags",
        })
        request = urllib.request.Request(f"{SEARCH}?{query}", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=60) as response:
            data = json.load(response)
        hits.extend(data.get("hits", []))
        if not data.get("hits") or page * 100 >= data.get("count", 0):
            return hits
        page += 1
        time.sleep(1)


def e_numbers(product: dict) -> set[str]:
    matches = (E_NUMBER.fullmatch(tag) for tag in product.get("ingredients_tags") or [])
    return {match.group(1).upper() for match in matches if match}


def summarize(products: list[dict]) -> dict:
    nova = collections.Counter(p.get("nova_group") for p in products)
    additives = collections.Counter(code for p in products for code in e_numbers(p))
    counts = sorted(p["ingredients_n"] for p in products if isinstance(p.get("ingredients_n"), int))
    middle = len(counts) // 2
    median = None if not counts else counts[middle] if len(counts) % 2 else (counts[middle - 1] + counts[middle]) / 2
    return {
        "products": len(products),
        "nova": {str(group): nova.get(group, 0) for group in (1, 2, 3, 4)},
        "novaUnknown": nova.get(None, 0),
        "ingredientsKnown": len(counts),
        "ingredientsMedian": median,
        "ingredientsOver3": sum(1 for count in counts if count > 3),
        "additives": [{"code": code, "products": count} for code, count in additives.most_common(TOP_ADDITIVES)],
    }


def main() -> None:
    categories = {}
    for category in CATEGORIES:
        products = fetch_category(category)
        germany = [p for p in products if "en:germany" in (p.get("countries_tags") or [])]
        categories[category] = {"all": summarize(products), "germany": summarize(germany)}
    evidence = {
        "about": "Aggregate counts from Open Food Facts product records: NOVA group, ingredient-list length, and "
        "E numbers found in the ingredient list. Products without a NOVA classification or an ingredient count are "
        "counted separately. Additive counts are a lower bound because some ingredient lists are incomplete.",
        "source": {
            "title": "Open Food Facts",
            "url": "https://world.openfoodfacts.org",
            "license": "ODbL 1.0",
            "attribution": "Open Food Facts contributors, https://world.openfoodfacts.org",
            "api": SEARCH,
        },
        "retrieved": datetime.date.today().isoformat(),
        "categories": categories,
    }
    OUTPUT.write_text(json.dumps(evidence, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUTPUT.relative_to(ROOT)}: {len(categories)} categories")


if __name__ == "__main__":
    main()

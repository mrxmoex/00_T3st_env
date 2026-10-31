#!/usr/bin/env python3
"""Find BLS 4.0 codes and USDA SR Legacy FDC ids for src/data/sources/manifest.json.

Searches the archives that build_snapshot.py downloaded and verified (run it once first).
Every query word must appear in the German or English name (case-insensitive).

Usage:
  python3 scripts/data/find_food.py Apfel roh
  python3 scripts/data/find_food.py --fdc almonds raw

BLS rows show kcal, protein, fat, carbohydrate, fibre per 100 g and whether all eleven
amino acids the snapshot needs are reported (build_snapshot.py stops when they are not
and no aaPattern is given).
"""

from __future__ import annotations

import argparse
import io
import sys
import zipfile

import openpyxl

from build_snapshot import (
    AMINO_ACIDS,
    BLS_ARCHIVE,
    BLS_SHA256,
    FDC_ARCHIVE,
    FDC_SHA256,
    NUTRIENTS,
    bls_archive_url,
    ensure_archive,
    parse_bls_value,
    read_csv,
)

SHOWN = ("kcal", "protein", "fat", "carbsAvailable", "fibre")


def matches(words: list[str], *names: str | None) -> bool:
    text = " ".join(name or "" for name in names).lower()
    return all(word.lower() in text for word in words)


def search_bls(words: list[str], limit: int) -> None:
    archive = ensure_archive(BLS_ARCHIVE, BLS_SHA256, bls_archive_url)
    with zipfile.ZipFile(archive) as bundle:
        member = next(n for n in bundle.namelist() if n.endswith("BLS_4_0_Daten_2025_DE.xlsx"))
        workbook = openpyxl.load_workbook(io.BytesIO(bundle.read(member)), read_only=True, data_only=True)
    rows = workbook.worksheets[0].iter_rows(values_only=True)
    header = next(rows)
    column = {
        str(title).split(" ")[0]: index
        for index, title in enumerate(header)
        if index >= 3 and title and "Datenherkunft" not in title and "Referenz" not in title and title != "Hinweis"
    }
    codes = {key: NUTRIENTS[key][1] for key in [*SHOWN, *AMINO_ACIDS]}
    shown = 0
    for row in rows:
        if not matches(words, row[1], row[2]):
            continue
        values = {key: parse_bls_value(row[column[code]])[0] if code in column else None for key, code in codes.items()}
        aa = "AA ok" if all(values[key] for key in AMINO_ACIDS) else "AA missing"
        numbers = " ".join(f"{key}={values[key]}" for key in SHOWN)
        print(f"{row[0]}  {row[1]} | {row[2]} | {numbers} | {aa}")
        shown += 1
        if shown >= limit:
            print(f"… stopped at {limit}; refine the query")
            return
    if shown == 0:
        print("no BLS match")


def search_fdc(words: list[str], limit: int) -> None:
    archive = ensure_archive(FDC_ARCHIVE, FDC_SHA256, lambda: "")
    with zipfile.ZipFile(archive) as bundle:
        hits = [r for r in read_csv(bundle, "food.csv") if matches(words, r["description"])]
    for row in hits[:limit]:
        print(f"{row['fdc_id']}  {row['description']}")
    if len(hits) > limit:
        print(f"… {len(hits) - limit} more; refine the query")
    if not hits:
        print("no FDC match")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("words", nargs="+", help="words that must all appear in the name")
    parser.add_argument("--fdc", action="store_true", help="search USDA SR Legacy instead of BLS")
    parser.add_argument("--limit", type=int, default=25)
    args = parser.parse_args()
    if args.fdc:
        search_fdc(args.words, args.limit)
    else:
        search_bls(args.words, args.limit)


if __name__ == "__main__":
    sys.exit(main())

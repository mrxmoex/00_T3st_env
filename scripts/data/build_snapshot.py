#!/usr/bin/env python3
"""Build src/data/sources/snapshot.json from the open food composition databases.

Sources (downloaded into .cache/datasets/, verified by SHA-256):
  * BLS 4.0 - Bundeslebensmittelschluessel, Max Rubner-Institut (2025), CC BY 4.0,
    DOI 10.25826/Data20251217-134202-0
  * USDA FoodData Central, SR Legacy (April 2018), public domain (CC0 1.0)

For every food in src/data/sources/manifest.json the primary entry (BLS when listed,
otherwise FDC) supplies all nutrients it reports. The secondary entry only fills
nutrients the primary does not report. Every value keeps its database and the
database's own provenance category. Missing stays missing; it is never turned into 0.

Usage:
  pip install -r scripts/data/requirements.txt
  python3 scripts/data/build_snapshot.py
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import html
import io
import json
import re
import sys
import urllib.request
import zipfile
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / ".cache" / "datasets"
MANIFEST = ROOT / "src" / "data" / "sources" / "manifest.json"
SNAPSHOT = ROOT / "src" / "data" / "sources" / "snapshot.json"

BLS_PAGE = "https://blsdb.de/download"
BLS_ARCHIVE = "BLS_4_0_2025_DE.zip"
BLS_SHA256 = "12b7a6ba62807ec9b301eb276f897dc85f99b2292311618dec3749a12d984c91"
FDC_URL = "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip"
FDC_ARCHIVE = "FoodData_Central_sr_legacy_food_csv_2018-04.zip"
FDC_SHA256 = "b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0"

DATASETS = {
    "BLS": {
        "title": "Bundeslebensmittelschlüssel (BLS) 4.0 – Deutsche Nährstoffdatenbank",
        "publisher": "Max Rubner-Institut",
        "year": 2025,
        "doi": "10.25826/Data20251217-134202-0",
        "license": "CC BY 4.0",
        "url": "https://blsdb.de",
        "citation": "Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0 - Deutsche Nährstoffdatenbank. Karlsruhe. DOI: 10.25826/Data20251217-134202-0",
        "archiveSha256": BLS_SHA256,
    },
    "FDC": {
        "title": "USDA FoodData Central – SR Legacy",
        "publisher": "U.S. Department of Agriculture, Agricultural Research Service",
        "year": 2018,
        "release": "2018-04",
        "license": "Public domain (CC0 1.0)",
        "url": "https://fdc.nal.usda.gov",
        "citation": "U.S. Department of Agriculture, Agricultural Research Service. FoodData Central: SR Legacy, April 2018. fdc.nal.usda.gov",
        "archiveSha256": FDC_SHA256,
    },
}

# Canonical nutrient key -> (unit, BLS code, BLS unit factor, FDC nutrient numbers in preference order)
NUTRIENTS: dict[str, tuple[str, str | None, float, tuple[str, ...]]] = {
    "kcal": ("kcal", "ENERCC", 1, ("208",)),
    "water": ("g", "WATER", 1, ("255",)),
    "protein": ("g", "PROT625", 1, ("203",)),
    "fat": ("g", "FAT", 1, ("204",)),
    "carbsAvailable": ("g", "CHO", 1, ()),
    "fibre": ("g", "FIBT", 1, ("291",)),
    "sugars": ("g", "SUGAR", 1, ("269",)),
    "starch": ("g", "STARCH", 1, ("209",)),
    "lactose": ("g", "LACS", 1, ("213",)),
    "his": ("g", "HIS", 1, ("512",)),
    "ile": ("g", "ILE", 1, ("503",)),
    "leu": ("g", "LEU", 1, ("504",)),
    "lys": ("g", "LYS", 1, ("505",)),
    "met": ("g", "MET", 1, ("506",)),
    "cys": ("g", "CYSTE", 1, ("507",)),
    "phe": ("g", "PHE", 1, ("508",)),
    "tyr": ("g", "TYR", 1, ("509",)),
    "thr": ("g", "THR", 1, ("502",)),
    "trp": ("g", "TRP", 1, ("501",)),
    "val": ("g", "VAL", 1, ("510",)),
    "sfa": ("g", "FASAT", 1, ("606",)),
    "mufa": ("g", "FAMS", 1, ("645",)),
    "pufa": ("g", "FAPU", 1, ("646",)),
    "ala": ("g", "F18:3CN3", 1, ("851", "619")),
    "epa": ("g", "F20:5CN3", 1, ("629",)),
    "dpa": ("g", "F22:5CN3", 1, ("631",)),
    "dha": ("g", "F22:6CN3", 1, ("621",)),
    "la": ("g", "F18:2CN6", 1, ("675", "618")),
    "aa": ("g", "F20:4CN6", 1, ("855", "620")),
    "c15": ("g", "F15:0", 1, ("652",)),
    "c17": ("g", "F17:0", 1, ("653",)),
    "cla": ("g", "F18:2C9T11", 1, ("670",)),
    "retinol": ("µg", "RETOL", 1, ("319",)),
    "betaCarotene": ("µg", "CARTB", 1, ("321",)),
    "vitaminARae": ("µg", "VITAA", 1, ("320",)),
    "vitaminD": ("µg", "VITD", 1, ("328",)),
    "vitaminE": ("mg", "VITE", 1, ("323",)),
    "vitaminK": ("µg", "VITK", 1, ("430",)),
    "thiamin": ("mg", "THIA", 1, ("404",)),
    "riboflavin": ("mg", "RIBF", 1, ("405",)),
    "niacin": ("mg", "NIA", 1, ("406",)),
    "vitaminB6": ("mg", "VITB6", 0.001, ("415",)),
    "folate": ("µg", "FOL", 1, ("435", "417")),
    "vitaminB12": ("µg", "VITB12", 1, ("418",)),
    "vitaminC": ("mg", "VITC", 1, ("401",)),
    "choline": ("mg", None, 1, ("421",)),
    "sodium": ("mg", "NA", 1, ("307",)),
    "potassium": ("mg", "K", 1, ("306",)),
    "calcium": ("mg", "CA", 1, ("301",)),
    "magnesium": ("mg", "MG", 1, ("304",)),
    "phosphorus": ("mg", "P", 1, ("305",)),
    "iron": ("mg", "FE", 1, ("303",)),
    "zinc": ("mg", "ZN", 1, ("309",)),
    "copper": ("mg", "CU", 0.001, ("312",)),
    "iodine": ("µg", "ID", 1, ("314",)),
    "selenium": ("µg", None, 1, ("317",)),
    "cholesterol": ("mg", "CHORL", 1, ("601",)),
}
DERIVED = {"provitaminAOther": "µg"}
AMINO_ACIDS = ("his", "ile", "leu", "lys", "met", "cys", "phe", "tyr", "thr", "trp", "val")

BLS_PROVENANCE = {
    "Analyse": "analysis",
    "Rezeptberechnung": "recipe",
    "Musterberechnung": "pattern",
    "Literatur": "literature",
    "Aggregation": "aggregation",
    "Labelangabe": "label",
    "Nährstoffdatenbank": "database",
    "Übernommener Wert": "borrowed",
    "Reskalierung": "rescaled",
    "Logische Null": "logicalZero",
    "Logische Annahme": "assumption",
    "Spuren": "trace",
    "Formelberechnung": "formula",
}
BLS_TRACE_TOKENS = {"TR", "<LOD", "<LOQ", "<LOD or <LOQ"}

# FDC food_nutrient_source.code -> provenance, when not refined by the derivation code.
FDC_SOURCE_CODES = {
    "1": "analysis",
    "12": "analysis",
    "13": "literature",
    "6": "aggregation",
    "11": "aggregation",
    "7": "logicalZero",
    "5": "label",
    "8": "label",
    "9": "label",
}


def fdc_derivation_category(code: str, source_code: str) -> str:
    if source_code in FDC_SOURCE_CODES:
        return FDC_SOURCE_CODES[source_code]
    if code.startswith(("BF", "BD", "BNA", "CA", "O", "FL")):
        return "borrowed"
    if code.startswith(("DA", "DI")):
        return "rescaled"
    if code.startswith("R"):
        return "recipe"
    if code == "T":
        return "database"
    if code == "S":
        return "assumption"
    return "formula"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def download(url: str, target: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "du-bist-was-du-isst snapshot builder"})
    with urllib.request.urlopen(request, timeout=120) as response, target.open("wb") as out:
        out.write(response.read())


def bls_archive_url() -> str:
    request = urllib.request.Request(BLS_PAGE, headers={"User-Agent": "du-bist-was-du-isst snapshot builder"})
    with urllib.request.urlopen(request, timeout=60) as response:
        page = html.unescape(response.read().decode("utf-8", "replace"))
    match = re.search(r'href="(/assets/uploads/BLS_4_0_2025_DE\.zip\?token=[^"]+)"', page)
    if not match:
        raise SystemExit(f"Could not find the BLS archive link on {BLS_PAGE}; download it manually into {CACHE}.")
    return "https://blsdb.de" + match.group(1)


def ensure_archive(name: str, expected: str, url_factory) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f"downloading {name} …", file=sys.stderr)
        download(url_factory(), path)
    actual = sha256(path)
    if actual != expected:
        raise SystemExit(
            f"{name}: SHA-256 {actual} does not match the pinned {expected}. "
            "The upstream dataset changed; review it before updating the pin."
        )
    return path


def parse_bls_value(raw) -> tuple[float | None, bool]:
    """Return (value, is_trace). None means missing."""
    if raw is None:
        return None, False
    if isinstance(raw, (int, float)):
        return float(raw), False
    text = str(raw).strip()
    if text in ("", "-"):
        return None, False
    if text in BLS_TRACE_TOKENS:
        return 0.0, True
    try:
        return float(text.replace(",", ".")), False
    except ValueError:
        raise SystemExit(f"Unexpected BLS value token: {text!r}")


def load_bls(archive: Path, codes: set[str]) -> dict[str, dict]:
    with zipfile.ZipFile(archive) as bundle:
        member = next(n for n in bundle.namelist() if n.endswith("BLS_4_0_Daten_2025_DE.xlsx"))
        workbook = openpyxl.load_workbook(io.BytesIO(bundle.read(member)), read_only=True, data_only=True)
    sheet = workbook.worksheets[0]
    rows = sheet.iter_rows(values_only=True)
    header = next(rows)
    columns: dict[str, tuple[int, int]] = {}
    for index, title in enumerate(header):
        if index < 3 or title is None or "Datenherkunft" in title or "Referenz" in title or title == "Hinweis":
            continue
        code = title.split(" ")[0]
        columns[code] = (index, index + 1)
    found: dict[str, dict] = {}
    for row in rows:
        if row[0] not in codes:
            continue
        values: dict[str, tuple[float | None, str | None]] = {}
        for code, (value_index, source_index) in columns.items():
            value, is_trace = parse_bls_value(row[value_index])
            provenance = BLS_PROVENANCE.get(row[source_index] or "", None)
            if is_trace:
                provenance = "trace"
            values[code] = (value, provenance)
        found[row[0]] = {"name": {"de": row[1], "en": row[2]}, "values": values}
    missing = codes - found.keys()
    if missing:
        raise SystemExit(f"BLS codes not found: {sorted(missing)}")
    return found


def read_csv(bundle: zipfile.ZipFile, suffix: str):
    member = next(n for n in bundle.namelist() if n.endswith("/" + suffix))
    with bundle.open(member) as handle:
        yield from csv.DictReader(io.TextIOWrapper(handle, encoding="utf-8"))


def load_fdc(archive: Path, ids: set[str]) -> dict[str, dict]:
    with zipfile.ZipFile(archive) as bundle:
        names = {r["fdc_id"]: r["description"] for r in read_csv(bundle, "food.csv") if r["fdc_id"] in ids}
        number_by_id = {r["id"]: r["nutrient_nbr"] for r in read_csv(bundle, "nutrient.csv")}
        source_code_by_id = {r["id"]: r["code"] for r in read_csv(bundle, "food_nutrient_source.csv")}
        derivations = {
            r["id"]: fdc_derivation_category(r["code"], source_code_by_id.get(r["source_id"], ""))
            for r in read_csv(bundle, "food_nutrient_derivation.csv")
        }
        found: dict[str, dict] = {fdc_id: {"name": {"en": name}, "values": {}} for fdc_id, name in names.items()}
        for row in read_csv(bundle, "food_nutrient.csv"):
            if row["fdc_id"] not in found:
                continue
            number = number_by_id.get(row["nutrient_id"])
            if not number or row["amount"] == "":
                continue
            provenance = derivations.get(row["derivation_id"], "database")
            found[row["fdc_id"]]["values"][number] = (float(row["amount"]), provenance)
    missing = ids - found.keys()
    if missing:
        raise SystemExit(f"FDC ids not found in SR Legacy: {sorted(missing)}")
    return found


def canonical_from_bls(entry: dict) -> dict[str, tuple[float, str] | None]:
    out: dict[str, tuple[float, str] | None] = {}
    for key, (_unit, code, factor, _fdc) in NUTRIENTS.items():
        if code is None:
            out[key] = None
            continue
        value, provenance = entry["values"].get(code, (None, None))
        out[key] = None if value is None else (value * factor, provenance or "database")
    rae, retinol, beta = out["vitaminARae"], out["retinol"], out["betaCarotene"]
    if rae is not None and retinol is not None and beta is not None:
        other = max(0.0, (rae[0] - retinol[0] - beta[0] / 12) * 24)
        out["provitaminAOther"] = (round(other, 1), "formula")
    else:
        out["provitaminAOther"] = None
    return out


def canonical_from_fdc(entry: dict) -> dict[str, tuple[float, str] | None]:
    values = entry["values"]
    out: dict[str, tuple[float, str] | None] = {}
    for key, (_unit, _code, _factor, numbers) in NUTRIENTS.items():
        out[key] = next((values[n] for n in numbers if n in values), None)
    if "205" in values and "291" in values:
        out["carbsAvailable"] = (max(0.0, values["205"][0] - values["291"][0]), "formula")
    if out["starch"] is None and out["carbsAvailable"] is not None and out["sugars"] is not None:
        out["starch"] = (round(max(0.0, out["carbsAvailable"][0] - out["sugars"][0]), 3), "formula")
    alpha, crypto = values.get("322"), values.get("334")
    if alpha is not None or crypto is not None:
        total = (alpha[0] if alpha else 0.0) + (crypto[0] if crypto else 0.0)
        out["provitaminAOther"] = (total, (alpha or crypto)[1])
    else:
        out["provitaminAOther"] = None
    return out


def compact(value: float) -> float:
    return float(f"{value:.6g}")


def build(manifest: dict, bls: dict[str, dict], fdc: dict[str, dict]) -> dict:
    foods: dict[str, dict] = {}
    for item in manifest["foods"]:
        entries = []
        if "bls" in item:
            entries.append(("BLS", item["bls"], canonical_from_bls(bls[item["bls"]]), bls[item["bls"]]["name"], None))
        if "fdc" in item:
            entries.append(("FDC", item["fdc"], canonical_from_fdc(fdc[item["fdc"]]), fdc[item["fdc"]]["name"], item.get("fdcMatch")))
        values: dict[str, list | None] = {}
        for key in [*NUTRIENTS, *DERIVED]:
            chosen = None
            for db, _code, canonical, _name, match in entries:
                hit = canonical.get(key)
                if hit is None:
                    continue
                provenance = hit[1]
                if db == "FDC" and match == "similar" and entries[0][0] == "BLS":
                    provenance = "borrowed"
                chosen = [compact(hit[0]), provenance, db]
                break
            values[key] = chosen
        for required in ("kcal", "protein", "fat", "carbsAvailable", "fibre"):
            if values[required] is None:
                raise SystemExit(f"{item['id']}: required nutrient {required} missing in every source")
        if values["starch"] is None and values["sugars"] is not None:
            starch = max(0.0, values["carbsAvailable"][0] - values["sugars"][0])
            values["starch"] = [compact(starch), "formula", values["carbsAvailable"][2]]
        sources = [
            {"db": db, "code": code, "name": name, **({"match": match} if match else {})}
            for db, code, _canonical, name, match in entries
        ]
        foods[item["id"]] = {"sources": sources, "values": values}

    gaps = []
    for item in manifest["foods"]:
        pattern_id = item.get("aaPattern")
        values = foods[item["id"]]["values"]
        if pattern_id:
            # Same method as BLS "Musterberechnung": a similar food's amino acid pattern,
            # scaled to this food's protein, fills only the amino acids the sources lack.
            pattern = foods[pattern_id]["values"]
            ratio = values["protein"][0] / pattern["protein"][0]
            for key in AMINO_ACIDS:
                if values[key] is None and pattern[key] is not None:
                    values[key] = [compact(pattern[key][0] * ratio), "pattern", pattern[key][2]]
            foods[item["id"]]["aminoAcidPattern"] = pattern_id
        missing_aa = [key for key in AMINO_ACIDS if values[key] is None]
        if missing_aa:
            gaps.append(f"{item['id']}: {missing_aa}")
    if gaps:
        raise SystemExit("Amino acids missing; add an aaPattern to the manifest:\n  " + "\n  ".join(gaps))
    return {
        "generatedBy": "scripts/data/build_snapshot.py",
        "datasets": DATASETS,
        "units": {key: spec[0] for key, spec in NUTRIENTS.items()} | DERIVED,
        "foods": foods,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--output", type=Path, default=SNAPSHOT)
    args = parser.parse_args()

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    ids = [item["id"] for item in manifest["foods"]]
    duplicates = {x for x in ids if ids.count(x) > 1}
    if duplicates:
        raise SystemExit(f"Duplicate ids in manifest: {sorted(duplicates)}")

    bls_codes = {item["bls"] for item in manifest["foods"] if "bls" in item}
    unknown_patterns = {item["aaPattern"] for item in manifest["foods"] if "aaPattern" in item} - set(ids)
    if unknown_patterns:
        raise SystemExit(f"aaPattern must name a food in the manifest: {sorted(unknown_patterns)}")
    fdc_ids = {item["fdc"] for item in manifest["foods"] if "fdc" in item}
    bls = load_bls(ensure_archive(BLS_ARCHIVE, BLS_SHA256, bls_archive_url), bls_codes)
    fdc = load_fdc(ensure_archive(FDC_ARCHIVE, FDC_SHA256, lambda: FDC_URL), fdc_ids)

    snapshot = build(manifest, bls, fdc)
    args.output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {args.output.relative_to(ROOT)}: {len(snapshot['foods'])} foods", file=sys.stderr)


if __name__ == "__main__":
    main()

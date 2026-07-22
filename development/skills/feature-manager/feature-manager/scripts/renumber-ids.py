#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["pyyaml>=6.0"]
# ///
"""renumber-ids.py — Pad feature IDs with zeros at digit limit.

Usage:
    uv run scripts/renumber-ids.py --dry-run
    uv run scripts/renumber-ids.py --width 5
    uv run scripts/renumber-ids.py

Exact invocation:
  `uv run scripts/renumber-ids.py --dry-run` — preview only
  `uv run scripts/renumber-ids.py` — execute if preview good

Reads ./FEATURES.yml, pads IDs, updates depends_on, writes back.
If --width omitted, current_max + 1 used.
"""

import argparse
import re
import sys

try:
    import yaml
except ImportError:
    print("Error: pyyaml required. Run: uv add pyyaml", file=sys.stderr)
    sys.exit(1)

FEATURE_FILE = "./FEATURES.yml"


def parse_args():
    p = argparse.ArgumentParser(
        description="Renumber feature IDs with leading zeros."
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing.",
    )
    p.add_argument(
        "--width",
        type=int,
        default=0,
        help="Target digit width. Default = current max + 1.",
    )
    return p.parse_args()


def load_features(path):
    try:
        with open(path, "r") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"Error: {path} not found", file=sys.stderr)
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"Error parsing YAML: {e}", file=sys.stderr)
        sys.exit(1)


def collect_ids(data):
    return [str(feat["id"]) for feat in data.get("features", [])]


def determine_new_width(ids, explicit_width):
    if explicit_width:
        return explicit_width
    widths = [len(re.sub(r"^F", "", i)) for i in ids]
    return max(widths) + 1 if widths else 4


def build_mapping(ids, new_width):
    mapping = {}
    for old_id in ids:
        num = re.sub(r"^F", "", old_id)
        new_num = num.zfill(new_width)
        mapping[old_id] = f"F{new_num}"
    return mapping


def apply_mapping(data, mapping):
    for feat in data.get("features", []):
        old_id = str(feat["id"])
        feat["id"] = mapping.get(old_id, old_id)
        if "depends_on" in feat and feat["depends_on"]:
            feat["depends_on"] = [
                mapping.get(str(d), str(d)) for d in feat["depends_on"]
            ]


def write_features(path, data, dry_run):
    output = yaml.dump(
        data,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
    )
    if dry_run:
        print("=== DRY RUN ===")
        print(output)
    else:
        with open(path, "w") as f:
            f.write(output)


def main():
    args = parse_args()
    data = load_features(FEATURE_FILE)
    ids = collect_ids(data)
    if not ids:
        print("No features found.")
        sys.exit(0)

    new_width = determine_new_width(ids, args.width)
    mapping = build_mapping(ids, new_width)

    if args.dry_run:
        print(f"Would renumber {len(mapping)} feature(s) to width {new_width}")
        for old_id, new_id in mapping.items():
            print(f"  {old_id} -> {new_id}")
        sys.exit(0)

    apply_mapping(data, mapping)
    write_features(FEATURE_FILE, data, dry_run=False)
    print(f"Renumbered {len(mapping)} feature(s) to width {new_width}")
    for old_id, new_id in mapping.items():
        print(f"  {old_id} -> {new_id}")


if __name__ == "__main__":
    main()

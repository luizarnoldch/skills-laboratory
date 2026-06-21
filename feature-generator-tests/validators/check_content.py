#!/usr/bin/env python3
"""
check_content.py <output_dir> <entity> <templates_dir>

Compara cada archivo generado contra el template correspondiente.
Mide similitud usando difflib (no requiere ML).
Threshold de aprobación: 70% de similitud estructural.
"""

import sys
import json
import difflib
import re
from pathlib import Path

def normalize(text: str) -> str:
    """Elimina nombres de entidad específicos para comparar estructura."""
    entity = sys.argv[2].lower()
    entity_cap = entity.capitalize()
    return (text
        .replace(entity_cap, "ENTITY_CAP")
        .replace(entity, "ENTITY")
        .strip())

def similarity(a: str, b: str) -> float:
    """Retorna similitud de 0.0 a 1.0."""
    a_norm = normalize(a)
    b_norm = normalize(b)
    return difflib.SequenceMatcher(None, a_norm, b_norm).ratio()

def check_required_patterns(content: str, file_type: str) -> list:
    """Verifica patrones obligatorios por tipo de archivo."""
    patterns = {
        "schema": [
            ("import { z } from 'zod'", "import Zod"),
            ("z.object({", "define schema con z.object"),
        ],
        "repository": [
            ("async ", "funciones async"),
        ],
        "service": [
            ("import", "tiene imports"),
            ("async ", "funciones async"),
        ],
        "router": [
            ("createTRPCRouter", "usa createTRPCRouter del skill"),
            ("input:", "define inputs con Zod"),
        ],
        "hook": [
            ("useQuery|useMutation|useSuspenseQuery", "usa TanStack Query"),
        ]
    }

    results = []
    for pattern, description in patterns.get(file_type, []):
        passed = bool(re.search(pattern, content))
        results.append({
            "pattern": description,
            "passed": passed,
            "evidence": f"Encontrado: '{pattern}'" if passed else f"No encontrado: '{pattern}'"
        })
    return results

def main():
    output_dir = Path(sys.argv[1])
    entity = sys.argv[2]
    templates_dir = Path(sys.argv[3]) if len(sys.argv) > 3 else None

    features_dir = output_dir / "features" / entity
    results = []

    file_map = {
        f"schemas/{entity}.schema.ts": "schema",
        f"server/{entity}.repository.ts": "repository",
        f"server/{entity}.service.ts": "service",
        f"server/{entity}.router.ts": "router",
    }

    for relative_path, file_type in file_map.items():
        output_file = features_dir / relative_path

        if not output_file.exists():
            results.append({
                "file": relative_path,
                "status": "MISSING",
                "similarity": 0.0,
                "pattern_checks": []
            })
            continue

        content = output_file.read_text()
        pattern_checks = check_required_patterns(content, file_type)

        sim_score = None
        if templates_dir:
            template_file = templates_dir / f"{file_type}.template.ts"
            if template_file.exists():
                template_content = template_file.read_text()
                sim_score = similarity(template_content, content)

        pattern_pass = sum(1 for p in pattern_checks if p["passed"])
        pattern_total = len(pattern_checks)

        results.append({
            "file": relative_path,
            "status": "FOUND",
            "similarity_score": sim_score,
            "similarity_pass": (sim_score >= 0.70) if sim_score is not None else None,
            "pattern_pass_rate": pattern_pass / pattern_total if pattern_total > 0 else None,
            "pattern_checks": pattern_checks
        })

    found = [r for r in results if r["status"] == "FOUND"]
    pattern_pass_total = sum(
        1 for r in found
        for p in r["pattern_checks"] if p["passed"]
    )
    pattern_total = sum(len(r["pattern_checks"]) for r in found)

    summary = {
        "files_found": len(found),
        "files_missing": len([r for r in results if r["status"] == "MISSING"]),
        "overall_pattern_pass_rate": pattern_pass_total / pattern_total if pattern_total > 0 else 0,
        "results": results
    }

    output_path = output_dir / "content_result.json"
    output_path.write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()

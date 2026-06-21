#!/usr/bin/env python3
"""
generate_report.py <workspace> <entity>
Genera un reporte comparativo between with_skill y without_skill.
"""

import json
from pathlib import Path

def load_json(path: Path) -> dict:
    if path.exists():
        return json.loads(path.read_text())
    return {"error": f"File not found: {path}"}

def main():
    workspace = Path(sys.argv[1])
    entity = sys.argv[2]

    with_skill = {}
    without_skill = {}

    for prefix in ["with_skill", "without_skill"]:
        base = workspace / prefix / "outputs"
        structure = load_json(base / "structure_result.json")
        content = load_json(base / "content_result.json")
        compilation = load_json(base / "compilation_result.json")
        if prefix == "with_skill":
            with_skill = {
                "structure": structure,
                "content": content,
                "compilation": compilation
            }
        else:
            without_skill = {
                "structure": structure,
                "content": content,
                "compilation": compilation
            }

    report = {
        "entity": entity,
        "timestamp": str(workspace.name),
        "with_skill": with_skill,
        "without_skill": without_skill
    }

    output_path = workspace / "report.json"
    output_path.write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    import sys
    main()

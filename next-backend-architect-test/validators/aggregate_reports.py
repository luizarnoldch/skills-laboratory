#!/usr/bin/env python3
"""
aggregate_reports.py

Lee todos los grading.json, structure_result.json, content_result.json
y compilation_result.json del workspace y genera reports/benchmark.json.

Uso:
  python3 validators/aggregate_reports.py

Debe ejecutarse desde la raíz de feature-generator-tests/.

Genera:
  reports/benchmark.json   ← resumen agregado (compatible con skill-creator viewer)
  reports/benchmark.md     ← versión legible
"""

import json
import math
from datetime import datetime, timezone
from pathlib import Path


def calc_stats(values: list[float]) -> dict:
    if not values:
        return {"mean": 0.0, "stddev": 0.0, "min": 0.0, "max": 0.0}
    n = len(values)
    mean = sum(values) / n
    stddev = math.sqrt(sum((x - mean) ** 2 for x in values) / n) if n > 1 else 0.0
    return {
        "mean": round(mean, 4),
        "stddev": round(stddev, 4),
        "min": round(min(values), 4),
        "max": round(max(values), 4),
    }


def load_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"  Warning: no se pudo leer {path}: {e}")
        return None


def build_expectations_from_validators(outputs_dir: Path) -> list[dict]:
    """Construye lista de expectations para grading.json desde los validators."""
    expectations = []

    # Desde structure_result.json
    sr = load_json(outputs_dir / "structure_result.json")
    if sr:
        for f in sr.get("files", []):
            expectations.append(
                {
                    "text": f"Estructura: {f['file']} existe",
                    "passed": f["passed"],
                    "evidence": "Encontrado"
                    if f["passed"]
                    else f"No encontrado en {outputs_dir}/src/features/",
                }
            )

    # Desde content_result.json
    cr = load_json(outputs_dir / "content_result.json")
    if cr:
        for file_result in cr.get("file_results", []):
            for pr in file_result.get("pattern_results", []):
                expectations.append(
                    {
                        "text": f"Contenido [{file_result['file']}]: {pr['text']}",
                        "passed": pr["passed"],
                        "evidence": pr["evidence"],
                    }
                )
            if file_result.get("similarity_score") is not None:
                expectations.append(
                    {
                        "text": f"Similitud con template [{file_result['file']}] >= 70%",
                        "passed": file_result.get("similarity_pass", False),
                        "evidence": f"Score: {file_result['similarity_score']:.0%}",
                    }
                )

    # Desde compilation_result.json
    comp = load_json(outputs_dir / "compilation_result.json")
    if comp:
        expectations.append(
            {
                "text": "Compilación TypeScript sin errores",
                "passed": comp.get("compilation_pass", False),
                "evidence": f"{comp.get('error_count', 0)} errores"
                if not comp.get("compilation_pass")
                else "tsc --noEmit sin errores",
            }
        )

    return expectations


def main():
    workspace = Path("workspace")
    reports_dir = Path("reports")
    reports_dir.mkdir(exist_ok=True)

    eval_dirs = sorted(workspace.glob("eval-*"))
    if not eval_dirs:
        print("No se encontraron directorios eval-* en workspace/")
        return

    all_runs = []
    config_pass_rates: dict[str, list[float]] = {}
    config_times: dict[str, list[float]] = {}

    for eval_dir in eval_dirs:
        eval_id_str = eval_dir.name.split("-")[1] if "-" in eval_dir.name else "0"
        try:
            eval_id = int(eval_id_str)
        except ValueError:
            eval_id = 0
        eval_name = eval_dir.name

        print(f"\n── Procesando: {eval_dir.name}")

        for config in ["with_skill", "without_skill"]:
            config_dir = eval_dir / config
            outputs_dir = config_dir / "outputs"

            if not outputs_dir.exists():
                print(f"   Skipping {config} — carpeta outputs no encontrada")
                continue

            # Leer grading.json si existe, si no construir desde validators
            grading_path = config_dir / "grading.json"
            if grading_path.exists():
                grading = load_json(grading_path)
                expectations = grading.get("expectations", []) if grading else []
                timing = grading.get("timing", {}) if grading else {}
            else:
                print(
                    f"   grading.json no encontrado en {config_dir} — construyendo desde validators"
                )
                expectations = build_expectations_from_validators(outputs_dir)
                timing = {}

            # Calcular pass rate
            if expectations:
                passed = sum(1 for e in expectations if e.get("passed", False))
                total = len(expectations)
                pass_rate = round(passed / total, 4)
            else:
                passed, total, pass_rate = 0, 0, 0.0

            time_seconds = timing.get("total_duration_seconds", 0.0)

            print(f"   {config}: {passed}/{total} passed ({pass_rate:.0%})")

            run = {
                "eval_id": eval_id,
                "eval_name": eval_name,
                "configuration": config,
                "run_number": 1,
                "result": {
                    "pass_rate": pass_rate,
                    "passed": passed,
                    "failed": total - passed,
                    "total": total,
                    "time_seconds": time_seconds,
                    "tokens": 0,
                    "tool_calls": 0,
                    "errors": 0,
                },
                "expectations": expectations,
                "notes": [],
            }
            all_runs.append(run)

            if config not in config_pass_rates:
                config_pass_rates[config] = []
                config_times[config] = []
            config_pass_rates[config].append(pass_rate)
            config_times[config].append(time_seconds)

    # Calcular run_summary
    run_summary = {}
    for config in config_pass_rates:
        run_summary[config] = {
            "pass_rate": calc_stats(config_pass_rates[config]),
            "time_seconds": calc_stats(config_times[config]),
            "tokens": calc_stats([0.0] * len(config_pass_rates[config])),
        }

    # Delta with_skill vs without_skill
    ws_rate = run_summary.get("with_skill", {}).get("pass_rate", {}).get("mean", 0)
    wos_rate = run_summary.get("without_skill", {}).get("pass_rate", {}).get("mean", 0)
    ws_time = run_summary.get("with_skill", {}).get("time_seconds", {}).get("mean", 0)
    wos_time = (
        run_summary.get("without_skill", {}).get("time_seconds", {}).get("mean", 0)
    )
    run_summary["delta"] = {
        "pass_rate": f"{ws_rate - wos_rate:+.2f}",
        "time_seconds": f"{ws_time - wos_time:+.1f}",
        "tokens": "+0",
    }

    benchmark = {
        "metadata": {
            "skill_name": "next-backend-architect",
            "skill_path": "./skill/",
            "executor_model": "claude-sonnet-4-6",
            "analyzer_model": "claude-sonnet-4-6",
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "evals_run": sorted(set(r["eval_id"] for r in all_runs)),
            "runs_per_configuration": 1,
        },
        "runs": all_runs,
        "run_summary": run_summary,
        "notes": [
            "Eval 1: entidad simple Prisma (Product) — baseline de estructura",
            "Eval 2: entidad con relaciones Prisma (Order) — verifica include/select y enums",
            "Eval 3: entidad Drizzle (Product) — verifica que no se contamina con sintaxis Prisma",
            f"Delta pass_rate with_skill vs without_skill: {run_summary['delta']['pass_rate']}",
        ],
    }

    # Guardar benchmark.json
    benchmark_path = reports_dir / "benchmark.json"
    benchmark_path.write_text(json.dumps(benchmark, indent=2), encoding="utf-8")
    print(f"\n✓ Generado: {benchmark_path}")

    # Generar benchmark.md legible
    md_lines = [
        "# Benchmark: next-backend-architect",
        "",
        f"**Fecha:** {benchmark['metadata']['timestamp']}",
        f"**Evals:** {', '.join(str(e) for e in benchmark['metadata']['evals_run'])}",
        "",
        "## Resumen",
        "",
        "| Métrica | With Skill | Without Skill | Delta |",
        "|---------|-----------|---------------|-------|",
    ]

    ws = run_summary.get("with_skill", {})
    wos = run_summary.get("without_skill", {})
    delta = run_summary.get("delta", {})

    ws_pr = ws.get("pass_rate", {})
    wos_pr = wos.get("pass_rate", {})
    md_lines.append(
        f"| Pass Rate | {ws_pr.get('mean', 0) * 100:.0f}% ± {ws_pr.get('stddev', 0) * 100:.0f}% "
        f"| {wos_pr.get('mean', 0) * 100:.0f}% ± {wos_pr.get('stddev', 0) * 100:.0f}% "
        f"| {delta.get('pass_rate', '—')} |"
    )

    md_lines += ["", "## Detalle por eval", ""]
    for run in all_runs:
        md_lines.append(
            f"- **{run['eval_name']}** [{run['configuration']}]: "
            f"{run['result']['passed']}/{run['result']['total']} "
            f"({run['result']['pass_rate']:.0%})"
        )

    md_path = reports_dir / "benchmark.md"
    md_path.write_text("\n".join(md_lines), encoding="utf-8")
    print(f"✓ Generado: {md_path}")

    # Imprimir resumen
    print("\n" + "=" * 50)
    print(f" With Skill:    {ws_pr.get('mean', 0) * 100:.0f}% pass rate")
    print(f" Without Skill: {wos_pr.get('mean', 0) * 100:.0f}% pass rate")
    print(f" Delta:         {delta.get('pass_rate', '—')}")
    print("=" * 50)


if __name__ == "__main__":
    main()

#!/bin/bash
# run_evals.sh
# Uso: ./run_evals.sh <skill_path> <entity> <fixture_path>
# Ejemplo: ./run_evals.sh ./skill product ./fixtures/prisma-simple.prisma

SKILL_PATH=$1
ENTITY=$2
FIXTURE_PATH=$3
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
WORKSPACE="./workspace/eval-${ENTITY}-${TIMESTAMP}"

mkdir -p "$WORKSPACE/with_skill/outputs"
mkdir -p "$WORKSPACE/without_skill/outputs"

echo "================================================"
echo " EVAL: $ENTITY | $(date)"
echo "================================================"

# PASO 1: Ejecutar el skill
echo ""
echo "[ PASO 1 ] Ejecutando skill en with_skill/outputs/..."
echo "  → Invocar Claude con el skill $SKILL_PATH y el fixture $FIXTURE_PATH"
echo "  → El output debe ir a $WORKSPACE/with_skill/outputs/"
echo "  (Ejecuta el agente manualmente y coloca los outputs en la carpeta)"
read -p "  Presiona ENTER cuando los outputs estén listos..."

# PASO 2: Ejecutar sin skill (baseline)
echo ""
echo "[ PASO 2 ] Ejecutando sin skill en without_skill/outputs/..."
echo "  → Invocar Claude SIN el skill con el mismo fixture"
echo "  → El output debe ir a $WORKSPACE/without_skill/outputs/"
read -p "  Presiona ENTER cuando los outputs estén listos..."

# PASO 3: Validar estructura
echo ""
echo "[ PASO 3 ] Validando estructura de archivos..."
echo "--- WITH SKILL ---"
bash ./validators/check_structure.sh "$WORKSPACE/with_skill/outputs" "$ENTITY"
echo "--- WITHOUT SKILL ---"
bash ./validators/check_structure.sh "$WORKSPACE/without_skill/outputs" "$ENTITY"

# PASO 4: Validar contenido
echo ""
echo "[ PASO 4 ] Validando patrones de contenido..."
echo "--- WITH SKILL ---"
python3 ./validators/check_content.py \
  "$WORKSPACE/with_skill/outputs" "$ENTITY" "./skill/templates"
echo "--- WITHOUT SKILL ---"
python3 ./validators/check_content.py \
  "$WORKSPACE/without_skill/outputs" "$ENTITY" "./skill/templates"

# PASO 5: Compilación TypeScript
echo ""
echo "[ PASO 5 ] Verificando compilación TypeScript..."
echo "--- WITH SKILL ---"
bash ./validators/check_compilation.sh "$WORKSPACE/with_skill/outputs"
echo "--- WITHOUT SKILL ---"
bash ./validators/check_compilation.sh "$WORKSPACE/without_skill/outputs"

# PASO 6: Generar reporte comparativo
echo ""
echo "[ PASO 6 ] Generando reporte comparativo..."
python3 ./validators/generate_report.py "$WORKSPACE" "$ENTITY"

echo ""
echo "================================================"
echo " Reporte en: $WORKSPACE/report.json"
echo "================================================"

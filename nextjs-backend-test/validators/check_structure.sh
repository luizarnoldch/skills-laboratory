#!/bin/bash
# check_structure.sh <outputs_dir> <entity> <transport>
# Verifica que existan todos los archivos requeridos para la entidad
#
# Uso:
#   bash validators/check_structure.sh workspace/eval-1/with_skill/outputs product trpc
#   bash validators/check_structure.sh workspace/eval-1/with_skill/outputs order trpc
#   bash validators/check_structure.sh workspace/eval-3-drizzle/with_skill/outputs product trpc
#
# Salida: PASS/FAIL por cada archivo + JSON en <outputs_dir>/structure_result.json

set -euo pipefail

OUTPUTS_DIR="${1:?Usage: $0 <outputs_dir> <entity> [transport]}"
ENTITY="${2:?Entity name required (lowercase, e.g. product)}"
TRANSPORT="${3:-trpc}"

# Derivar variantes del nombre
ENTITY_LOWER=$(echo "$ENTITY" | tr '[:upper:]' '[:lower:]')
ENTITY_PASCAL=$(echo "$ENTITY_LOWER" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')

FEATURES_DIR="$OUTPUTS_DIR/src/features/$ENTITY_LOWER"

PASS=0
FAIL=0
RESULTS="[]"

check_file() {
  local rel_path="$1"
  local description="$2"
  local full_path="$FEATURES_DIR/$rel_path"

  if [ -f "$full_path" ]; then
    echo "  ✓ PASS: $rel_path"
    PASS=$((PASS + 1))
    RESULTS=$(echo "$RESULTS" | python3 -c "
import json, sys
results = json.load(sys.stdin)
results.append({'file': '$rel_path', 'description': '$description', 'passed': True})
print(json.dumps(results))
")
  else
    echo "  ✗ FAIL: $rel_path — no encontrado en $full_path"
    FAIL=$((FAIL + 1))
    RESULTS=$(echo "$RESULTS" | python3 -c "
import json, sys
results = json.load(sys.stdin)
results.append({'file': '$rel_path', 'description': '$description', 'passed': False})
print(json.dumps(results))
")
  fi
}

check_dir_has_files() {
  local rel_dir="$1"
  local description="$2"
  local full_dir="$FEATURES_DIR/$rel_dir"

  if [ -d "$full_dir" ] && [ -n "$(ls -A "$full_dir" 2>/dev/null)" ]; then
    local count
    count=$(ls -A "$full_dir" | wc -l | tr -d ' ')
    echo "  ✓ PASS: $rel_dir/ ($count archivo/s)"
    PASS=$((PASS + 1))
    RESULTS=$(echo "$RESULTS" | python3 -c "
import json, sys
results = json.load(sys.stdin)
results.append({'file': '$rel_dir/', 'description': '$description', 'passed': True})
print(json.dumps(results))
")
  else
    echo "  ✗ FAIL: $rel_dir/ — carpeta vacía o no existe"
    FAIL=$((FAIL + 1))
    RESULTS=$(echo "$RESULTS" | python3 -c "
import json, sys
results = json.load(sys.stdin)
results.append({'file': '$rel_dir/', 'description': '$description', 'passed': False})
print(json.dumps(results))
")
  fi
}

echo "================================================================"
echo " Verificando estructura: $ENTITY_PASCAL | transport: $TRANSPORT"
echo " Directorio: $FEATURES_DIR"
echo "================================================================"

# Schema — siempre requerido
check_file "schemas/${ENTITY_LOWER}.schema.ts" "Zod schema"

# Server layer
check_file "server/${ENTITY_LOWER}.repository.ts" "Repository (data access)"
check_file "server/${ENTITY_LOWER}.service.ts" "Service (business logic)"

if [ "$TRANSPORT" = "trpc" ]; then
  check_file "server/${ENTITY_LOWER}.router.ts" "tRPC router"
elif [ "$TRANSPORT" = "api" ]; then
  check_file "server/${ENTITY_LOWER}.api.ts" "REST API handler"
fi

# Hooks — al menos un archivo en la carpeta
check_dir_has_files "hooks" "TanStack Query/Form hooks"

echo ""
echo "Resultado: $PASS passed, $FAIL failed"
echo ""

# Guardar resultado JSON
python3 - << PYEOF
import json

summary = {
    "entity": "$ENTITY_LOWER",
    "transport": "$TRANSPORT",
    "outputs_dir": "$OUTPUTS_DIR",
    "structure_pass": $PASS,
    "structure_fail": $FAIL,
    "structure_total": $((PASS + FAIL)),
    "structure_pass_rate": round($PASS / $((PASS + FAIL)), 4) if $((PASS + FAIL)) > 0 else 0.0,
    "files": $RESULTS
}

out_path = "$OUTPUTS_DIR/structure_result.json"
with open(out_path, "w") as f:
    json.dump(summary, f, indent=2)
print(f"Resultado guardado en: {out_path}")
PYEOF

exit $FAIL

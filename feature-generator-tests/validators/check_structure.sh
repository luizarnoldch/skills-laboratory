#!/bin/bash
# check_structure.sh <output_dir> <entity>
# Verifica que existan todos los archivos requeridos
# Salida: PASS/FAIL por cada archivo + resumen

OUTPUT_DIR=$1
ENTITY=$2   # ej: "product" o "order"

PASS=0
FAIL=0

check_file() {
  local path="$OUTPUT_DIR/features/$ENTITY/$1"
  if [ -f "$path" ]; then
    echo "  ✓ PASS: $1"
    PASS=$((PASS + 1))
  else
    echo "  ✗ FAIL: $1 — no encontrado en $path"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Verificando estructura para: $ENTITY ==="
check_file "schemas/${ENTITY}.schema.ts"
check_file "server/${ENTITY}.repository.ts"
check_file "server/${ENTITY}.service.ts"
check_file "server/${ENTITY}.router.ts"

# Verificar que hooks/ tenga al menos un archivo
HOOKS_DIR="$OUTPUT_DIR/features/$ENTITY/hooks"
if [ -d "$HOOKS_DIR" ] && [ "$(ls -A $HOOKS_DIR 2>/dev/null)" ]; then
  echo "  ✓ PASS: hooks/ (contiene archivos)"
  PASS=$((PASS + 1))
else
  echo "  ✗ FAIL: hooks/ — carpeta vacía o no existe"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "Resultado estructura: $PASS passed, $FAIL failed"
echo "{\"structure_pass\": $PASS, \"structure_fail\": $FAIL}" > "$OUTPUT_DIR/structure_result.json"
exit $FAIL

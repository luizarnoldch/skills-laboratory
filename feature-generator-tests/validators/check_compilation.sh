#!/bin/bash
# check_compilation.sh <output_dir>
# Crea un tsconfig mínimo y compila para detectar errores de tipos

OUTPUT_DIR=$1
FEATURES_DIR="$OUTPUT_DIR/features"

cat > "$OUTPUT_DIR/tsconfig.test.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "paths": {
      "@/server/db": ["./stubs/db.ts"],
      "@trpc/server": ["./stubs/trpc.ts"]
    }
  },
  "include": ["features/**/*.ts", "stubs/**/*.ts"]
}
EOF

mkdir -p "$OUTPUT_DIR/stubs"

cat > "$OUTPUT_DIR/stubs/db.ts" << 'EOF'
export const db: any = {}
export const prisma: any = {}
EOF

cat > "$OUTPUT_DIR/stubs/trpc.ts" << 'EOF'
export const createTRPCRouter: any = () => ({})
export const publicProcedure: any = { input: () => ({query: () => ({}), mutation: () => ({})}) }
export const protectedProcedure: any = publicProcedure
EOF

cd "$OUTPUT_DIR"
if [ ! -d "node_modules" ]; then
  npm init -y > /dev/null 2>&1
  npm install --save-dev typescript zod @tanstack/react-query > /dev/null 2>&1
fi

TSC_OUTPUT=$(npx tsc --project tsconfig.test.json 2>&1)
TSC_EXIT=$?

if [ $TSC_EXIT -eq 0 ]; then
  echo "  ✓ PASS: Compilación TypeScript sin errores"
  echo '{"compilation_pass": true, "errors": []}' > "$OUTPUT_DIR/compilation_result.json"
else
  ERROR_COUNT=$(echo "$TSC_OUTPUT" | grep -c "error TS")
  echo "  ✗ FAIL: $ERROR_COUNT errores de TypeScript"
  echo "$TSC_OUTPUT"

  python3 - << PYEOF
import json, sys

output = """$TSC_OUTPUT"""
errors = [line.strip() for line in output.split('\n') if 'error TS' in line]
result = {
    "compilation_pass": False,
    "error_count": len(errors),
    "errors": errors[:20]
}
with open("$OUTPUT_DIR/compilation_result.json", "w") as f:
    json.dump(result, f, indent=2)
PYEOF
fi

exit $TSC_EXIT

# feature-generator-tests

Evaluación del skill `next-backend-architect` en Claude Code.

---

## Estructura

```
feature-generator-tests/
├── skill/SKILL.md              ← Copia del skill (pega aquí tu SKILL.md real)
├── fixtures/                   ← Inputs de prueba (schemas Prisma/Drizzle)
├── evals/evals.json            ← Definición de casos de prueba
├── workspace/                  ← Outputs generados por el agente
│   ├── eval-1-simple-entity/
│   │   ├── with_skill/outputs/ ← Output del agente CON skill
│   │   └── without_skill/outputs/ ← Output del agente SIN skill
│   ├── eval-2-relations/
│   └── eval-3-drizzle/
├── validators/                 ← Scripts de validación
└── reports/benchmark.json      ← Resultado final agregado
```

---

## Antes de empezar

### 1. Copiar tu skill real

```bash
# Desde la raíz del sistema operativo (donde tienes tu skill instalado)
cp -r /ruta/a/tu/next-backend-architect/* feature-generator-tests/skill/
```

Si solo tienes el `SKILL.md`, pégalo en `skill/SKILL.md`. Los templates van en `skill/templates/` y los scripts en `skill/scripts/`.

### 2. Requisitos

```bash
node --version    # >= 18
tsc --version     # TypeScript disponible globalmente
python3 --version # >= 3.10
```

---

## ¿Con skill o sin skill? — Cuándo correr cada uno

La evaluación `with_skill` y `without_skill` sirven para **medir el delta** — cuánto aporta el skill vs el conocimiento nativo del agente. Esto responde la pregunta: ¿el agente realmente necesita el skill o ya sabe hacerlo bien solo?

**Regla práctica:**
- Si ya mejoraste el skill y confías en él, puedes **saltarte el without_skill** en las primeras iteraciones de debugging — solo corre `with_skill`.
- Corre `without_skill` cuando quieras **medir el valor real** del skill (antes del benchmark final, o cada vez que dudes de si el skill aporta algo).

---

## Cómo correr cada eval

### Eval 1 — Entidad simple Prisma (Product)

#### Con skill

Abre Claude Code apuntando a este directorio. Primer mensaje:

```
Lee fixtures/prisma-simple.prisma y genera el feature completo para
la entidad Product. Usa el skill next-backend-architect.
El output debe quedar en workspace/eval-1-simple-entity/with_skill/outputs/
```

Observa el transcript: ¿Claude leyó el SKILL.md? ¿Ejecutó ./scripts/main.sh?

#### Sin skill

Nueva sesión de Claude Code, sin el skill cargado:

```
Lee fixtures/prisma-simple.prisma y genera el feature completo para
la entidad Product con tRPC y Prisma. Estructura:
  src/features/product/schemas/product.schema.ts (Zod)
  src/features/product/server/product.repository.ts (Prisma)
  src/features/product/server/product.service.ts
  src/features/product/server/product.router.ts (tRPC)
  src/features/product/hooks/ (TanStack Query)
El output debe quedar en workspace/eval-1-simple-entity/without_skill/outputs/
```

#### Validar Eval 1

```bash
cd feature-generator-tests

# Estructura
bash validators/check_structure.sh \
  workspace/eval-1-simple-entity/with_skill/outputs product trpc

# Contenido y patrones
python3 validators/check_content.py \
  workspace/eval-1-simple-entity/with_skill/outputs product ./skill/templates prisma trpc

# Compilación TypeScript
bash validators/check_compilation.sh \
  workspace/eval-1-simple-entity/with_skill/outputs product

# Repetir para without_skill
bash validators/check_structure.sh \
  workspace/eval-1-simple-entity/without_skill/outputs product trpc
python3 validators/check_content.py \
  workspace/eval-1-simple-entity/without_skill/outputs product ./skill/templates prisma trpc
bash validators/check_compilation.sh \
  workspace/eval-1-simple-entity/without_skill/outputs product
```

---

### Eval 2 — Entidad con relaciones Prisma (Order)

#### Con skill

```
Lee fixtures/prisma-relations.prisma y genera el feature completo para
la entidad Order. Order tiene FK hacia User y relación 1:N con OrderItem.
El output debe quedar en workspace/eval-2-relations/with_skill/outputs/
```

#### Checks adicionales para Eval 2

```bash
# ¿El repository maneja relaciones?
grep -n "include\|select" \
  workspace/eval-2-relations/with_skill/outputs/src/features/order/server/order.repository.ts

# ¿El schema define el enum con Zod?
grep -n "z.enum\|z.nativeEnum\|OrderStatus" \
  workspace/eval-2-relations/with_skill/outputs/src/features/order/schemas/order.schema.ts

# ¿El service NO llama a prisma directamente? (debe retornar vacío)
grep -n "prisma\." \
  workspace/eval-2-relations/with_skill/outputs/src/features/order/server/order.service.ts
```

---

### Eval 3 — Entidad Drizzle (Product)

#### Con skill

```
Lee fixtures/drizzle-simple.ts y genera el feature completo para
Product usando Drizzle como ORM y tRPC como transport.
El output debe quedar en workspace/eval-3-drizzle/with_skill/outputs/
```

#### Checks adicionales para Eval 3

```bash
# ¿Usa sintaxis Drizzle? (debe encontrar matches)
grep -n "db\.select\|db\.insert\|db\.update\|db\.delete" \
  workspace/eval-3-drizzle/with_skill/outputs/src/features/product/server/product.repository.ts

# ¿Contamina con Prisma? (debe retornar VACÍO)
grep -n "prisma\.\|\.findMany\|\.findUnique\|\.create(" \
  workspace/eval-3-drizzle/with_skill/outputs/src/features/product/server/product.repository.ts
```

---

## Generar el reporte final

Después de correr las 3 evals (o las que hayas completado):

```bash
cd feature-generator-tests
python3 validators/aggregate_reports.py
```

Genera `reports/benchmark.json` y `reports/benchmark.md`.

---

## Interpretar resultados

### Si el agente no leyó el SKILL.md
→ Problema de triggering. Reescribir la `description` en el frontmatter del skill.

### Si leyó el skill pero escribió archivos a mano (sin CLI)
→ Agregar al skill: *"Ejecuta siempre ./scripts/main.sh — no escribas estos archivos directamente."*

### Si usó el CLI pero Eval 3 mezcló Prisma con Drizzle
→ El skill no instrucción sobre detección de ORM. Agregar sección específica.

### Si la compilación falla con "Cannot find module"
→ El stub no cubre ese módulo. Agregar stub en `workspace/eval-N/*/outputs/stubs/`.

### Si la compilación falla con "Type X is not assignable"
→ Error en los templates del skill, no en el agente.

### Si with_skill y without_skill tienen el mismo pass rate
→ El skill no está aportando valor diferencial. Revisar si el agente lo está leyendo.

---

## Ciclo de iteración

```
1. Correr Eval 1 with_skill
2. Revisar transcript — ¿leyó SKILL.md? ¿usó CLI?
3. Correr validators
4. Identificar qué falla
5. Ajustar UNA sola cosa en el skill
6. Repetir Eval 1
7. Cuando Eval 1 pasa ≥ 90% → pasar a Eval 2
8. Cuando Eval 2 pasa → Eval 3
9. Correr without_skill en todas → generar benchmark final
```

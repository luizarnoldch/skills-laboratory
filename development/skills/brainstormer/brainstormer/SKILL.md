---
name: brainstormer
description: 'Generate structured idea cards for software projects. Use when user wants to brainstorm new features, explore AI/automation, find monetization angles, improve UX, or discover third-party integrations. Trigger phrases: "brainstorm", "ideas for", "new features", "what could I add", "monetize", "AI features".'
compatibility: opencode
metadata:
  domain: project-management
---

# Brainstormer

Generate structured idea cards. Default: wild, creative. Output always structured.

---

## 1. Gather Context

Ask in single message. Extract what user already gave. Don't re-ask.

| Field               | Required | Default            |
| ------------------- | -------- | ------------------ |
| Project description | Yes      | —                  |
| Platform            | Yes      | Web                |
| Tech stack          | Yes      | Ask                |
| Current features    | No       | Start from scratch |
| Idea categories     | No       | All 5              |
| Number of ideas     | No       | 15                 |
| Creativity level    | No       | Wild               |

Categories:

- New features / modules
- UX / UI improvements
- AI / automation
- Third-party integrations
- Monetization

---

## 2. Generate Cards

N ideas total. Split in two sections.

### Top 3 — Full cards

```markdown
### 💡 [TITLE]

**Category:** [New feature / UX / AI / Integration / Monetization]
**Platform:** [Web / Mobile / Both]

**Description:**
2-3 sentences. What and why for this specific project.

**How it works:**
1-2 sentences. Reference user's stack.

**Effort:** [Low / Medium / High]
**Impact:** [Low / Medium / High]
**Creativity:** [Safe / Bold / Wild]
```

### Remaining — Compact list

```text
4. [Title] — [category]
5. [Title] — [category]
...
```

User says "expand idea 7" → generate full card.

---

## 3. Creativity Levels

| Level        | Behavior                               |
| ------------ | -------------------------------------- |
| Conservative | Proven patterns, low risk, incremental |
| Balanced     | Mix safe + bold                        |
| Wild         | Disruptive, 30%+ surprising ideas      |

Default: **Wild**.

---

## 4. Scoring

**Effort:**

- Low = days
- Medium = 1-3 weeks
- High = 1+ month or architecture change

**Impact:**

- Low = nice to have
- Medium = meaningful retention/revenue/UX gain
- High = core differentiator, major growth lever

---

## 5. Top Picks

After all cards, output:

```text
## Top 3 Picks

1. [Title] — why best starting point
2. [Title] — reason
3. [Title] — reason
```

---

## Rules

- Always ask stack. Ideas reference real libraries/APIs.
- No existing features → start from scratch.
- Existing features given → complement, extend, or disrupt them.
- Spread across all categories unless user restricts.
- Tailor every card to project. No generic filler.
- Platform-aware: web → PWA, SSR, browser APIs. Mobile → gestures, push, offline.

---

## Gotchas

- Don't suggest ideas that need features user hasn't built yet — unless
  explicitly wild/blue-sky mode.
- If user says "expand idea N" but you trimmed context,
  re-read your own output to recall title.
- Category emojis: 🆕 features, 🎨 UX, 🤖 AI, 🔗 integrations, 💰 monetization.

# Hermes Handoff — MPower Report Template (PowerPoint Build)

**To:** Hermes (build agent) · **From:** Laura · **Date:** 2026-06-23
**Task:** Build the MPower report template as a PowerPoint template (Slide Master + Layouts). This document is self-contained — all colors, fonts, rules and layouts are here.

> **Language note:** Instructions are in English. **Slide-facing text stays German** (the template is German — e.g. titles, breadcrumb/eyebrow examples, "Maßnahmen", the "mpower" logo). Keep all German strings exactly as written. PowerPoint menu paths are given for the English UI; they may differ on a German or macOS build.

---

## 0 · Most important first: the editability model

Every element on a slide belongs to **one of three tiers**. This is the core of the template — it decides where the element is built and whether the user can touch it.

| Tier | Meaning | Built in | User can… |
|---|---|---|---|
| **FIXED** | unchangeable brand constant | Slide **Master** | nothing — not clickable on the slide |
| **AUTO** | filled automatically | Master / auto field | nothing — system maintains it |
| **EDIT** | filled per slide | **Placeholder** in the layout | enter content only; position stays fixed |

**Golden rule for the build:** anything EDIT → always a **placeholder** (title / text / picture placeholder), NEVER a free text box. Free text boxes are exactly the error source this template is meant to eliminate. Anything FIXED → put it in the Master so it is not clickable on the slide.

### Element inventory with tier
| Element | Tier | Detail |
|---|---|---|
| mpower logo | **FIXED** | Master, top-left |
| Footer line | **FIXED** | Master, one thin line (no box outline) |
| Copyright | **FIXED** | Master, right-aligned |
| Background | **FIXED** | Master, white (report template) |
| Page number | **AUTO** | automatic slide number, far right |
| Breadcrumb (chapter path) | **EDIT** | header, see §4 |
| Eyebrow (number + name) | **EDIT** | header, ALL CAPS, see §4 |
| Title / Key thesis (Kernthese) | **EDIT** | slide title, color per layout (§6) |
| Body / chart / table | **EDIT** | content placeholder |
| Source (Quelle) | **EDIT** | footer left, full width |
| Initials (Kürzel — author/editor, e.g. "MD") | **EDIT** | footer, short text field |
| Date (cover + footer) | **EDIT · format-locked** | typed manually; format **enforced** (NOT auto-updating). Cover = DD.MM.YYYY; footer = own field (see §5) |
| Client logo (cover only) | **EDIT · optional** | picture placeholder at bottom; leave empty if none |

---

## 1 · Theme colors (create first)

Create a theme named "MPower" with exactly this mapping. Order matters: Accent 1 is the default color for shapes / SmartArt / first chart series.

| Theme slot | Hex | Meaning |
|---|---|---|
| Text/Background – Dark 1 | `#002B41` | Navy Dark = default text color |
| Text/Background – Light 1 | `#FFFFFF` | White |
| Text/Background – Dark 2 | `#043469` | Navy |
| Text/Background – Light 2 | `#E5E7EB` | Border Light (light fills / tables) |
| Accent 1 | `#4A6577` | Steel Blue (primary blue) |
| Accent 2 | `#8AB4CD` | Muted Blue |
| Accent 3 | `#324A5C` | Blue-1 (darkest) |
| Accent 4 | `#6A8CA2` | Blue-3 |
| Accent 5 | `#B1CCDE` | Blue-5 |
| Accent 6 | `#F7602F` | **Orange** |
| Hyperlink | `#043469` | Navy |
| Followed Hyperlink | `#4A6577` | Steel Blue |

**Why Orange on Accent 6, not Accent 1:** Orange must never appear automatically (anti-inflation rule). Accent 1–5 = blue ramp → charts come out monochrome-blue by default. Orange is chosen **deliberately** as a highlight. The lightest Blue-6 `#D8E5EE` is dropped (only 5 blue slots) → add as a custom color if needed.

### On-color rule (text on color fills)
- White on Navy `#043469` and Navy Dark `#002B41`: always fine.
- On Muted Blue `#8AB4CD`: always Navy Dark, **never white**.
- Orange `#F7602F`: only as large/bold text; avoid body text on orange.

---

## 2 · Typography

- **Headings/Titles: Aptos Display** (Office default heading cut, finer rendering — replaces the earlier SemiBold).
- **Body: Aptos** (Regular).
- **Eyebrow:** Aptos Regular, **ALL CAPS**, character spacing **"Expanded by 4.5 pt"** (= 50% tracking at 9 pt), color Navy `#043469`.
- **Breadcrumb:** Aptos Regular, small, Muted `#6B7280`.
- **Bullets:** level 1 Orange `#F7602F`, sub-levels Grey `#6B7280`.
- **Quotes (exception, rare):** Montserrat Italic. Practically never in the report template — default is Aptos only.
- **Important:** embed Aptos in the file when saving (`File → Options → Save → Embed fonts in the file`), otherwise substitution on other machines.

> Status: Aptos Display is the current direction; final print / projector test still pending. If too light there → test one step heavier.

---

## 3 · Slide Master

Into the Master (then not clickable on slides = FIXED):
- **mpower logo** top-left.
- **Footer line** (one thin line, no outline — strokes/shadows are banned across the template).
- **Copyright** text, right-aligned.
- **Background** white.
- **Page number** as automatic slide number (AUTO), far right, margin ~0.6" / 86 px.

---

## 4 · Header — breadcrumb + eyebrow (two separate EDIT placeholders)

- **Breadcrumb** = path of **ancestor names**, WITHOUT numbers (like a web breadcrumb); grows by one segment per level (separator " › ").
- **Eyebrow** = ALWAYS full number + current name, ALL CAPS.
- Only the **name** is duplicated; the **number never** — it lives only in the eyebrow.

| Level | Breadcrumb | Eyebrow |
|---|---|---|
| 1 (chapter) | Markt und Wettbewerb | 5 · MARKT UND WETTBEWERB |
| 2 (subchapter) | Markt und Wettbewerb | 5.1 · WETTBEWERBSUMFELD |
| 3 (sub-sub) | Markt und Wettbewerb › Wettbewerbsumfeld | 5.1.1 · MARKTANTEILE |

One breadcrumb placeholder that carries multiple segments. Fallback when tight: show only the direct parent segment instead of the full path. (The breadcrumb does NOT switch automatically per chapter — it stays the user's manual job; that is a PowerPoint limitation, not a bug. Do not build a VBA workaround.)

---

## 5 · Footer

**Five SEPARATE fields, order left→right** (each is its own placeholder, NOT one combined string):
- **Source (Quelle)** [EDIT] — far left, full remaining width.
- **Copyright** [FIXED] — brand constant (e.g. "MPower GmbH").
- **Date (Datum)** [EDIT] — manual, defined format.
- **Initials (Kürzel)** [EDIT] — author initials, e.g. "LC".
- **Page number** [AUTO] — far right.

> ⚠️ In Figma, Copyright/Date/Initials currently sit as ONE string "MPower GmbH · Juni 2026 · LC" → split into the separate fields above (manual, Aptos). Verify exact positions against the Figma reference.

---

## 6 · Layout set

> **Authoritative layout list = the 38 Figma frames on page 53:16** (full table in `Hermes-Uebergabe-Index.md`). Build every frame as a PPT layout from its Figma prototype + these rules. The set below covers the key rule-bearing layouts, not all 38.

Per layout: placeholders + title treatment. **Content-slide title = Kernthese in Orange** (the most important element). **Structural / special slides = Navy title** (no thesis).

### A · Structure (Navy title, no Kernthese)
| Layout | Placeholders | Title | Note |
|---|---|---|---|
| **Cover** | Title (vertically **bottom-aligned**, grows upward, max 3 lines, left-aligned), Subtitle ~20 pt, Date [EDIT·format-locked], Client logo [EDIT·optional] | see below | ONE cover for all title lengths — the title placeholder is bottom-aligned, so 1/2/3-line titles fill upward from the same baseline (NO separate short/long versions). High-contrast background; constrain text box so no word runs into the white "M"; no location |
| **Table of contents – comfortable (Inhaltsverzeichnis)** | auto list Number/Title/Page, 20 px | Navy | up to ~12 chapters; chapters + page number only |
| **Table of contents – compact** | as above, 16 px | Navy | 13–20 chapters; same structure, tighter |
| **Chapter divider (Trennblatt)** | chapter number (Orange), chapter name, level-2 list + indented level-3 (smaller) with page numbers, only where children exist | Navy | the only place for a chapter's sub-page-numbers; on overflow go 2-column, very deep chapter may take 2 pages |
| **Closing / back page** | contact / closing | Navy | |

Cover title: left-aligned, Navy or White depending on background brightness (respect on-color rule). Subtitle ~20 pt.

### B · Content slides (Kernthese title in Orange)
| Layout | Placeholders |
|---|---|
| **Kernthese + chart** | breadcrumb, eyebrow, Kernthese, 1 chart area, source — the workhorse |
| **Kernthese + text** | + text/bullet placeholder instead of chart (L1 bullets Orange, sub grey) |
| **Kernthese + 2 charts** | 2 chart areas side by side |
| **Data highlight (KPI)** | large figure + label + context |
| **Insight / conclusion band** | dark band (Navy/Navy Dark), title **White** (Orange on Navy is unreadable) |

### C · Special / no thesis (details in §7)
| Layout | Placeholders | Title |
|---|---|---|
| **Photo + text** | image zone left ~40%, text zone right ~60%, heading | see §7 |
| **Measures (Maßnahmen)** | title "Maßnahmen", 4-column table | Navy, NO thesis |
| **Measures (continued)** | as above, header row repeated | Navy |

---

## 7 · Special layouts in detail

### Measures plan (Maßnahmenplan)
- **NO Kernthese.** Title "Maßnahmen" in Navy.
- 4 columns: **Nr.** (5%) · **Maßnahme** = main point bold + detail line Muted (55%) · **Termin** (16%) · **Verantwortlich** (24%).
- Area grouping (e.g. Vertrieb/Produktion) = full-width **band row**, background Muted Blue `#8AB4CD` + Navy Dark text; omit if not grouped by area.
- Header row: background Navy Dark `#002B41`, white text, repeated on every continuation slide.
- Data rows: white, 1 px Border-Light separators, **no** vertical lines, **no orange**.
- Up to ~24 measures across up to 3 slides (~8 rows/slide).

### Photo + text (one fixed variant, no choice)
- **Image(s) left, text right. Always. No mirroring.** Heading always present.
- Image zone left ~40%: **one** image OR **two** stacked vertically (small gap). Images small–medium, never full-bleed.
- **Picture placeholder** (replace only), no frames/shadows, separation via whitespace. Optional caption Aptos 9 pt Muted.
- Text zone right ~60%: heading + body text/bullets.

---

## 8 · Charts / Schaubilder — how they relate to layouts

**Key model: charts are NOT pre-built into the template. The layout ships an EMPTY content placeholder; the user inserts the actual chart/diagram into it later.** Do not hardcode specific charts into the layouts.

- The "Kernthese + chart" layout (and "+ 2 charts") contains an empty **content placeholder** (a PowerPoint content/chart placeholder) sized and positioned for the chart. The consultant drops their chart/Schaubild in there per slide — the template stays generic.
- Whatever chart is inserted **inherits the theme automatically** (blue ramp on accents 1–5). The highlight series is set manually to Accent 6 (Orange).
- Excel-pasted and 1:1-copied client charts keep their own colors — tolerated exception, do not rebuild them.
- There is **one** chart layout for all chart slides — no per-chart layouts.

**Phasing (decided):** Phase 1 = build all master layouts (this document). **Phase 2, separate, AFTER the layouts** = rebuild MPower's own ~70–100 bespoke Schaubilder **natively** (charts / SmartArt / grouped shapes — NOT as images), in **batches**. Start with charts + simple shape diagrams (AI handles these well); flag complex bespoke diagrams for human review. Standard PowerPoint chart types need no rebuild — the theme styles them.

---

## 9 · Build order
1. Theme (§1) + typography (§2).
2. Master (§3) incl. automatic page number.
3. Header block breadcrumb + eyebrow (§4), footer (§5).
4. Kernthese + chart (workhorse) → derive the variants.
5. Cover short/long, table of contents, chapter divider.
6. Special layouts photo / measures.

## 10 · Pitfalls
- EDIT always as a placeholder, never a free text box.
- Embed Aptos in the file.
- Recompute eyebrow tracking if size differs from 9 pt (50%).
- Do NOT build the date as an auto-updating field — manual, format enforced.
- Breadcrumb/source/initials = the manual-entry spots; build as clean, clearly labeled placeholders.

## 11 · Open (before final lock)
- Aptos Display final print / projector test.
- Location on cover (Moritz) — currently omitted.
- Measures + photo layouts: wait for real samples from Katja, then freeze.

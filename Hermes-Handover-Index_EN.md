# Hermes Handover — Package Index

**Date:** 2026-06-23 · **Figma file:** MPower-Rebranding (`YpIG9RLDlReNrMeUxjGI11`)
This document bundles everything for the handover to Hermes and points to the parts.

> Language note: instructions in English; layout/element names stay German because they are the actual Figma node names Hermes must match.

Phase 1 = build all master layouts in PowerPoint. Phase 2 = charts/Schaubilder native, in batches (see brief §8).

---

## 1 · What Hermes reads (rules)
- **`Hermes-Handoff_MPower-Report-Template_PPT_EN.md`** — the actual build brief (self-contained): editability model, theme colors, typography, header/footer, layout rules, Maßnahmen/photo detail, chart model, phasing. **This is the authoritative rules source.**
- This index = layout inventory + coordinates + assets + process.

---

## 2 · What YOU provide (from environment / Figma)

### Fonts (critical)
- **Aptos Display** (headings) + **Aptos Regular** (body) must be installed in Hermes' build environment and **embedded** in the PPTX (`File → Options → Save → Embed fonts in the file`). Without Aptos the whole layout breaks (substitution).
- Montserrat only if quotes/website — NOT needed for the report template.

### Assets to export from Figma (as SVG + PNG)
| Asset | Where in Figma | Use |
|---|---|---|
| mpower logo **blue** | 01_Tokens / Master Header (54:158 / 216:1778) | header (light), footer |
| mpower logo **white/reverse** | 01_Tokens (9 logo variants) | dark slides (Dark-Navy-Section etc.) |
| Cover background "Dynamic Lines" / spherical M (high-contrast) | 01_Cover (217:483) / Bildwelt | cover slide |
- Export in Figma: select frame/asset → right panel "Export" → SVG (vector) + PNG @2x.

---

## 3 · Layout inventory (38 layouts, page 53:16)

Authoritative layout list = the Figma frames. Hermes rebuilds each frame as a PPT layout (rules from the brief). Link per layout: `…/MPower-Rebranding?node-id=<ID with dash>`.

| Node ID | Name | Category | Status |
|---|---|---|---|
| 217:483 | 01_Cover | Cover | finalized (title placeholder bottom-aligned) |
| 63:7 | 02_Inhaltsverzeichnis kurz mit Unterkapiteln | TOC | present |
| 461:1005 | 02_Inhaltsverzeichnis kurz ohne Unterkapitel | TOC | present |
| 461:890 | 02_Inhaltsverzeichnis lang | TOC | present |
| 63:38 | 03_Trennblatt Kapitel · Beschreibung | Chapter divider | present |
| 461:962 | 03_Trennblatt Kapitel · Unterkapitel | Chapter divider | present |
| 527:1137 | 03_Trennblatt Kapitel · Unterkapitel + Kinder | Chapter divider (3 levels) | current (level 3) |
| 63:51 | 04_Großer Titel | Title/Text | present |
| 64:20 | 05_Text | Title/Text | present |
| 64:38 | 06_Text zweispaltig | Title/Text | present |
| 101:257 | 30_Body + Schluss unten | Title/Text | present |
| 101:282 | 31_Erkenntnis oben + Body | Title/Text | present |
| 64:68 | 07_Grafik + Text | Chart/Data | present |
| 64:97 | 08_Volle Grafik | Chart/Data | present |
| 67:56 | 09_Daten-Highlight | Chart/Data | present |
| 67:83 | 10_Tabelle | Chart/Data | present |
| 93:186 | 24_Tabelle Sub-Spalten | Chart/Data | present |
| 535:14 | 03_Maßnahmen | Chart/Data (no thesis) | new build |
| 65:44 | 13_Drei Spalten | Columns/Boxes | present |
| 66:50 | 14_Zwei Spalten | Columns/Boxes | present |
| 101:196 | 28_Zwei horizontale Boxen | Columns/Boxes | present |
| 101:225 | 29_Drei horizontale Boxen | Columns/Boxes | present |
| 533:14 | 03_Foto + Text | Special visual | new build |
| 77:116 | 16_Referenzen Logo-Wall | Special visual | present |
| 84:92 | 17_Action-Items | Special visual | present |
| 84:134 | 18_Tempel-Säulen | Special visual | present |
| 84:184 | 20_Team-Grid | Special visual | present |
| 93:114 | 21_Geografische Karte | Special visual | present |
| 93:151 | 23_Asymmetric Process Flow | Special visual | present |
| 84:160 | 19_Statement + Tagline | Statement/Band | present |
| 67:126 | 11_Zitat | Statement/Band | present |
| 98:138 | 25_Schlussfolgerung-Band | Statement/Band | present |
| 77:80 | 15_Dark-Navy-Section | Statement/Band | present |
| 93:132 | 22_Mini-Trennblatt | Statement/Band | present |
| 67:139 | 12_Closing | Closing | present |
| 101:142 | 26_Haftungsvereinbarung | Legal | present |
| 101:169 | 27_AGB | Legal | present |

**Components (reused):** Master Header 57:8 · Master Footer 57:12.

**Visual reference for Hermes:** Figma link per node (above), OR in Figma select all frames → "Export" → **PDF** (one stable reference file for the handover).

---

## 4 · Coordinate / measurement reference

All layouts = **1280 × 720 px** (16:9, maps directly to PPT). Content margin: **x = 86** left (right edge x = 1194).

### Shared (master / all content slides)
| Element | Position | Style |
|---|---|---|
| Header band | y 0–60 | — |
| mpower logo (header) | x 1140, y 12, 120 × 36 | top right |
| Breadcrumb "[Hauptkapitelname]" | x 86, y 24 | Aptos, ~10 px, #6B7280, no number |
| Eyebrow (number + name) | x 86, above the title | Body/Eyebrow, ALL CAPS, Navy |
| Title / Kernthese | x 86 | Heading/Slide (Aptos Display 24); Orange = thesis, Navy = neutral |
| Footer band | y 680–720 | — |
| Footer fields (5, left→right) | Quelle x 86 · Copyright · Datum · Kürzel · Page number x ~1181 | Body/Footer (Aptos Regular 8). Split into separate fields in Master Footer 57:12 |

### Chapter divider (e.g. 527:1137)
| Element | Position | Style |
|---|---|---|
| Chapter number | x 86, y 193, ~200 pt | Aptos Display Bold, Orange |
| Chapter name | x 410, y 273 | Heading/Section (Aptos Display 38), Navy |
| Subchapter list (level 2) | x 410, from y 340, row pitch 42 | Heading/Slide; page number right (right edge ~1187) |
| Level 3 | x 428 (indented), pitch 30 | Subhead (Aptos Display 18), #6B7280 |

### Foto + Text (533:14)
| Element | Position | Style |
|---|---|---|
| Eyebrow | x 86, y 84 | Body/Eyebrow, Navy |
| Heading | x 86, y 120 | Heading/Slide, Orange |
| Image placeholder | x 86, y 210, 470 × 360 | grey #E5E7EB; 1 image or 2 stacked |
| Caption | x 86, y 582 | Subhead, #6B7280, optional |
| Body text | x 596, y 210, width 598 | Body, Navy; L1 bullets Orange |

### Maßnahmen (535:14)
| Element | Position | Style |
|---|---|---|
| Title "Maßnahmen" | x 86, y 110 | Heading/Slide, **Navy** (no thesis) |
| Table header row | x 86, y 210, 1108 × 40 | Navy Dark #002B41, white labels |
| Columns | Nr x86 w54 · Maßnahme x150 w600 · Termin x770 w170 · Verantwortlich x950 w244 | — |
| Data rows | from y 250, row height 54 | white, separators #E5E7EB, NO orange |

> For the other ~30 layouts Hermes reads the measurements directly from each Figma frame (node ID above).

---

## 5 · Review / verification (after Hermes output)
1. Open the .pptx — does Aptos render correctly? Fonts embedded?
2. Check placeholders: are they real **placeholders** (not free text boxes)?
3. Check theme colors: accents 1–5 blue, accent 6 orange; master elements not clickable.
4. **Print / projector test** (Aptos Display legibility, white-on-light-blue).

---

## 6 · Status / before handover
- ✅ Cover (217:483) finalized (title bottom-aligned) — Laura.
- ✅ Duplicate "24_Tabelle Sub-Spalten" removed — Laura.
- ✅ Footer split into 5 fields (Master Footer 57:12: Footer-Copyright/-Datum/-Kürzel as own nodes) — via MCP.
- ⚠ Aptos projector test open (Display weight).
- Remaining Aptos backlog (On-Color doc card etc.) affects doc pages, not the layouts — does not block Hermes.

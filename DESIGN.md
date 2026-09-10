---
name: إعمار وهدم للمقاولات العامة
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f1eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#474741'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#777771'
  outline-variant: '#c8c7bf'
  surface-tint: '#5f5e5c'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1c1a'
  on-primary-container: '#858481'
  inverse-primary: '#c9c6c3'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fd983b'
  on-secondary-container: '#693600'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1c16'
  on-tertiary-container: '#87837c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2de'
  primary-fixed-dim: '#c9c6c3'
  on-primary-fixed: '#1c1c1a'
  on-primary-fixed-variant: '#474744'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#e7e2d9'
  tertiary-fixed-dim: '#cac6be'
  on-tertiary-fixed: '#1d1c16'
  on-tertiary-fixed-variant: '#494740'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  headline-hero:
    fontFamily: IBM Plex Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-hero-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.02em
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  technical-code:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  space-4xl: 6rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  container-max: 1280px
---

## Brand & Style

This design system expresses the authority, permanence, and technical precision of an established Saudi general contracting and heavy demolition firm based in the Eastern Province (Dammam). It rejects ephemeral tech trends, decorative gradients, and frivolous digital ornamentation in favor of architectural weight, structural clarity, and tactile material honesty.

### Visual Character
- **Grounded Architectural Prestige:** Evoking reinforced concrete, limestone, steel framework, and precision engineering. Surfaces look physical, dense, and anchored.
- **Bilingual Authority (RTL First):** Built primarily for right-to-left Arabic visual cadence, paired with disciplined Western typographic support for technical specs and engineering codes.
- **Tactile & Structural Contrast:** Heavy dark monolithic foundation blocks (#111110) contrast with warm desert ivory stone plates (#FBF9F5). Amber ochre serves exclusively as a controlled functional cue (heavy machinery, structural alerts, deliberate call-to-action).
- **Target Audience:** Commercial property developers, government entities, industrial plant directors, infrastructure project managers, and high-net-worth real estate owners seeking serious execution capability.

## Colors

The palette is derived directly from raw site materials: Dammam stone aggregate, weathered carbon steel, raw concrete, and high-visibility industrial amber.

### Core Roles
- **Primary (`#1A1A18` / `#111110`):** Basalt Charcoal. Used for primary typography, solid structural headers, dark hero panels, and authoritative framing.
- **Secondary (`#C26A05` / `#D97706`):** Industrial Amber / Ochre. Reserved strictly for primary action elements, key technical callouts, demolition/safety badges, and active operational statuses. Never used as decorative wash or large background fills.
- **Tertiary (`#75726B`):** Cured Concrete Gray. Used for structural metadata, secondary captions, dimension lines, and architectural wireframes.
- **Neutral Surface Baseline (`#FBF9F5` / `#F5F2EB`):** Warm Crushed Limestone / Desert Ivory. Provides a warm, dust-resistant physical canvas that prevents glare while feeling far more prestigious than sterile clinical white.
- **Structural Borders (`#E8E5DE` & `#D5D1C8`):** Low-to-mid contrast architectural joint lines that enforce grid discipline.

## Typography

The typography leverages **IBM Plex Sans** (with explicit Arabic language glyph mapping `IBM Plex Sans Arabic`). Its calculated, mechanical, yet humanistic balance embodies industrial rigor, civil engineering precision, and legibility across distance and high-density tabular data.

### RTL Editorial Rules
- Default alignment is right (`text-align: right`) across all narrative text. Numeric specifications, equipment tonnage, CR numbers, and engineering classifications retain high tabular clarity.
- Headlines use solid weights (600–700) with tightened line heights to emphasize density, like cut masonry stone blocks.
- Body text retains generous vertical line height (`lineHeight: 26px - 30px`) to prevent eye fatigue in dense Arabic scripts.
- English engineering labels, machinery model identifiers (e.g., CAT 349D2, Komatsu PC400), and site specs run in parallel with crisp mono-structural alignment.

## Layout & Spacing

The layout is built upon an architectural modular grid. It resembles structural blueprints and technical contractor site manifests: orderly, deliberate, and uncompromising.

### Structural Framework
- **Desktop (1024px+):** 12-column rigid grid with `1.5rem` (24px) gutters and max container width of `1280px`. Sections utilize structural hairline borders (`1px solid #D5D1C8`) to divide key project metrics, equipment manifests, and project scopes.
- **Tablet (768px - 1023px):** 8-column layout with 24px gutters. Secondary side-panels tuck beneath primary data blocks.
- **Mobile (320px - 767px):** 4-column layout with `1rem` (16px) margins. Columns stack into monolithic structural vertical tiers. Action panels for direct WhatsApp and direct phone consultation anchor persistently to the bottom viewport.
- **Rhythm:** Vertical spacing between major sections follows disciplined rhythm tokens (`space-3xl` and `space-4xl`), giving high-scale infrastructure work an aura of scale and authority.

## Elevation & Depth

Visual hierarchy does not rely on soft, floating, synthetic drop shadows or blurred planes. Depth is established physically through **material layering**, **hard structural joints**, and **subtle architectural contact shadows**.

### Spatial Layering Techniques
- **Layer 0 (Base Foundation):** `#F5F2EB` (Warm Stone Substrate).
- **Layer 1 (Raised Architectural Plates):** `#FBF9F5` bordered with `1px solid #E8E5DE`. Gives cards and data grids the tactile weight of precast stone slabs.
- **Layer 2 (Heavy Structural Modules):** `#1A1A18` deep slabs with crisp `#2E2E2A` perimeter borders. Used for key credentials, demolition license badges, and execution statistics.
- **Tactile Shadows:** Restricted to micro-elevation:
  - Default cards: `0 1px 3px rgba(26, 26, 24, 0.06), 0 1px 2px rgba(26, 26, 24, 0.04)`
  - Active interactive hover: `0 4px 12px rgba(26, 26, 24, 0.08), 0 2px 4px rgba(26, 26, 24, 0.04)` with a `1px` translation along the vertical axis.
- **Divider Treatment:** Crisp `1px` solid divider lines in `#D5D1C8` that span full grid dimensions, mirroring structural beams.

## Shapes

The design system employs **sharp, angular geometry (0px border-radius)** across components, with selective micro-chamfers (`2px` maximum) only where interactive elements require tactile handling comfort. 

### Geometric Rules
- Structural containers, project showcase tiles, equipment specs, and navigation bars use strictly `0px` radius (razor-sharp architectural edges).
- Buttons, input controls, and system chips feature unrounded, squared corners to communicate industrial solidity, masonry blocks, and steel cuts.
- Structural imagery (demolition phases, fleet machinery, site preparation) is never masked into circular or organic cutouts; photos sit strictly in 16:9, 4:3, or 1:1 rectangular frame modules with precision borders.

## Components

### 1. Buttons & Direct Contact Anchors
- **Primary Direct Action (Amber Button):** Background `#C26A05`, text `#FFFFFF`, 0px border radius, bold label. Hover state darkens to `#A35803`. Used for high-intent site consultation and project tendering requests.
- **WhatsApp Direct Action (Field Operations):** Distinctive, high-contrast dark green stone `#1E3A2F` background (distinct from neon green apps), with white text and gold-ochre status dot indicating "متاح ميدانياً / Available On-Site".
- **Phone Quick Dial (Heavy Duty):** Background `#1A1A18`, text `#FBF9F5`, with a `1px solid #333330` border.
- **Secondary Outlined:** Background transparent, `1.5px solid #1A1A18`, text `#1A1A18`. Micro-state shift to inverted fill on hover.

### 2. Architectural Spec Cards
- Structured as concrete slabs: background `#FBF9F5`, boundary line `1px solid #E8E5DE`.
- Card headers feature an industrial index badge (e.g., `01 / أعمال الهدم الكلي` or `SPEC-DEM-08`) in tertiary `#75726B` technical font.
- Imagery inside cards spans edge-to-edge with no padding, seated directly beneath a `1px` structural divider line.

### 3. Equipment & Fleet Chips
- Compact, flat, square-edged tags.
- Background `#E8E5DE`, text `#1A1A18`, font-size `12px`, uppercase/bold Arabic font weight.
- Operational status indicators: small `6px` square dot (Green `#2E6B4F` for active fleet, Amber `#C26A05` for on-duty site assignment).

### 4. Direct Form Inputs (Tender & Demolition Quote Requests)
- Heavy baseline field styling: background `#FFFFFF`, border `1.5px solid #D5D1C8`, sharp 0px corners.
- Focus state: border color shifts decisively to Basalt Charcoal `#1A1A18` with zero outer glow or fuzzy ring.
- Labels sit outside fields in bold `label-md` Arabic script, with clear indicator for required engineering parameters (Square meters, building height, soil conditions).

### 5. Demolition & Safety Badges
- High-contrast caution elements with alternating subtle diagonal hatch mark accents in `#C26A05` and `#1A1A18`.
- Official accreditation and licensing badges (Saudi Ministry of Municipal and Rural Affairs, Civil Defense approval) styled as stamped steel certification seals.
---
name: Academic Enterprise Placement Portal
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3dae9'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefd'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce3f2'
  on-surface: '#151c27'
  on-surface-variant: '#434655'
  inverse-surface: '#2a313c'
  inverse-on-surface: '#ebf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#374655'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f5d6e'
  on-tertiary-container: '#c7d6e9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#d5e4f8'
  tertiary-fixed-dim: '#b9c8db'
  on-tertiary-fixed: '#0e1d2b'
  on-tertiary-fixed-variant: '#3a4858'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce3f2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system powers a comprehensive college Student Internship and Placement Management Portal (SIPMP). It bridges three primary audiences: corporate enterprise recruiters, academic placement administrators, and student candidates.

The aesthetic philosophy centers on **Corporate / Modern enterprise utility**. The interface prioritizes institutional authority, speed of data scanning, and high transactional confidence. Visual noise is aggressively suppressed in favor of sharp tabular information architecture, dense data displays, transparent approval workflows, and unmistakable validation states. 

The emotional response should evoke operational reliability, institutional prestige, and absolute clarity during high-stakes hiring drives and audit processes.

## Colors
The palette utilizes an authoritative slate and blue spectrum to organize complex ERP information:

- **Primary Interactive (#1D4ED8):** Used exclusively for key CTAs, primary actions, active navigation indicators, and progress states.
- **Dark Navy (#1E3A8A):** Anchors institutional headers, elevated module bars, and high-emphasis focal elements.
- **Sidebar Surface (#172554):** Dedicated deep navy structural container providing persistent orientation for complex workflows.
- **Light Blue Accent (#DBEAFE):** Used for selection highlights, active table row indicators, soft badge fills, and contextual banner backdrops.
- **Page Canvas (#F3F4F6):** Neutral light gray background providing deliberate contrast against elevated white surfaces.
- **Surface & Cards (#FFFFFF):** Pure white container backgrounds for forms, data tables, metrics panels, and modals.
- **Typography:** `#111827` ensures high-contrast readability for body and heading content; `#5F6673` carries secondary metadata, timestamps, and column labels.
- **Borders & Dividers (#D1D5DB):** Crisp structural boundaries separating data cells, card outlines, and form field perimeters.
- **Semantic Feedback:**
  - Success: `#15803D` (Offer released, verified, compliant)
  - Warning: `#B45309` (Interview pending, incomplete profile, document expiring)
  - Error: `#B91C1C` (Eligibility failed, rejected, deadline expired)

## Typography
The system employs `Inter` universally to enforce clarity, vertical rhythm, and legibility across dense administrative interfaces.

- **Headlines:** Use tighter negative letter tracking to ensure clean visual anchors for dashboard titles, modal headings, and candidate detail overviews.
- **Body:** Standardized around `body-md` (14px) for data grids, application lists, and form controls to maximize screen estate without sacrificing accessibility.
- **Labels:** Medium-to-semibold weights (`label-md` and `label-sm`) govern form titles, table column headers, and status badges. `label-sm` applies uppercase tracking for data classification flags.
- **Data Scannability:** Ensure all numerical figures, CGPA scores, CTC figures, and dates employ tabular lining figures (`font-variant-numeric: tabular-nums`) to align predictably across grid columns.

## Layout & Spacing
The layout uses a multi-tier fixed-and-fluid hybrid architecture optimized for desktop operational frames (`1280x800px` minimum baseline target).

- **Navigation Shell:** A fixed 240px deep-navy navigation sidebar on the left, paired with a persistent 64px white utility header on top.
- **Main Workspace:** A fluid container spanning the remaining width, constrained with a 24px (`space-lg`) outer padding on desktop screens.
- **Data Grid Architecture:** A 12-column layout with 16px (`gutter`) gaps for standard module groupings. For dense parameter-matching workflows (e.g., student eligibility matching, tier-based filtering), use `gutter-dense` (8px).
- **Rhythm & Padding:** Component internal padding uses an 8px base rhythm. Inputs and table rows rely on `space-sm` vertically (8px) and `space-md` horizontally (16px) for compact data entry. Cards use `space-lg` (24px) for balanced separation.

## Elevation & Depth
Depth is communicated through functional border framing reinforced by subtle, low-opacity ambient shadows:

- **Flat / Base (0dp):** Page background (`#F3F4F6`), table row bodies, and inline utility containers use a flat baseline with 1px structural outlines (`#D1D5DB`).
- **Elevated Card (1dp):** Standard cards, metric tiles, and panel containers use `#FFFFFF` with a 1px border (`#D1D5DB`) and an ambient shadow: `0 1px 3px 0 rgba(17, 24, 39, 0.06), 0 1px 2px -1px rgba(17, 24, 39, 0.04)`.
- **Dropdowns & Popovers (2dp):** Filter menus, date pickers, and context menus float above content using `0 4px 6px -1px rgba(17, 24, 39, 0.08), 0 2px 4px -2px rgba(17, 24, 39, 0.04)`.
- **Modals & Drawers (3dp):** Student profile drawers, resume preview modals, and tier allocation dialogs utilize `0 20px 25px -5px rgba(17, 24, 39, 0.1), 0 8px 10px -6px rgba(17, 24, 39, 0.06)`, framed by a dark backdrop (`#111827` at 50% opacity).

## Shapes
The portal adopts a structured, professional corner curvature (`roundedness: 2`):

- **Cards & Data Containers:** Utilize 8px (`0.5rem`) to 12px radii, delivering modern softness while maintaining crisp geometric alignment against adjacent panels.
- **Buttons, Form Inputs & Selects:** Bound at a strict 6px to 8px border radius to preserve a functional, tool-like demeanor.
- **Status Badges & Chips:** Styled as pill capsules (`9999px`) or compact 4px rounded rectangles depending on hierarchy to clearly separate status indicators from actionable inputs.
- **Tables & Nested Panels:** Outer wrapper containers carry 8px corners with clipping (`overflow: hidden`) to maintain border consistency at header edges.

## Components

### Buttons
- **Primary:** Solid `#1D4ED8` background, `#FFFFFF` text, 8px border radius, 8px 16px padding. Hover state: `#1E3A8A`. Active state: `#172554`. Focus ring: 2px offset with 2px `#DBEAFE`.
- **Secondary / Outline:** Transparent background, 1px border `#D1D5DB`, `#111827` text. Hover state: `#F3F4F6` background.
- **Destructive:** 1px border `#B91C1C`, `#B91C1C` text or solid `#B91C1C` with `#FFFFFF` text for permanent revocations (e.g., student blacklist, drive cancellation).

### Data Tables (Sharp ERP View)
- **Header:** Background `#F3F4F6`, text `#5F6673`, font size 12px, font weight 600, uppercase, 12px vertical padding, 16px horizontal padding.
- **Rows:** Background `#FFFFFF`, height 48px, horizontal borders `#D1D5DB` (0.5px or 1px). Alternating hover effect: `#F8FAFC`. Selected row effect: `#DBEAFE` at 30% opacity with a 3px `#1D4ED8` left indicator line.

### Status Badges & Chips
- **Offer Accepted / Verified:** Text `#15803D`, background `#DCFCE7`, border 1px `#86EFAC`.
- **Under Review / Shortlisted:** Text `#1D4ED8`, background `#DBEAFE`, border 1px `#93C5FD`.
- **Action Required / Pending:** Text `#B45309`, background `#FEF3C7`, border 1px `#FDE68A`.
- **Ineligible / Rejected:** Text `#B91C1C`, background `#FEE2E2`, border 1px `#FCA5A5`.

### Input Fields & Standard Forms
- **Field Anatomy:** Label above input (`label-md`, `#111827`), required indicator `#B91C1C`. Input height 40px, padding 8px 12px, border 1px `#D1D5DB`, background `#FFFFFF`, text `#111827`.
- **States:** Focus produces 1px `#1D4ED8` border with a 3px `#DBEAFE` glow. Error state produces 1px `#B91C1C` border with inline helper text below in `#B91C1C`.

### Cards & Metric Panels
- **Standard Card:** Surface `#FFFFFF`, border 1px `#D1D5DB`, radius 8px, padding 20px.
- **KPI / Stat Card:** Metric value in `headline-lg` (`#111827`), trend tag in pill badge, label in `label-md` (`#5F6673`), with an optional top border accent line (3px `#1D4ED8`).

### Custom Portal Components
- **Eligibility Rule Builder Strip:** Visual tag row showing matching criteria (e.g., "CGPA ≥ 7.5", "No Active Backlogs", "B.Tech CSE/IT") using light `#DBEAFE` tags with dismissible icons.
- **Recruitment Stage Tracker:** Stepper component tracking student journey (Applied → Online Test → Technical Interview → HR → Offer Released) with connected node lines and color-coded semantic states.
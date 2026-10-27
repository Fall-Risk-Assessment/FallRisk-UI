---
version: alpha
name: Omni Care Design System
description: Visual identity and design system for Omni Project — Fall-Risk Assessment & Multiversal Hospital Clinical Platform for Thai older adults (Faculty of Medicine, Chulalongkorn University / NBTC).
colors:
  primary: "#B74670"
  primary-hover: "#9E3A5E"
  primary-container: "#FCE8F0"
  on-primary: "#FFFFFF"
  on-primary-container: "#8A254D"
  secondary: "#4A8CBF"
  secondary-hover: "#39729E"
  secondary-container: "#EBF3F9"
  on-secondary: "#FFFFFF"
  on-secondary-container: "#1B5682"
  tertiary: "#DB5F8E"
  tertiary-hover: "#C44A79"
  tertiary-container: "#FCE8F0"
  on-tertiary: "#FFFFFF"
  on-tertiary-container: "#8A254D"
  surface: "#FFFFFF"
  on-surface: "#2D2428"
  surface-variant: "#FCF8FA"
  on-surface-variant: "#786D72"
  background: "#F9F6F7"
  on-background: "#2D2428"
  outline: "#EADDE3"
  outline-variant: "#F4EBF0"
  error: "#C4364E"
  on-error: "#FFFFFF"
  error-container: "#FDE8EC"
  on-error-container: "#7C1A2B"
  success: "#257A5D"
  on-success: "#FFFFFF"
  success-container: "#E5F4EE"
  on-success-container: "#144B38"
  warning: "#A76409"
  on-warning: "#FFFFFF"
  warning-container: "#FFF1D8"
  on-warning-container: "#663B02"
typography:
  headline-display:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 1.5rem
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: 0px
  headline-sm:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 1.2rem
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0px
  body-lg:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 1.05rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-md:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 0.95rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 0.85rem
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0px
  label-lg:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 0.9rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.01em
  label-md:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 0.78rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans Thai, Inter, sans-serif
    fontSize: 0.72rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: 0.12em
rounded:
  none: 0px
  sm: 10px
  md: 14px
  lg: 18px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  sidebar-width: 268px
  topbar-height: 72px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
  button-tertiary-hover:
    backgroundColor: "{colors.tertiary-hover}"
  button-tertiary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 8px
  card-clinical:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 22px
  card-metric:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 20px
  card-device:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 20px
  badge-risk-low:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-risk-medium:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.on-warning-container}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-risk-high:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-device-online:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    rounded: "{rounded.full}"
    padding: 6px
  badge-device-offline:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
    rounded: "{rounded.full}"
    padding: 6px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 12px
---

## Overview

The Omni Care Design System unifies **Clinical Rigor** with **Empathetic Warmth**. Developed for the Multiversal Hospital Cognitive & Fall-Risk Assessment Platform (Faculty of Medicine, Chulalongkorn University / NBTC), the system serves older adult patients, clinical staff, physiotherapists, and researchers.

Rather than the cold, clinical greys and intimidating sterile blues common in legacy medical software, Omni utilizes a welcoming **Raspberry Rose** identity complemented by clean white cards, high-contrast typography, and intuitive color-coded risk evaluations.

Key design principles:
- **Calm & Approachable:** Warm tones lower anxiety for elderly patients undergoing motor and cognitive assessments.
- **Immediate Clinical Recognition:** High-contrast color indicators (Green for Low Risk, Amber for Medium Risk, Red for High Risk) allow clinicians to triage risk factors instantly.
- **Bilingual Clarity:** Harmonious dual-language rendering (Thai and English) ensures seamless adoption across Thai medical personnel and patients.
- **Touch-Friendly Precision:** Generous touch targets (minimum 44x44px) accommodate tremors and reduced manual dexterity in elderly users.

## Colors

The palette is engineered for clinical contrast, accessibility, and visual comfort across daytime hospital rooms, telemedicine tablets, and administrative workstations.

### Primary & Brand Identity
- **Primary (`#B74670`):** Deep Raspberry Rose for primary actions, navigation active states, high-priority buttons, and focal clinical numbers. Exceeds WCAG AA contrast (5.09:1 on white).
- **Primary Hover (`#9E3A5E`):** Darkened raspberry for interactive hover states.
- **Primary Container (`#FCE8F0`):** Soft rose tint for active navigation backgrounds, icon badge rings, and highlight containers.
- **On Primary Container (`#8A254D`):** Deep rose text providing high contrast (7.3:1) on primary containers.
- **Tertiary (`#DB5F8E`):** Vibrant Raspberry accent used for branding highlights, focus outlines, and gradient accents.

### Clinical & Functional Accents
- **Secondary (`#4A8CBF`):** Steel Blue for secondary gait analytics, balance axes, sensor curves, and telemetry charts.
- **Secondary Container (`#EBF3F9`):** Light sky tint for secondary data chips and filter badges.
- **On Secondary Container (`#1B5682`):** Navy text ensuring high contrast (6.9:1) on secondary containers.

### Neutral Foundation & Surfaces
- **Background (`#F9F6F7`):** Warm limestone foundation providing a softer, glare-free backdrop compared to raw `#FFFFFF`.
- **Surface (`#FFFFFF`):** Pure white for elevated clinical cards, modal overlays, and metric containers.
- **Surface Variant (`#FCF8FA`):** Soft blush surface for nested table rows, alert list items, and hover highlights.
- **On Surface (`#2D2428`):** Deep Plum Charcoal for body copy, headings, and metric labels (15.06:1 contrast on white). Pure `#000000` is strictly avoided to reduce optical fatigue.
- **On Surface Variant (`#786D72`):** Muted Mauve Slate for metadata, timestamps, and secondary captions (4.97:1 contrast on white).
- **Outline (`#EADDE3`):** Soft blush border creating gentle card boundaries without stark divider lines.
- **Outline Variant (`#F4EBF0`):** Subtle border for internal table rows and divider separators.

### Semantic Risk & Status Signals
- **Success / Low Risk (`#257A5D`):** Sage Emerald for low fall risk, healthy gait cadence, and online device connectivity.
- **Success Container (`#E5F4EE`):** Soft mint pill background paired with **On Success Container (`#144B38`)** for 8.8:1 contrast.
- **Warning / Medium Risk (`#A76409`):** Amber Ochre for moderate fall risk, low battery alerts, and calibration warnings.
- **Warning Container (`#FFF1D8`):** Soft honey background paired with **On Warning Container (`#663B02`)** for 8.6:1 contrast.
- **Error / High Risk (`#C4364E`):** Crimson Rose for critical fall risk, balance anomalies, emergency alerts, and disconnected devices.
- **Error Container (`#FDE8EC`):** Soft blush pink background paired with **On Error Container (`#7C1A2B`)** for 8.8:1 contrast.

## Typography

Omni implements a unified typographic scale centered on **IBM Plex Sans Thai** paired with **Inter**. This pairing ensures balanced vertical alignment, excellent Thai diacritic rendering, and numeric clarity for sensor telemetry.

### Font Families
- **Primary:** `'IBM Plex Sans Thai', 'Inter', system-ui, sans-serif`
- **Monospace Telemetry Fallback:** `'JetBrains Mono', 'Fira Code', monospace` (for raw IoT payloads and hardware hex values)

### Typographic Hierarchy
- **Headline Display (`headline-display`):** `2.5rem` (40px) / bold 700 / line-height 1.2 / letter-spacing `-0.02em`. Used for major patient assessment scores and hero metrics.
- **Headline Large (`headline-lg`):** `2.0rem` (32px) / bold 700 / line-height 1.25 / letter-spacing `-0.01em`. Used for page headers and dashboard titles.
- **Headline Medium (`headline-md`):** `1.5rem` (24px) / semi-bold 650 / line-height 1.3. Used for card section titles and clinical group headers.
- **Headline Small (`headline-sm`):** `1.2rem` (19px) / semi-bold 600 / line-height 1.35. Used for widget titles, device titles, and modal headers.
- **Body Large (`body-lg`):** `1.05rem` (17px) / regular 400 / line-height 1.5. Used for patient remarks, diagnosis summaries, and clinical instructions.
- **Body Medium (`body-md`):** `0.95rem` (15px) / regular 400 / line-height 1.5. Standard UI body copy, descriptions, and form input values.
- **Body Small (`body-sm`):** `0.85rem` (14px) / regular 400 / line-height 1.45. Used for secondary metadata, table cell secondary details, and helper text.
- **Label Large (`label-lg`):** `0.9rem` (14px) / semi-bold 600 / line-height 1.3 / letter-spacing `0.01em`. Used for button labels, form labels, and filter tabs.
- **Label Medium (`label-md`):** `0.78rem` (12px) / semi-bold 600 / line-height 1.2 / letter-spacing `0.02em`. Used for bilingual secondary captions, table column headers, and status badges.
- **Label Small (`label-sm`):** `0.72rem` (11.5px) / bold 800 / line-height 1.1 / letter-spacing `0.12em`. Used for uppercase section eyebrows, device indicators, and protocol flags.

## Layout

The Omni application follows a responsive, high-density clinical dashboard layout structured to optimize visual scanning during live patient testing:

### Shell Structure
- **Sidebar (`sidebar`):** Fixed-width `268px` sticky left navigation panel containing the hospital/project logo, user role caption, scrollable nav links, and logout trigger.
- **Top Navigation (`top-nav`):** Sticky header with `72px` height, featuring a frosted glass blur backdrop (`rgba(255, 255, 255, 0.88)` with `backdrop-filter: blur(12px)`) displaying user credentials and role avatars.
- **Main Canvas (`main-area` / `content-scroll`):** Scrollable workspace with standard `32px` padding and max-width `1280px` for clinical dashboards.

### Responsive Breakpoints
- **Desktop (>= 1050px):** Full 4-column metric cards, split two-column analytical views (60% charts / 40% patient history), 2-column device grid.
- **Tablet (641px - 1049px):** 2-column metric cards, stacked analytical columns, collapsible secondary panels.
- **Mobile (<= 640px):** Single-column stack, horizontal scrolling top navigation bar, compact padding (`16px`), hidden decorative graphics.

## Elevation & Depth

Visual hierarchy is communicated through subtle tonal contrast, crisp borders, and soft warm shadows rather than heavy skeuomorphic drop shadows.

- **Level 0 (Base Canvas):** Soft background `#F9F6F7`.
- **Level 1 (Clinical Cards & Panels):** Pure white `#FFFFFF` surface with `1px solid #EADDE3` border and soft shadow `0 1px 3px rgba(64, 31, 44, 0.07)`.
- **Level 2 (Hovered Cards & Interactive Containers):** Subtle lift with `0 8px 24px rgba(64, 31, 44, 0.09)` and border transition to `#CBD5E1`.
- **Level 3 (Modal Dialogs & Floating Drawers):** `0 20px 25px -5px rgba(64, 31, 44, 0.12)` accompanied by semi-transparent backdrop `rgba(0, 0, 0, 0.45)`.
- **Glassmorphic Layer:** Frosted header with `rgba(255, 255, 255, 0.88)` and `backdrop-filter: blur(12px)`.

## Shapes

Shapes utilize modern rounded geometries that evoke comfort and safety while maintaining clean alignment for structured medical data:

- **Sharp (`none`):** `0px` — Used only for edge-to-edge full bleed containers.
- **Small Radius (`sm`):** `10px` — Standard for buttons, form inputs, select dropdowns, search boxes, and alert list items.
- **Medium Radius (`md`):** `14px` — Used for metric overview cards, sensor heatmap containers, and modal dialog boxes.
- **Large Radius (`lg`):** `18px` — Used for primary clinical cards, patient hero assessment cards, and session detail summaries.
- **Pill Radius (`full`):** `9999px` — Used for fall-risk badges, device status indicators, circular score rings, and user avatar pills.

## Components

The design system standardizes reusable component atoms and molecules across all patient and administration screens:

### Buttons
- **Primary Button (`button-primary`):** Solid deep rose background (`#B74670`), white text (`#FFFFFF`), `10px` border radius, `12px` vertical padding, bold font. Hover shifts to `#9E3A5E`.
- **Secondary Button (`button-secondary`):** White surface (`#FFFFFF`), `1px solid #B74670` border, deep rose text (`#B74670`), `10px` border radius. Hover introduces `#FCE8F0` tint.
- **Tertiary Action Button (`button-tertiary`):** Transparent background, vibrant rose text (`#DB5F8E`), zero border, used for table row actions and inline links.

### Cards
- **Clinical Summary Card (`card-clinical`):** White background, `18px` rounded corners, `22px` padding, subtle `#EADDE3` border. Houses comprehensive clinical assessments and gait charts.
- **Metric Stat Card (`card-metric`):** White background, `14px` rounded corners, `20px` padding, vertically centered layout displaying metric icon, bold numeric value, and trend indicators.
- **Device Profile Card (`card-device`):** White background, `10px` rounded corners, `20px` padding, containing device status badge, telemetry sync rate, and operational toggle.

### Risk & Status Badges
- **Low Risk Badge (`badge-risk-low`):** Mint container (`#E5F4EE`), dark green text (`#144B38`), fully rounded pill (`9999px`), `8px` padding, bold bilingual label.
- **Medium Risk Badge (`badge-risk-medium`):** Honey container (`#FFF1D8`), dark amber text (`#663B02`), fully rounded pill (`9999px`), `8px` padding.
- **High Risk Badge (`badge-risk-high`):** Blush pink container (`#FDE8EC`), dark crimson text (`#7C1A2B`), fully rounded pill (`9999px`), `8px` padding.
- **Device Online Badge (`badge-device-online`):** Mint container (`#E5F4EE`), dark green text (`#144B38`), circular status pip indicator.
- **Device Offline Badge (`badge-device-offline`):** Blush pink container (`#FDE8EC`), dark crimson text (`#7C1A2B`).

### Form Elements & Inputs
- **Input Field (`input-field`):** White background, `10px` rounded corners, `1px solid #EADDE3` border, `12px` padding. Focus ring applies `3px solid rgba(219, 95, 142, 0.23)` with `outline-offset: 2px`.
- **Search Field:** Enhanced input with absolute left-aligned search icon (`38px` left padding) and clear button.

### Specialized Telemetry Widgets
- **Sensor Heatmap Container:** Dark canvas (`#12141A`) with `14px` border radius, high-contrast pressure colormap, and color-coded pressure legend.
- **Score Ring:** Conic gradient circular progress indicator with pure white inner cutout displaying large clinical scores and category ratings.

## Do's and Don'ts

### Do's
- **Do** maintain bilingual (Thai & English) labels on all clinical metric headers and risk evaluations.
- **Do** adhere strictly to WCAG AA color contrast ratios (minimum 4.5:1 for body copy and 3.0:1 for large graphical metrics).
- **Do** preserve the established semantic colors for Fall Risk levels (Green = Low, Amber = Medium, Red = High).
- **Do** ensure all interactive buttons and inputs meet the 44x44px minimum touch target size for elderly accessibility.
- **Do** use `IBM Plex Sans Thai` and `Inter` across all views to guarantee consistent font rendering.
- **Do** wrap patient session numbers and sensitive telemetry in structured clinical card containers.

### Don'ts
- **Don't** use pure `#000000` text on white backgrounds; always use Deep Plum Charcoal (`#2D2428`).
- **Don't** use arbitrary bright accent colors that compete with the Raspberry Rose and Steel Blue identity.
- **Don't** mix sharp 90-degree rectangle corners with the curved `10px`/`14px`/`18px` shape system.
- **Don't** hide high-risk fall warnings or disconnected sensor states behind clicks or nested accordions.
- **Don't** use light grey text (contrast < 4.5:1) for secondary descriptions or metadata.
- **Don't** use generic default browser alert dialogues for clinical confirmations; use the stylized `Modal` component.

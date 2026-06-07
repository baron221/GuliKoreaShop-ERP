---
name: K-Beauty Enterprise Design System
colors:
  surface: '#f4fafd'
  surface-dim: '#d4dbdd'
  surface-bright: '#f4fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f7'
  surface-container: '#e8eff1'
  surface-container-high: '#e2e9ec'
  surface-container-highest: '#dde4e6'
  on-surface: '#161d1f'
  on-surface-variant: '#57423e'
  inverse-surface: '#2b3234'
  inverse-on-surface: '#ebf2f4'
  outline: '#8b716d'
  outline-variant: '#dec0ba'
  surface-tint: '#a53b29'
  primary: '#a53b29'
  on-primary: '#ffffff'
  primary-container: '#ff7e67'
  on-primary-container: '#731709'
  inverse-primary: '#ffb4a6'
  secondary: '#3e6658'
  on-secondary: '#ffffff'
  secondary-container: '#c0ecda'
  on-secondary-container: '#446c5e'
  tertiary: '#745938'
  on-tertiary: '#ffffff'
  tertiary-container: '#c09f78'
  on-tertiary-container: '#4d3618'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a6'
  on-primary-fixed: '#3f0300'
  on-primary-fixed-variant: '#842415'
  secondary-fixed: '#c0ecda'
  secondary-fixed-dim: '#a5d0be'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#264e41'
  tertiary-fixed: '#ffddb7'
  tertiary-fixed-dim: '#e4c198'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#5b4223'
  background: '#f4fafd'
  on-background: '#161d1f'
  surface-variant: '#dde4e6'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 20px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
This design system is engineered for the high-velocity world of Korean cosmetics manufacturing and retail. It balances the utilitarian rigor of an ERP with the ethereal, "glass-skin" aesthetic synonymous with the K-beauty industry. 

The visual style is **Glassmorphism**, utilizing multi-layered translucency to manage information density. By using frosted surfaces and background blurs, we create a sense of depth that prevents data-heavy screens from feeling overwhelming. The emotional response should be one of "Luminous Efficiency"—a professional environment that feels premium, airy, and modern.

## Colors
The palette is inspired by the natural ingredients and minimalist packaging of modern skincare. 

- **Primary (Vibrant Coral):** Used exclusively for primary actions, critical status alerts, and brand accents. It provides a high-contrast focal point against the soft background.
- **Secondary (Muted Sage):** Used for "Success" states, inventory growth indicators, and organic categorization.
- **Tertiary (Cream Peach):** Used for subtle highlights, warning backgrounds, and secondary visual interests.
- **Neutral (Deep Charcoal):** Provides the "Ink" for the system, ensuring AA/AAA accessibility for all text and iconography.
- **Surface Strategy:** Backgrounds are never pure white; they use a soft, warm-to-cool gradient to provide the necessary canvas for the frosted glass (white with low opacity) components to pop.

## Typography
**Plus Jakarta Sans** is the sole typeface for this design system. Its modern, geometric construction and slightly rounded apertures mirror the soft-tech aesthetic required for a premium cosmetics ERP.

- **Headlines:** Use a tighter letter-spacing and heavier weights to anchor pages.
- **Data Display:** For tabular data and inventory numbers, use `body-md` with a medium weight to ensure legibility against translucent backgrounds.
- **Labels:** Uppercase labels with slight tracking are reserved for metadata and small categorizations to differentiate them from interactive text.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for mobile-first ERP workflows. We prioritize "breathability" to reduce the cognitive load of data-intensive tasks.

- **Margins:** A consistent 20px safe area on the left and right of the screen.
- **Vertical Rhythm:** Elements are spaced using an 8px base unit. Cards and sections should be separated by `stack-lg` to maintain the premium, spacious feel.
- **Touch Targets:** All interactive elements maintain a minimum 44px height, even if the visual "glass" container appears smaller.

## Elevation & Depth
Depth is not communicated through heavy shadows, but through **translucency and refraction**.

- **Level 1 (Base):** The gradient canvas.
- **Level 2 (Glass Panels):** Main content cards. Background: `rgba(255, 255, 255, 0.6)`, Backdrop Blur: `20px`, Border: `1px solid rgba(255, 255, 255, 0.4)`.
- **Level 3 (Floating Elements):** Modals and active inputs. Background: `rgba(255, 255, 255, 0.8)`, Backdrop Blur: `30px`, Shadow: `0 8px 32px rgba(0, 0, 0, 0.05)`.
- **Depth Cues:** A very subtle inner glow (top-left) on glass panels enhances the physical "sheet of glass" metaphor.

## Shapes
The shape language is consistently **Rounded** (0.5rem base) to evoke the soft curves of cosmetic packaging and organic beauty forms. 

- **Primary Cards:** Use `rounded-lg` (1rem) to create a soft, friendly containment for data.
- **Input Fields:** Use the base `rounded` (0.5rem) to maintain a professional, structured feel.
- **Floating Action Buttons (FAB):** Use `pill-shaped` for maximum distinction from the underlying grid.

## Components
- **Buttons:** 
  - *Primary:* Solid Vibrant Coral with white text. Subtle 4px corner radius.
  - *Secondary:* Frosted glass effect with a thin Coral border and text.
- **Glass Cards:** The primary container for all ERP data. Each card must have a 1px semi-transparent white border to define its edges against the background blur.
- **Chips & Tags:** Small, pill-shaped elements with low-opacity background tints (e.g., a Sage tint for 'In Stock').
- **Input Fields:** Semi-transparent white fill. On focus, the border transitions from white to Vibrant Coral with a subtle glow.
- **Data Lists:** Use thin, 0.5px dividers with `rgba(0,0,0,0.05)` opacity. Avoid heavy lines; let the whitespace create the separation.
- **KPI Indicators:** Large `headline-lg` numbers paired with `label-lg` descriptors, typically placed in the top-most glass panel of a dashboard.
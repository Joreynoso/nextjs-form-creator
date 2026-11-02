## Overview

Miro positions itself as the AI-powered visual workspace through a confident, slightly playful brand voice. The homepage opens with a stark white canvas anchored by a small canary-yellow Miro wordmark in the top-left, a black-pill primary CTA "Get started free" and a secondary "Book a demo" outline pill — then dramatic real-Miro-board mockup imagery (sticky notes, kanban, mind maps) carries the visual weight. Across deeper surfaces, the system breaks open: pastel feature cards (rose, teal, coral, yellow) echo the actual sticky-note color palette of the live whiteboard product, and customer story cards reuse those tints to differentiate brand vignettes.

Roobert PRO — Miro's custom display face — anchors every typographic surface, from the 80px hero display down to 11px micro labels. The face's slightly rounded, geometric character pairs naturally with the playful product photography and the friendly product positioning. Black-pill primary buttons (`{rounded.full}`) dominate marketing CTAs; the brand color, signature canary yellow ({colors.brand-yellow}), is reserved for the wordmark, top promo banners, and "yellow tag" feature pills — never as a primary CTA. The 4-tier pricing comparison (Free / Starter / Business / Enterprise) leads into the densest surface in the system: a feature comparison table that runs ~80 rows deep across multiple section dividers.

**Key Characteristics:**
- Stark white canvas + Miro wordmark in canary yellow ({colors.brand-yellow}) as the recognizable opening signature
- Black-pill primary CTAs ({colors.primary} + `{rounded.full}`) as the dominant interactive element
- Pastel feature cards (yellow, rose, coral, teal, mint) that echo the actual sticky-note palette
- Roobert PRO across every UI surface; geometric, slightly rounded character
- Real Miro-board mockup imagery used as feature illustrations
- 4-tier pricing card grid + dense feature comparison table
- Massive dark footer ({colors.footer-bg}) with multi-column links + app-store badges

## Colors

> Source pages: miro.com/ (homepage), /pricing/ (4-tier comparison), /products/ai-workflows/ (AI product), /agile/ (vertical landing), /customers/ (story directory). Token coverage was identical across all five pages.

### Brand & Accent
- **Miro Yellow** ({colors.brand-yellow}): The brand's recognizable canary yellow — wordmark color, top promo banner, "yellow tag" pills
- **Yellow Deep** ({colors.brand-yellow-deep}): Darker variant for hover states and emphasis
- **Yellow Light** ({colors.yellow-light}): Pale yellow background tint for tag chips
- **Yellow Dark** ({colors.yellow-dark}): Yellow-tag text color (dark olive) for chip foreground
- **Brand Blue** ({colors.brand-blue}): Action blue for inline links and featured-pricing-tier border
- **Blue Pressed** ({colors.blue-pressed}): Pressed-state blue
- **Brand Coral** ({colors.brand-coral}): Coral accent for warm callouts
- **Coral Light** ({colors.coral-light}): Pale coral for feature card backgrounds
- **Coral Dark** ({colors.coral-dark}): Coral-tag text color (deep wine)
- **Brand Rose** ({colors.brand-rose}): Soft rose-pink for feature card variants
- **Brand Teal** ({colors.brand-teal}): Brand teal
- **Teal Light** ({colors.teal-light}): Pale teal for feature card backgrounds
- **Moss Dark** ({colors.moss-dark}): Deep teal-green text color
- **Brand Pink** ({colors.brand-pink}): Pale pink for soft callouts
- **Brand Orange Light** ({colors.brand-orange-light}): Soft orange for feature card backgrounds

### Surface
- **Canvas White** ({colors.canvas}): Page background and primary card surface
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions
- **Surface Yellow** ({colors.surface-yellow}): Pale yellow-tinted surface for tag chip
- **Surface Pricing Featured** ({colors.surface-pricing-featured}): Pale lavender for featured pricing tier
- **Hairline** ({colors.hairline}): 1px borders and primary dividers
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px border for inputs

### Text
- **Ink Deep** ({colors.ink-deep}): Headlines on lighter feature cards
- **Ink** ({colors.ink}): Primary headlines and body text
- **Charcoal** ({colors.charcoal}): Body emphasis text
- **Slate** ({colors.slate}): Secondary text, metadata
- **Steel** ({colors.steel}): Tertiary text, footer links
- **Stone** ({colors.stone}): Captions, muted labels
- **Muted** ({colors.muted}): Disabled labels, input placeholders
- **On Dark** ({colors.on-dark}): White text on dark surfaces
- **On Dark Muted** ({colors.on-dark-muted}): Reduced-opacity white on dark

### Semantic
- **Success Accent** ({colors.success-accent}): Confirmation/success indicator green
- **Brand Red** ({colors.brand-red}): Soft red for error backgrounds
- **Brand Red Dark** ({colors.brand-red-dark}): Stronger red for error borders

## Typography

### Font Family
**Roobert PRO** (primary): Miro's custom geometric sans-serif typeface. Used across every UI surface from oversized 80px hero displays to 11px micro labels. The face has a slightly rounded, friendly character that matches the brand's playful product positioning. Fallbacks: Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 500 | 1.05 | -2px | Marketing hero ("See how teams get great done with Miro") |
| `{typography.display-lg}` | 60px | 500 | 1.10 | -1.5px | Major section openers |
| `{typography.heading-1}` | 48px | 500 | 1.15 | -1px | Page-level headlines |
| `{typography.heading-2}` | 36px | 500 | 1.20 | -0.5px | Subsection headlines |
| `{typography.heading-3}` | 28px | 500 | 1.25 | 0 | Card titles |
| `{typography.heading-4}` | 22px | 500 | 1.30 | 0 | Feature tile titles |
| `{typography.heading-5}` | 18px | 500 | 1.40 | 0 | FAQ questions, smaller cards |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | Logo wall labels |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Filter dropdowns, button labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels, tag chips |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Footer microcopy |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | Section dividers in tables |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Pill button labels |
| `{typography.stat-display}` | 64px | 500 | 1.10 | -1.5px | "100M+ users" stat callouts |

### Principles
- **Tight hero leading** (1.05) creates magazine-grade display headlines on the 80px hero
- **Negative letter-spacing progression** — display sizes use -2px to -1.5px; smaller headings relax to 0
- **Stat-display token** (64px / 500) for marketing stat callouts
- **Single weight scale** — 400 (body), 500 (medium emphasis + headings), 600 (badges and uppercase). Roobert PRO does not use 700 in this system.

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px); pricing comparison tightens to `{spacing.section}` (64px); customer story stack uses `{spacing.xxl}` (32px)
- **Card internal padding**: `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for feature panels

### Grid & Container
- Marketing pages use 1280px max-width with 32px gutters
- Pricing page renders 4-tier card row at desktop (Free / Starter / Business / Enterprise)
- Customer stories page uses 2-column grid with filter dropdowns
- AI Workflows page uses 2-column hero, then 3-up feature grid

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) hero padding gives the small wordmark room to breathe. Pricing surfaces tighten dramatically.

## Elevation & Depth

The system runs predominantly flat with strategic depth on hero mockups.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline-soft}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(5, 0, 56, 0.04) 0px 1px 2px 0px` | Subtle hover-elevated tiles |
| 2 (card) | `rgba(5, 0, 56, 0.06) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(5, 0, 56, 0.08) 0px 12px 32px -4px` | Hero whiteboard mockup framing |
| 4 (modal) | `rgba(5, 0, 56, 0.12) 0px 16px 48px -8px` | Modals, dropdowns |

### Decorative Depth
- The atmospheric depth on Miro's hero comes from the live-product-board mockup illustrations — sticky notes layered at z-offsets, color-block tints behind whiteboard frames
- Pastel feature cards carry their own visual weight via saturated background color
- Customer-story cards layer dark photographic content with overlay scrims

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, micro-controls |
| `{rounded.sm}` | 6px | Discount badges |
| `{rounded.md}` | 8px | Inputs, search-pill |
| `{rounded.lg}` | 12px | Standard cards, table containers |
| `{rounded.xl}` | 16px | Pricing cards, feature panels |
| `{rounded.xxl}` | 20px | Larger feature cards |
| `{rounded.xxxl}` | 28px | Pastel feature cards (yellow, rose, coral, teal) |
| `{rounded.feature}` | 32px | Hero CTA banner cards |
| `{rounded.full}` | 9999px | All buttons, pill tabs, badges |

### Photography Geometry
- Real Miro board mockups render with `{rounded.xl}` (16px) corners and a subtle drop shadow
- Customer story cards use `{rounded.xxxl}` (28px) corners with full-bleed photography
- Template card thumbnails use `{rounded.xl}` (16px) with photographic content
- Customer logos wall presents wordmarks inline at consistent 100px height

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action ("Get started free").
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-yellow`** — Brand-yellow pill for moments of brand emphasis.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-blue`** — Brand-blue pill for inline action callouts.
- Background `{colors.brand-blue}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-secondary`** — Outlined pill for secondary actions ("Book a demo").
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-on-dark`** — White pill for dark CTA banners.
- Background `{colors.on-dark}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `12px 24px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button.
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline text link.
- Background transparent, text `{colors.brand-blue}`, typography `{typography.body-sm-medium}`, padding `0`.

**`button-icon-circular`** — 36×36px circular utility button.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

**Implementation mapping (`components/ui/button.tsx`)** — `default` is the black pill primary CTA; `secondary` is the outlined pill; `outline` is a lighter outlined pill; `destructive` is the red pill; `ghost` is the rectangular 8px-radius quiet action; `link` uses brand blue. `icon` sizes are circular. Default height is 40px, `sm` 36px, `lg` 44px, `xs` 28px.

### Cards & Containers

**`card-base`** — Standard content card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature`** — White feature card with larger 28px corners.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline-soft}`.

**`card-feature-yellow`** — Pastel-yellow feature card.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-coral`** — Pastel-coral feature card variant.
- Background `{colors.coral-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-teal`** — Pastel-teal feature card variant.
- Background `{colors.teal-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-feature-rose`** — Pastel-rose feature card variant.
- Background `{colors.rose-light}`, text `{colors.primary}`, rounded `{rounded.xxxl}`, padding `{spacing.xxl}`.

**`card-customer-story`** — Customer story card.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `0` (image fills the card), border `1px solid {colors.hairline-soft}`.

**`card-stat`** — Stat-row cell for "100M+ users".
- Background transparent, text `{colors.ink}`, typography `{typography.stat-display}`, padding `{spacing.lg}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`pricing-card-featured`** — Featured pricing tier (Business — lavender background + blue border).
- Background `{colors.surface-pricing-featured}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-blue}`.

**`pricing-card-enterprise`** — Dark-canvas enterprise tier card.
- Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 44px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-blue}`.

**`search-pill`** — Search bar.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 40px, border `1px solid {colors.hairline}`.

**`filter-dropdown`** — Pill-shaped filter dropdown ("Company use" / "Industry" / "Use case").
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`, rounded `{rounded.full}`, padding `{spacing.xs} {spacing.md}`, border `1px solid {colors.hairline-strong}`.

**Implementation mapping (`components/ui/input.tsx` / `textarea.tsx`)** — Standard fields render at 44px high with 8px radius, `hairline-strong` border, canvas surface, brand-blue focus ring, muted placeholders and explicit disabled/read-only surfaces. Product-specific editorial fields (form title, builder questions/options, player underline inputs) keep their bespoke styling until they are redesigned as a dedicated variant.

### Tabs

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav.
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`.

**`toggle-monthly-yearly`** — Two-state pill toggle (Monthly / Annual on pricing).
- Background `{colors.surface}`, rounded `{rounded.full}`, padding `4px`.

### Badges & Status

**`badge-promo`** — Yellow promo banner badge.
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-yellow`** — Soft-yellow feature tag chip ("Yellow" tag on AI Workflows page).
- Background `{colors.surface-yellow}`, text `{colors.yellow-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-purple`** — Lavender feature tag chip ("AI agent" tag).
- Background `{colors.surface-pricing-featured}`, text `{colors.brand-blue}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-tag-coral`** — Coral feature tag chip variant.
- Background `{colors.coral-light}`, text `{colors.coral-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-success`** — Green success indicator.
- Background `{colors.success-accent}`, text `{colors.on-primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-discount`** — Yellow rectangular discount pill ("Save 15%").
- Background `{colors.brand-yellow}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 6px`.

**Implementation mapping (`components/ui/badge.tsx`)** — `yellow` maps to the promo badge; `tag-yellow`, `tag-purple` and `tag-coral` map to feature tags; `success` maps to the success indicator; `discount` keeps the 6px radius and micro type. `secondary`, `outline` and `ghost` cover quiet product/status badges. The base badge is a 13px/600 pill.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`. Carries inline yellow "GET YOUR SPOT" pill.

### Overlays

**`dialog`** — Modal surface for destructive confirmations and focused tasks.
- Overlay `bg-black/50` with a subtle backdrop blur; panel `{colors.canvas}`, border `1px solid {colors.hairline}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, shadow `{shadow.modal}`.
- Title `{typography.heading-4}`, description `{typography.body-sm}` in `{colors.steel}`. Dismissal via close button, overlay click, and Escape; focus is trapped and background scroll locked.

**`dropdown-menu`** — Contextual action menu.
- Surface `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.lg}`, padding 6px, shadow `{shadow.modal}`, min-width 10rem.
- Items use `{typography.body-sm-medium}`, `{rounded.sm}`, 12px horizontal and 8px vertical padding. Destructive items use the red semantic color; separators use `{colors.hairline}`.

**Implementation mapping (`components/ui/dialog.tsx` / `dropdown-menu.tsx`)** — Both primitives wrap Radix. `Dialog` owns portal, overlay, focus trap, scroll lock, Escape handling and the accessible close button; `deleteDialog` now consumes it instead of rendering a manual fixed overlay. `DropdownMenu` uses the 12px `rounded-card` surface, `hairline` border and `shadow-modal`; `FormCard` uses the destructive item variant and a separator before deletion.

### Tables

**`comparison-table`** — Pricing feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`comparison-row`** — Individual feature row.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`.

### Documentation Components

**`whiteboard-mockup`** — Real Miro-board UI rendered as feature illustration.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, border `1px solid {colors.hairline-soft}`, shadow `rgba(5, 0, 56, 0.08) 0px 12px 32px -4px`.

**`template-card`** — Template thumbnail card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.md}`, border `1px solid {colors.hairline}`.

**`industry-tile`** — Industry-vertical tile.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.

**`faq-accordion-item`** — FAQ panel item.
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, bottom border `1px solid {colors.hairline}`.

**`logo-wall-item`** — Customer logo wordmark cell.
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.

**`capterra-badge`** — Review/rating badge in the footer.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.caption}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, border `1px solid {colors.hairline}`.

**`app-store-badge`** — App store / Google Play download pill.
- Background `{colors.canvas}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with yellow Miro wordmark + horizontal links + right-side CTAs.
- Background `{colors.canvas}`, height ~64px.
- Left: Yellow square Miro wordmark + horizontal link list (Product, Solutions, Resources).
- Right: "Login / Pricing / Contact sales" links + black-pill "Get started free".

**Implementation mapping (`components/navbar.tsx`)** — Sticky 64px canvas bar with `hairline` bottom border and a light blur. The wordmark is a yellow square plus the serif product name. Desktop links use `body-sm`/500 with a pill hover; guests see a quiet login link and a black-pill register CTA; authenticated users see Dashboard/Chat, a quiet sign-out action and the Clerk avatar. Mobile navigation uses a full-screen `Dialog` with the same wordmark, large serif links and the account actions.

### Signature Components

**`hero-band-marketing`** — Marketing hero band.
- Background `{colors.canvas}`, padding `{spacing.hero}`.
- Layout: centered headline in `{typography.hero-display}`, centered subtitle, centered button row, then whiteboard mockup illustration below.

**`cta-banner-dark`** — Dark CTA banner at the bottom of feature pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, rounded `{rounded.feature}`, padding `{spacing.section}`. Centered headline + subtitle + `button-on-dark` "Get started free".

**`footer-region`** — Massive multi-column dark footer.
- Background `{colors.footer-bg}`, padding `{spacing.section} {spacing.xxl}`.
- 6-column link grid (Product / Solutions / Tools / Resources / Company / Plans & Pricing).
- Section headings in `{typography.body-md-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual link in the footer.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

**Implementation mapping (`components/footer.tsx`)** — Dark `footer` surface with a brand-intro column plus Producto, Recursos and Cuenta link groups (the app does not yet have enough routes for six columns). Links use `on-dark-muted` with an `on-dark` hover; the bottom bar carries the credit and GitHub link. The shell (`app/(dashboard)/layout.tsx`) is a `min-h-dvh` flex column, so the footer stays at the bottom on short pages.

## Do's and Don'ts

### Do
- Reserve `{colors.brand-yellow}` for the wordmark, top promo banner, and "yellow tag" chips
- Use `{colors.primary}` (black) as the dominant CTA on all surfaces
- Pair pastel feature cards (yellow, rose, coral, teal) with white feature cards in the same viewport
- Apply `{rounded.full}` to every button, every pill tab, every status badge
- Apply `{rounded.xxxl}` (28px) to pastel feature cards
- Use real Miro-board mockups as feature illustrations
- Maintain Roobert PRO across every UI surface

### Don't
- Don't use `{colors.brand-yellow}` on standard CTAs or large background surfaces
- Don't introduce additional accent colors beyond yellow + brand pastels
- Don't soften corners on buttons; the pill is a brand signature
- Don't reduce hero leading below 1.05
- Don't apply heavy shadows on flat documentation cards; reserve elevation for whiteboard mockups
- Don't use stock photography — show the live product board UI

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 36px. Pill nav collapses to hamburger. Pricing tiers stack 1-up. |
| Mobile (large) | 480 – 767px | Feature tiles 2-up. Hero scales to 48px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. |
| Desktop | 1024 – 1279px | 4-tier pricing card row. Customer story grid 2-up. Hero at 64px. |
| Wide Desktop | ≥ 1280px | Full hero presentation, 80px hero display. |

### Touch Targets
- Pill buttons render at 40–44px effective height — at WCAG AAA floor
- Circular icon buttons: 36×36px desktop → 44×44px mobile
- Form inputs render at 44px height
- Filter dropdowns render at ~36px tall — bumps to 44px on mobile

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger
- **Hero band**: 2-column hero collapses to stacked at < 1024px
- **Pricing comparison**: 4-column tiers → 2-column tablet → 1-column mobile; comparison table becomes horizontal-scroll
- **Customer story grid**: 2-up → 1-up at < 768px
- **Hero typography**: 80px → 60px tablet → 48px mobile-large → 36px mobile-small
- **Footer**: 6-column desktop → 3-column tablet → 2-column mobile → accordion at small mobile

### Image Behavior
- Whiteboard mockups maintain aspect ratio; lazy-loaded below the fold
- Customer story photography uses 16:9 ratio with full-bleed scaling
- Logo wall presents wordmarks at consistent 100px height

## Iteration Guide

1. Focus on ONE component at a time
2. Reference component names and tokens directly
3. Run `npx @google/design.md lint DESIGN.md` after edits
4. Add new variants as separate `components:` entries
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis
6. Keep `{colors.brand-yellow}` confined to wordmark, promo banner, and yellow-tag chips
7. Pill-shaped buttons (`{rounded.full}`) always
8. When showing the product, use a real Miro-board mockup with sticky-note color tints

## Token Contract (Implementation)

These CSS custom properties are the implementation contract. They live in `app/globals.css` and are exposed to Tailwind through `@theme inline`. The application is light-first (`defaultTheme="light"`), with dark available through the theme toggle. The existing semantic tokens (`--background`, `--foreground`, `--primary`, `--border`, etc.) now alias the `--ds-*` contract, so they already drive the global palette while components are migrated one by one.

### Color Tokens

| Token | Light | Dark |
|---|---|---|
| `--ds-canvas` | `#ffffff` | `#0f0f0f` |
| `--ds-surface` | `#f7f7f5` | `#171717` |
| `--ds-surface-soft` | `#fafaf8` | `#1c1c1c` |
| `--ds-surface-yellow` | `#fff8db` | `#2a2308` |
| `--ds-surface-featured` | `#f0efff` | `#1e1b33` |
| `--ds-hairline` | `#e6e6e2` | `#2e2e2e` |
| `--ds-hairline-soft` | `#efefec` | `#262626` |
| `--ds-hairline-strong` | `#d0d0ca` | `#3d3d3d` |
| `--ds-ink-deep` | `#111111` | `#ffffff` |
| `--ds-ink` | `#1a1a1a` | `#f5f5f5` |
| `--ds-charcoal` | `#2b2b2b` | `#e5e5e5` |
| `--ds-slate` | `#5c5c5c` | `#b3b3b3` |
| `--ds-steel` | `#757575` | `#9a9a9a` |
| `--ds-stone` | `#9a9a9a` | `#808080` |
| `--ds-muted` | `#bdbdbd` | `#666666` |
| `--ds-on-dark` | `#ffffff` | `#ffffff` |
| `--ds-on-dark-muted` | `#b8b8b8` | `#a3a3a3` |
| `--ds-brand-yellow` | `#ffd43b` | `#ffd43b` |
| `--ds-brand-yellow-deep` | `#f5c518` | `#f5c518` |
| `--ds-yellow-light` | `#fff3c4` | `#2e2608` |
| `--ds-yellow-dark` | `#5c4300` | `#ffe08a` |
| `--ds-brand-blue` | `#4262ff` | `#7b93ff` |
| `--ds-blue-pressed` | `#2f4bdb` | `#5c78f0` |
| `--ds-brand-coral` | `#ff7a59` | `#ff9b82` |
| `--ds-coral-light` | `#ffe4dc` | `#3a1e16` |
| `--ds-coral-dark` | `#8a2c16` | `#ffc2b3` |
| `--ds-brand-rose` | `#f7c8d8` | `#f48fb1` |
| `--ds-rose-light` | `#fbe4ec` | `#361c26` |
| `--ds-brand-teal` | `#00b8a9` | `#4dd8c8` |
| `--ds-teal-light` | `#d6f5f0` | `#12332f` |
| `--ds-moss-dark` | `#0b5d4e` | `#7fe0c8` |
| `--ds-brand-pink` | `#fde7f0` | `#3a1e2a` |
| `--ds-brand-orange-light` | `#ffe8d2` | `#3a2616` |
| `--ds-success-accent` | `#087443` | `#4ade80` |
| `--ds-brand-red` | `#fde8e8` | `#3a1616` |
| `--ds-brand-red-dark` | `#b42318` | `#f97066` |
| `--ds-primary` | `#111111` | `#f5f5f5` |
| `--ds-on-primary` | `#ffffff` | `#111111` |
| `--ds-footer-bg` | `#111111` | `#0a0a0a` |

Tailwind exposes these as `bg-canvas`, `text-ink`, `border-hairline`, `bg-brand-yellow`, `text-on-dark-muted`, etc. `--ds-muted` maps to `text-disabled` to avoid colliding with the existing `--color-muted`.

### Radius Tokens

| Tailwind utility | Value |
|---|---|
| `rounded-chip` | `4px` |
| `rounded-badge` | `6px` |
| `rounded-input` | `8px` |
| `rounded-card` | `12px` |
| `rounded-panel` | `16px` |
| `rounded-panel-lg` | `20px` |
| `rounded-feature-card` | `28px` |
| `rounded-banner` | `32px` |
| `rounded-pill` | `9999px` |

### Shadow Tokens

| Tailwind utility | Light | Dark |
|---|---|---|
| `shadow-subtle` | `0 1px 2px 0 rgb(5 0 56 / 0.04)` | `0 1px 2px 0 rgb(0 0 0 / 0.30)` |
| `shadow-card` | `0 4px 12px 0 rgb(5 0 56 / 0.06)` | `0 4px 12px 0 rgb(0 0 0 / 0.35)` |
| `shadow-mockup` | `0 12px 32px -4px rgb(5 0 56 / 0.08)` | `0 12px 32px -4px rgb(0 0 0 / 0.45)` |
| `shadow-modal` | `0 16px 48px -8px rgb(5 0 56 / 0.12)` | `0 16px 48px -8px rgb(0 0 0 / 0.55)` |

### Typography Tokens

The hierarchy table above is exposed as `text-hero-display`, `text-display-lg`, `text-heading-1` through `text-heading-5`, `text-subtitle`, `text-body-md`, `text-body-sm`, `text-caption`, `text-micro`, `text-micro-uppercase`, `text-button-md` and `text-stat-display`. Each utility carries its line height and letter spacing. Use `font-display` for Roobert/Plus Jakarta display text.

### Tailwind Merge Extension

`lib/utils.ts` extends `tailwind-merge` with the custom radius, shadow and typography scales. This lets `cn()` resolve conflicts between design-system utilities: for example, `rounded-pill` correctly overrides `rounded-input` on circular ghost icon buttons, and custom text sizes such as `text-button-md` are no longer mistaken for text colors and removed when paired with `text-primary-foreground`.

## Known Gaps

- Dark-mode token values are now defined under `.dark` in `app/globals.css`; this document lists them for reference.
- Animation/transition timings not extracted; recommend 150–200ms ease
- Form validation success state not explicitly captured beyond defaults
- Sticky note color tints inside the actual whiteboard product are richer than what marketing surfaces capture

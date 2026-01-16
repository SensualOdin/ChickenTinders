Design Tokens (UI/UX Relaunch)
Version: 1.0
Date: 2026-01-15
Owner: Product + Design

These tokens bridge the Supabase/Tailwind implementation and Figma design files.
They follow a semantic naming convention so changing a token updates all UI.

1) Color System (WCAG AA Compliant)
We are using a Food-Centric / Sophisticated palette. The primary color is a
refined "Golden Honey" to evoke appetite without looking like fast-food yellow.

Brand & Semantic Tokens
- color.brand.primary: #F5A623 (Primary buttons, active states, Gold matches)
- color.brand.secondary: #4A90E2 (Secondary actions, hype info toasts)
- color.surface.main: #FFFCF9 (App background, soft off-white)
- color.surface.card: #FFFFFF (Restaurant cards, modal backgrounds)
- color.text.display: #1A1A1A (Headings, Fraunces)
- color.text.body: #4F4F4F (Body text and descriptions, DM Sans)
- color.text.muted: #9CA3AF (Placeholder text, secondary hints)
- color.feedback.success: #27AE60 ("Yes" swipe, match confirmed)
- color.feedback.error: #EB5757 ("No" swipe, dietary conflict alerts)
- color.feedback.warning: #F2C94C (Bronze/Wildcard matches, in-progress states)
- color.neutral.gray200: #E5E7EB (Disabled states, low-contrast UI)

2) Typography Scale
Fraunces for personality and DM Sans for utility.

Headings (Fraunces - Variable Weight)
- type.h1: 32px / Bold (700) / 1.2 line height (Main landing/results)
- type.h2: 24px / SemiBold (600) / 1.3 line height (Screen headers)
- type.h3: 20px / Medium (500) / 1.4 line height (Card titles)

Body & UI (DM Sans)
- type.body.large: 18px / Regular (400) / 1.6 line height (Descriptions)
- type.body.base: 16px / Regular (400) / 1.5 line height (Standard text)
- type.label.bold: 14px / Bold (700) / 1.0 line height (Button labels/badges)
- type.caption: 12px / Regular (400) / 1.4 line height (Secondary info/time)

3) Spacing & Radius (4pt Grid)
Spacing
- space.xs: 4px
- space.sm: 8px (Small padding, gap between elements)
- space.md: 16px (Standard page padding, card internal padding)
- space.lg: 24px (Section spacing)
- space.xl: 32px (Header to content spacing)

Corner Radius
- radius.sm: 4px (Small tags/badges)
- radius.md: 12px (Input fields, small buttons)
- radius.lg: 20px (Restaurant swipe cards, bottom sheets)
- radius.full: 999px (Pill buttons, avatars)

4) Effects & Motion
- shadow.card: 0px 4px 20px rgba(0, 0, 0, 0.08) (Swipe stack)
- shadow.overlay: 0px 10px 40px rgba(0, 0, 0, 0.15) (Modals, hype toasts)
- motion.standard: 250ms ease-in-out (Page transitions)
- motion.swipe: 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275) (Swipe spring)

5) UI Component States
- Default: Standard interactivity -> color.brand.primary
- Hover/Pressed: 10% darker than default -> color.brand.primary.dark
- Disabled: Low contrast/grayed out -> color.neutral.gray200
- Focused: Accessibility ring -> 2px solid color.brand.secondary

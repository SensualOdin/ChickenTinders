---
name: premium-web-design
description: Create ultra-professional, award-worthy websites with $50K+ agency-level quality. Use when building premium marketing sites, luxury brand experiences, interactive portfolios, or any project requiring exceptional UI/UX, sophisticated animations, and polished design systems. Covers micro-interactions, GSAP/WebGL animations, typography systems, color theory, Core Web Vitals optimization, WCAG accessibility, and Awwwards-level visual design. Triggers on requests for high-end websites, luxury design, award-winning UI, professional web development, or agency-quality work.
---

# Premium Web Design

Create websites that command $50,000+ through exceptional craft, strategic restraint, and obsessive attention to detail.

## Core Philosophy

**Luxury design isn't about adding — it's about restraint.** Every element must justify its presence. Premium websites don't beg for attention; they command it through:
- Purposeful whitespace that creates perceived value
- Slow, deliberate motion that builds anticipation
- Tactile interactions mimicking physical response
- Personalized, dynamic experiences

## Workflow

1. **Discovery** → Define purpose, audience, tone, differentiation
2. **Design System** → Establish tokens, components, patterns
3. **Visual Design** → Typography, color, layout, imagery
4. **Interaction Design** → Micro-interactions, animations
5. **Development** → Clean, performant code with proper semantics
6. **Optimization** → Performance and accessibility
7. **Polish** → Obsessive refinement of every detail

## Design Principles

### The Luxury Mindset
- **Sparse navigation** — Clean, minimal menus
- **Ambient visuals** — Atmospheric backgrounds and effects
- **Smooth scroll animations** — Deliberate, refined transitions
- **Custom cursors** — Branded, reactive pointer states
- **Intentional pacing** — Nothing rushes the user

### Visual Hierarchy
Apply the **60-30-10 rule** for color:
- 60% dominant hue (backgrounds, large areas)
- 30% secondary color (supporting elements)
- 10% accent color (CTAs, highlights)

### Typography Essentials
- **Maximum 2-3 typefaces** per project
- **Clear hierarchy**: H1 → H2 → H3 → body → captions
- **Minimum contrast**: 4.5:1 for body text (WCAG AA)
- **Line height**: 1.5-1.7× font size for body text

Font psychology:
- Serifs (Didot, Garamond) → Heritage, luxury, editorial
- Sans-serifs (Helvetica Neue, Inter) → Modern, minimal, clean
- Display fonts → Personality, impact (use sparingly)

### Color Psychology
| Color | Associations | Use Cases |
|-------|--------------|-----------|
| Black/Dark | Luxury, power, sophistication | Premium brands, fashion |
| Deep Navy | Trust, stability, professionalism | Corporate, finance |
| Gold/Warm Neutrals | Elegance, exclusivity | Luxury, hospitality |
| Muted Earth Tones | Organic, authentic, grounded | Lifestyle, wellness |

**Avoid**: Loud saturated hues, generic purple gradients, predictable blue CTAs.

## Animation Guidelines

### Timing Standards
| Interaction Type | Duration | Use Case |
|-----------------|----------|----------|
| Instant feedback | 100-200ms | Button clicks, toggles |
| Standard transitions | 200-300ms | Hover states, reveals |
| Complex animations | 300-500ms | Page transitions, modals |
| Luxury/deliberate | 500-1000ms+ | Scroll-triggered reveals |

### Micro-Interaction Principles
- **Hover effects that feel too fast = cheap.** Deliberate fades = control.
- **Skeleton screens** over spinners for loading states
- **Real-time validation** for forms (green checkmarks, inline feedback)
- **Scroll-triggered reveals** with staggered timing
- **Custom cursors** that react to context

### Animation Technologies
- **CSS** → Simple hovers, fades, spinners
- **GSAP** → Complex sequences, scroll-linked effects, timelines
- **Three.js/WebGL** → 3D scenes, immersive experiences, shader effects
- **Lottie** → Vector animations, icons, illustrations

## Performance Requirements (Core Web Vitals)

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** | < 2.5s | Main content load time |
| **INP** | < 200ms | Interaction responsiveness |
| **CLS** | < 0.1 | Visual stability |

Critical optimizations:
- Add `fetchpriority="high"` to LCP images
- Use `font-display: swap` and preload critical fonts
- Lazy load below-fold images with proper `width`/`height` attributes
- Code-split JavaScript, defer non-critical scripts
- Use skeleton screens to prevent layout shifts

## Accessibility (WCAG 2.1 AA)

Non-negotiable requirements:
- **Color contrast**: 4.5:1 minimum for text, 3:1 for UI elements
- **Keyboard navigation**: All interactive elements accessible
- **Focus indicators**: Visible on all focusable elements
- **Alt text**: Meaningful descriptions for all images
- **Semantic HTML**: Proper heading hierarchy, landmarks, ARIA labels
- **Reduced motion**: Respect `prefers-reduced-motion` media query

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Award-Winning Criteria (Awwwards)

Sites are judged on:
- **Design** — Visual aesthetics, creativity, originality
- **Usability** — UX, navigation, accessibility
- **Creativity** — Innovation, unique approaches
- **Content** — Quality, relevance, presentation

What separates winners:
- Design for humans, not judges
- Break rules responsibly (weird layouts, exaggerated dimensions)
- Great storytelling and art direction
- Obsessive attention to micro-interactions
- Mobile excellence (must score 70+ on Google Mobile Guidelines)

## Technology Stack

### Recommended Frameworks
| Tool | Best For |
|------|----------|
| **Next.js** | SSR, SSG, full-stack React, SEO-critical sites |
| **React** | Complex SPAs, component libraries |
| **Webflow** | Designer-friendly, rapid prototyping, CMS |
| **Astro** | Content-heavy sites, performance-critical |

### Design Tools
- **Figma** — UI design, prototyping, design systems
- **GSAP** — Web animations (ScrollTrigger, Timeline)
- **Three.js** — 3D/WebGL experiences

## Quick Reference: Luxury Visual Checklist

- [ ] Custom typography (no Arial, Roboto, system fonts)
- [ ] Cohesive color palette with clear hierarchy
- [ ] Generous whitespace and breathing room
- [ ] Deliberate, smooth animations (not too fast)
- [ ] Custom cursor or pointer states
- [ ] Scroll-triggered reveals with stagger
- [ ] High-quality imagery (no generic stock)
- [ ] Consistent spacing system (8px base grid)
- [ ] Mobile-first responsive design
- [ ] Keyboard accessible with visible focus states
- [ ] Performance optimized (LCP < 2.5s)
- [ ] Semantic HTML structure

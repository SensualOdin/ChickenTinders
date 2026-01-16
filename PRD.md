ChickenTinders PRD (UI/UX Relaunch)
Version: 1.2 (Final Integrated Draft)
Date: 2026-01-15
Status: Ready for Implementation
Owner: Product + Design

Design system tokens are defined in `DESIGN_TOKENS.md`. All UI references in this PRD
use semantic tokens only (no hardcoded hex values).

1) Vision
To transform group dining from a source of friction into a premium social experience.
ChickenTinders makes reaching a consensus effortless, visually stunning, and
psychologically rewarding through real-time "hype" and intelligent match logic.

2) Problem Statement
While the core "swipe-to-match" mechanic works, the current version feels like a
utility rather than an experience. Inconsistent UI components, high cognitive load
during setup, and "dead air" while waiting for friends to finish swiping lead to
high drop-off rates. We need an intentional, premium ecosystem that keeps users
engaged from "Create" to "Directions."

3) Strategic Goals
- Aesthetic Authority: Establish a "sophisticated but approachable" brand using
  Fraunces and DM Sans.
- Social Momentum: Eliminate the "waiting boredom" with a real-time Hype Feed.
- Conflict Resolution: Use intelligent filtering to handle dietary contradictions
  (e.g., Vegan vs. Steakhouse) before the swipe begins.
- Retention: Implement "My Groups" and "Default Filters" to make re-running a
  Friday night session a one-tap action.

4) UX Principles
- Psychological Hype: Use micro-interactions to build anticipation for results.
- Intentional Minimalism: Every button and label must justify its existence.
- Fast Feedback: Real-time updates on who is in, who is swiping, and who is finished.
- Zero-End-State: Never show an empty screen without a clear "Next Step."

5) Feature Requirements
5.1 Smart Group Creation
- Dietary Logic: If conflicting tags are selected (e.g., "Keto" and "Bakery"), the
  UI alerts the host and suggests a "Vibe: Variety" filter to ensure everyone has
  an option.
- Saved Context: Logged-in users can load "The Office Crew" or "Saturday Smokeout"
  presets to instantly populate radius, price, and member lists.
- Location Fallback: If GPS is denied, provide a premium Zip Code/Neighborhood
  entry view.

5.2 The Lobby & Hype Feed
- Real-Time Status: Avatars display active states: Joined, Swiping, or Finished.
- The Feed: A bottom-sheet display showing activity toasts:
  - "Sarah is on a roll! (10 swipes)"
  - "A unanimous match is brewing..."
  - "Someone just super-liked a BBQ joint!"

5.3 The Swipe Experience
- Match Strength Logic: Uses a weighted scoring system to rank results:
  Score = (Likes * 1) + (Superlikes * 2)
- Haptics: Subtle vibrations on "Yes"; a distinct double-pulse for a "Match detected."
- Wait State: Once a user finishes, they transition to a "Chill Screen" showing the
  Hype Feed and a progress ring of remaining members.

5.4 Results Hierarchy
- Gold (Unanimous): 100% of the group said "Yes." Triggers a celebration animation.
- Silver (Majority): >50% of the group said "Yes."
- Bronze (The Wildcard): At least one "Superlike" exists, highlighting a
  high-interest outlier.

6) UI System Requirements
6.1 Typography & Color
- Headings: Fraunces (Soft-bold).
- Body/UI: DM Sans.
- Palette: Semantic tokens only (e.g., surface.primary, action.success). Token
  values live in `DESIGN_TOKENS.md`.

6.2 Component Checklist
- Swipe Card: Must maintain 60fps; use skeleton loaders for restaurant images.
- Progress Ring: Visual indicator of group completion percentage.
- Hype Toast: Non-modal, auto-dismissing notifications for social activity.
- Match Card: Visual distinction between Gold, Silver, and Bronze tiers.

7) Technical Logic (Supabase Integration)
- Realtime Broadcast: Use for "Hype Feed" events to minimize database writes.
- Postgres Views: Calculate "Match Strength" on the server side so the client only
  needs to listen for the completed status change.
- Persistence: Sessions remain active in the sessions table for 24 hours to allow
  for "Active Session" resumes if a user closes their app.

8) Analytics & Success Metrics
- Funnel Efficiency: Track landing -> lobby -> results.
- The "Wait" Churn: Measure drop-off rates specifically during the
  "Waiting for others" state.
- Decision Velocity: Time taken from "Group Created" to "Get Directions" clicked.

9) Risks & Open Questions
- API Latency: Third-party image hosting (Yelp/Google) may slow down swiping.
  Mitigation: Pre-fetch the next 5 cards in the background.
- Ghosting: What happens if a member starts swiping but never finishes?
  Mitigation: Host can "Force End" the session after a majority have finished.
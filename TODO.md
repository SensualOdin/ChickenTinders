Refactor TODO (PRD + Design Tokens)
Last update: 2026-01-15

Completed
- Audit routes and map to PRD features.
- Add semantic tokens to Tailwind/CSS and token file.
- Wire Fraunces and DM Sans typography in layout.
- Refactor landing (`app/index.tsx`) to semantic tokens.
- Refactor create flow (`app/create.tsx`) to semantic tokens.
- Refactor lobby (`app/lobby/[id].tsx`) to semantic tokens + initial hype feed.
- Tokenize core UI components (Button, Input, Card, Badge, Modal, InfoCard, Avatar).
- Tokenize dietary selector (`components/ui/DietaryTagSelector.tsx`).

In Progress
- Continue UI component token cleanup where legacy classes remain.
- Refactor remaining screens to semantic tokens.
- Expand Hype Feed from local events to realtime broadcast.

Next Up
- Refactor swipe experience (`app/swipe/[id].tsx`) for tokens + wait state.
- Refactor results (`app/results/[id].tsx`) for Gold/Silver/Bronze hierarchy.
- Add progress ring and chill screen for finished members.
- Implement weighted match scoring view (server-side) and client listener.
- Session persistence + ghosting rules (force end + quorum behavior).
- Add analytics hooks for funnel, wait churn, decision velocity.

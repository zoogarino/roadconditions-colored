## Plan: Final Prototype Polish

Five additions to complete the Road Conditions prototype. Most building blocks already exist (RoadHistoryScreen, lifecycle.ts, toast helper, mockData with isPinned). I'll fill the gaps and polish styling per spec.

### 1. Road History View — enhance existing screen
File: `src/components/forum/RoadHistoryScreen.tsx`
- Add summary card (📊 Condition History: count, avg duration, most recent status) using warm sand styling
- Restyle timeline items with colored left borders (red=active, green=resolved, muted=archived) and status badges
- Add vertical connector line down the left side
- Add empty state when only 1 post for the road
- Update header to show "Road History" label + large navy road name

File: `src/components/forum/DetailScreen.tsx`
- Verify "View road history" related-history banner uses warm sand bg + blue link (already partially done; tighten styling)

### 2. Pinned Post Card
File: `src/components/forum/PostCard.tsx`
- When `post.isPinned`, render an alternate layout: thicker terracotta border, warm-tint bg, "📌 PINNED" blue badge top-right, larger navy title, "Created by PGN Team" line, divider, "Latest traveler updates" section with 2 mini reply cards, footer with reply count + "Add your update" link
- Use mock pinned post already in `mockData.ts` (verify content; add mini-replies field if needed)

File: `src/data/mockData.ts`
- Add `miniReplies` array on the pinned post (2 entries) if not present

### 3. Status Transition Animations
File: `src/index.css` (or tailwind config)
- Add keyframes: `banner-slide-down`, `banner-collapse`, `badge-slide-in`, `card-slide-out-left`, `confirm-pulse`
- Utility classes for the 3 sequences

File: `src/components/forum/DetailScreen.tsx` (or wherever the warning banner + confirm buttons live)
- Wire animation classes: banner uses fade+slide-down on mount; on "Still active" → banner collapses, confirm badge slides up; on "Resolved" → green badge slides in, card slides left/fades on Active feed
- Toasts fire from existing `showToast` helper

### 4. Detailed Toast Variations
File: `src/pages/Index.tsx` (where `showToast` lives) or shared toast component
- Extend toast types: `success` (green #10B981 ✓), `info` (blue #29ABE2 ✓), `warning` (orange #F59E0B ⚠️), `error` (red #EF4444 ✕), `progress` (terracotta #D4854A ⏳ animated, no auto-dismiss)
- Slide-up + fade animation, swipe/tap to dismiss, single-toast replacement
- Standardized width/position/shadow per spec

### 5. Open Graph Image Mockup screen
New file: `src/pages/previews/OGImagePreview.tsx`
- Three 1200:630 mockup cards: Severe Flooding (red/yellow/red), Moderate Construction (orange), Minor Potholes (green)
- Dark map-tinted background, severity circle top-left, large white road name, condition + severity text, "POCKET GUIDE NAMIBIA" branding bottom-left
- Caption beneath image
- Route added in `src/App.tsx` at `/previews/og-image`
- Link added in `src/components/DemoLinksMenu.tsx`

### Technical notes
- All colors via existing tokens in `index.css` / `tailwind.config.ts` (pgn-navy, pgn-terracotta, pgn-sand, severe/moderate/minor, pgn-blue)
- Animations are CSS transform/opacity only for 60fps
- No backend changes; pure presentation/state work

After implementation I'll verify in the preview that the road history screen, pinned card, and OG mockup render correctly.
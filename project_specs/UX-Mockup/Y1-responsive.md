---

## Responsive Considerations

---

### Breakpoints

| Breakpoint | Range | Layout Mode |
|------------|-------|-------------|
| Desktop | > 1024px | Full two-column layout (filter sidebar + content) |
| Tablet | 768px – 1024px | Collapsible sidebar; content area full-width with filter drawer |
| Mobile | < 768px | Single column; stacked layout; filter drawer on demand |

---

### Desktop (> 1024px)

**Home:**
- Hero section full-width; search bar centered, ~600px wide
- Featured records: horizontal card strip, 3–4 cards visible
- Action paths: 3-column card row

**Catalog / Search:**
- Filter panel: visible left sidebar, ~280px fixed width
- Results: 2-column card grid, or 1-column list (user preference if implemented)
- Filter chips: single row above result count

**Innovation Record:**
- Full-width content, max ~900px centered
- Perspective toggle: segmented button, horizontally laid out
- Sections: full width with consistent left padding
- Side-by-side layout for Maturity and Review Status in both perspectives
- CTAs at bottom: horizontal row

**Curator Screens:**
- Sidebar: ~240px fixed, always visible
- Content: remaining width, max ~1200px
- Record Management table: all columns visible; horizontal scroll on narrower desktop
- Record Editor: left section nav (~200px) + right content area

---

### Tablet (768px – 1024px)

**Home:**
- Hero section full-width; search bar ~90% width
- Featured records: horizontal card strip, 2 cards visible + partial 3rd
- Action paths: 3-column or 2-column layout depending on viewport

**Catalog / Search:**
- Filter panel: **collapsed by default**; "Filters" button opens a slide-over drawer from the left
- Active filter chips visible above results even when drawer is closed
- Results: 1-column card list (not grid) for readability

**Innovation Record:**
- Full-width; single column
- Perspective toggle: same horizontal segmented button
- CTAs: may stack to 2 columns

**Curator Screens:**
- Sidebar: collapsible to icon-only rail (hamburger toggle in header)
- Content: full remaining width
- Record Management: horizontal scroll on table; priority columns (title, state, actions) remain sticky
- Record Editor: section nav moves to top tab bar; content below

---

### Mobile (< 768px)

**Home:**
- Hero section stacks vertically
- Search bar full-width
- Featured records: horizontal scroll strip, 1 card fully visible + partial next
- Action paths: single column, stacked cards

**Catalog / Search:**
- Filter panel: **hidden by default**; "Filters (3 active)" button opens full-screen drawer
- Results: single column list
- Filter chips: wrapped, scrollable row
- Result count: visible above chips

**Innovation Record:**
- Single column; sections stack vertically
- Perspective toggle: same control; ensure min touch target 44×44px
- Maturity and review status badges: stacked vertically in header if needed
- Applicable disclaimer: full-width notice block
- CTAs: full-width stacked buttons
- Artifact links: each artifact card full-width; "View" button accessible as large touch target

**Opportunity / Contribution Forms:**
- Single column; step indicator compresses to "Step 2 of 4" text label (no visual steps on very small screens)
- All form fields full-width
- Navigation buttons (Back / Next) full-width, stacked with Next on top (primary action)

**Engagement Request Modal:**
- Full-screen overlay on mobile (not a centered modal box)
- Close button top-right; large touch target
- All fields full-width, stacked

**Curator Screens (mobile — degraded but functional):**
- Sidebar: off-canvas, toggle with hamburger icon in header
- Dashboard: summary cards stack single column
- Record Management table: priority columns only (title, state, actions); tap row to expand details
- Record Editor: section nav becomes accordion; each section expands/collapses; bottom action bar remains persistent

---

### Touch Target Requirements

All interactive elements on mobile and tablet must meet WCAG 2.1 minimum touch target size:
- Minimum 44×44px effective touch target for buttons, links, checkboxes, radio buttons
- Filter checkboxes: ensure label extends the touch target
- Maturity/review status badge links (if interactive): extend padding to meet minimum

---

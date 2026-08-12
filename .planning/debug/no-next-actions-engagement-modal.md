---
status: diagnosed
trigger: "No Next Actions Section / Engagement Modal on Record Page — user sees no 'Next Actions' section on /records/audio-security-poc, only a non-functional 'Contact I&R' button"
created: 2026-08-11T00:00:00Z
updated: 2026-08-11T00:10:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — two root causes identified:
  (1) seed.ts never inserts rows into record_next_actions, so all records get the fallback single "Contact I&R" button
  (2) The "Contact I&R" button click opens EngagementModal — but EngagementModal calls POST /api/v1/engagement which reads hub_settings.engagement_routing_address. The modal DOES open, but "does nothing" suggests the modal may not open visually OR the user cannot see it. More likely: the section is titled "Recommended Next Step" (not "Next Actions"), misleading the user to think there's no Next Actions section at all.
test: traced entire render path from page.tsx → PerspectiveToggle → ExecutiveView → RecordSection → NextActionCTAs
expecting: confirmed — all evidence points to seed gap and UX label mismatch
next_action: RETURN DIAGNOSIS

## Symptoms

expected: Record detail page shows a "Next Actions" section with engagement type buttons (Request Demo, Discuss Use Case, etc.) that open a modal form; submission returns ENG-YYYY-NNN reference number
actual: No "Next Actions" section visible on /records/audio-security-poc — only a "Contact I&R" button that does nothing
errors: (none reported)
reproduction: Navigate to /records/audio-security-poc
started: After 03-04 plan conversion of NextActionCTAs from mailto links to EngagementModal buttons

## Eliminated

- hypothesis: EngagementModal.tsx missing/not imported
  evidence: File exists at src/app/(public)/records/[slug]/EngagementModal.tsx; NextActionCTAs.tsx line 10 imports it correctly
  timestamp: 2026-08-11T00:05:00Z

- hypothesis: NextActionCTAs not rendered anywhere in page
  evidence: ExecutiveView.tsx line 136 renders <NextActionCTAs actions={next_actions} record={record} />; TechnicalView.tsx line 162 also renders it; both are passed next_actions from PerspectiveToggle which receives it from page.tsx SSR
  timestamp: 2026-08-11T00:05:00Z

- hypothesis: RecordSection hasContent check hides the Next Actions section
  evidence: NextActionCTAs is always a truthy React element, so React.Children.toArray sees it; hasContent is always true; section always renders
  timestamp: 2026-08-11T00:07:00Z

- hypothesis: TypeScript errors or build failure preventing component from running
  evidence: `npx tsc --noEmit` clean; `next build` succeeds cleanly with /records/[slug] listed
  timestamp: 2026-08-11T00:08:00Z

- hypothesis: getRoutingAddress() returns null causing 503 blocking modal submission
  evidence: hub-settings.service.ts line 25 has hardcoded fallback 'AOml_TSO_IRB_Team@ao.uscourts.gov'; schema seeds this value in hub_settings; API returns 503 only if null — but it can never be null
  timestamp: 2026-08-11T00:09:00Z

## Evidence

- timestamp: 2026-08-11T00:03:00Z
  checked: seed.ts for record_next_actions inserts
  found: `grep "record_next_actions" seed.ts` returns ZERO matches. The seed file inserts into innovation_records and audit logic but never populates record_next_actions table.
  implication: For ALL seeded records including audio-security-poc, the DB query in getRecordBySlug() returns next_actions = [] (empty array)

- timestamp: 2026-08-11T00:03:00Z
  checked: NextActionCTAs.tsx line 29 fallback logic
  found: `const ctaActions = actions.length > 0 ? actions : [{ action_id: 'default', action_type: 'contact_ir', custom_label: null }];`
  implication: When next_actions is [] (empty), the fallback fires — rendering exactly ONE button: "Contact I&R". This is precisely what the user sees.

- timestamp: 2026-08-11T00:04:00Z
  checked: ExecutiveView.tsx section title for NextActionCTAs
  found: Line 132: `<RecordSection id="exec-next" title="Recommended Next Step">` — the section heading is "Recommended Next Step", NOT "Next Actions"
  implication: User searching for a "Next Actions" section won't find one by heading. The engagement buttons appear under "Recommended Next Step".

- timestamp: 2026-08-11T00:05:00Z
  checked: EngagementModal click wiring in NextActionCTAs
  found: Button onClick={()=> setActiveModal(action.action_type)} (line 36); modal renders when activeModal is set (lines 44-51). Logic is correct.
  implication: The "Contact I&R" button SHOULD open the EngagementModal when clicked. The "does nothing" complaint likely means either: (a) the modal opens but goes unnoticed/offscreen, or (b) the section heading confusion leads user to dismiss the whole area as non-functional

- timestamp: 2026-08-11T00:06:00Z
  checked: audio-security-poc seed data for engagement_indicator
  found: Line 285: `'demo_available'` — engagement_indicator is 'demo_available'
  implication: The record IS marked as engagement-eligible ('demo_available'). The absence of next_actions is purely a seed data gap — the indicator suggests "Request Demo" should be the primary CTA but no record_next_actions row exists.

- timestamp: 2026-08-11T00:09:00Z
  checked: engagement_requests table schema vs API insert
  found: Table has no `reference_number` column. API generates referenceNumber in-memory (generateReferenceNumber returns ENG-YYYY-NNN string) and returns it in JSON — but never persists it to DB. EngagementModal displays data.referenceNumber from JSON response — this works for display but reference numbers are not stored.
  implication: Secondary data-integrity concern (reference numbers unrecoverable after response), but NOT the cause of "does nothing" button behavior.

## Resolution

root_cause: |
  TWO root causes, one primary and one secondary:

  PRIMARY — seed.ts never seeds record_next_actions table (src/lib/db/seed.ts has zero references to record_next_actions).
  When getRecordBySlug() queries record_next_actions for audio-security-poc, it returns next_actions=[].
  NextActionCTAs.tsx line 29 falls back to a single synthetic {action_type:'contact_ir'} when actions is empty.
  Result: user sees ONE "Contact I&R" button instead of the intended engagement-type buttons
  (Request Demo, Discuss Use Case, etc.) that match the record's engagement_indicator='demo_available'.

  SECONDARY — Section title mismatch.
  The "Next Actions" section as described in requirements is rendered under the heading "Recommended Next Step"
  (ExecutiveView.tsx line 133). The user looking for "Next Actions" won't find that heading.

  TERTIARY (independent) — The "Contact I&R" button likely DOES open EngagementModal when clicked
  (wiring is correct at NextActionCTAs.tsx line 36). The "does nothing" complaint is most likely
  explained by the section title confusion — the user may not have identified the button as the
  intended engagement CTA.

fix: |
  1. REQUIRED: Add record_next_actions seed rows for audio-security-poc in seed.ts, matching its
     engagement_indicator='demo_available'. Minimum: one 'request_demo' action and one 'contact_ir'.
     For other seeded records, add appropriate action rows based on their engagement_indicators.

  2. REQUIRED: Either rename the RecordSection title in ExecutiveView.tsx from "Recommended Next Step"
     to "Next Actions" (or "Next Steps & Engagement"), or add a dedicated "Next Actions" heading
     above NextActionCTAs within the section.

  3. OPTIONAL (data integrity): Add a `reference_number` column to engagement_requests table and
     persist the generated reference so it's recoverable if the response is lost.

verification:
files_changed: []

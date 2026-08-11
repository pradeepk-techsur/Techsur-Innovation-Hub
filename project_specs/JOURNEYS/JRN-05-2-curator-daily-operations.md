### JRN-05.2: Manage Daily Curator Operations

**Persona:** PER-05 (Jasmine Okafor)
**Scenario:** It is Monday morning. Jasmine opens the curation interface to begin her day. Over the weekend, two opportunity submissions arrived, one innovation contribution was filed, and a published record has passed its next-review date. An engagement request also came in on Friday afternoon without a recorded follow-up. Jasmine's goal is to work through the dashboard, triage everything that needs attention, update records, disposition submissions, and record follow-up status — ideally within 30 minutes — so nothing stale persists without a governance signal and nothing waits more than one business day for an initial I&R response.
**Related Jobs:** JTBD-05.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Open Dashboard | Opens curation interface; reads curator summary dashboard showing live counts: records needing review action (1), new opportunity submissions (2), new contribution submissions (1), engagement requests without follow-up (1) | Curator Summary Dashboard (F9.1) | "What needs attention today? Let me get a full picture before I start working anything specific." | Alert; methodical; slightly anxious on Monday because weekend volume is unknown | Currently tracks this manually in a spreadsheet and checks multiple email inboxes — counts are always stale | Dashboard aggregates all pending action items from live product data: no spreadsheet, no inbox triage, no manual date-checking |
| Work Opportunity Queue | Opens opportunity submission queue; reads each submission with full context fields; dispositions the first submission (relevant — marks as "Under Review," notes portfolio fit); dispositions the second (out of scope — marks as "Declined," records rationale) | Opportunity Submission Queue (F9.12) | "Does this submission have enough context for me to assess feasibility? Who submitted it and from which office? Is this something we can realistically explore?" | Focused; decisive on clear cases; uncertain on ambiguous ones | Submissions arrive via email without standard fields — I&R cannot assess feasibility without a back-and-forth to gather missing context | Submission queue displays all context fields (affected users, workflow description, impact, constraints, submitting office) in a standard layout; disposition options are explicit workflow states (New → Under Review → Accepted / Declined) |
| Work Contribution Queue | Opens contribution submission queue; reads the new innovation contribution; reviews contributing office, contributor names, maturity, artifact links, and collaboration preference; accepts the contribution and initiates record creation | Contribution Submission Queue (F9.13) | "This team submitted an infrastructure experiment. Attribution looks complete. The artifacts are linked. Let me accept this and kick off the curation workflow." | Engaged; satisfied that the contribution arrived with structured context | Contributions arrive informally without a standard format — attribution fields, maturity context, and artifact links must be reconstructed from the original email | Contribution queue displays all F7.2 fields in a structured layout; accepted contributions can directly seed a new record creation workflow, preserving attribution without re-entry |
| Handle Engagement Activity | Opens engagement activity log; finds Friday's engagement request without a recorded follow-up (Technical Guidance request from Priya Suresh on the Audio Security POC); reads the originating record, request type, and her technical question; marks "Follow-up in progress" and adds a note | Engagement Activity (F9.14) | "This request has the originating record attached and a specific technical question. Good. I know exactly who to route this to — the Audio Security POC lead. Let me mark this as in progress." | Organized; confident; would be frustrated if she had to cross-reference an external email thread to find the originating record | Engagement arrives through informal channels without standard context fields — associating a request with the right innovation record requires manual cross-referencing | Engagement log associates each request with the originating record, request type, user context, and follow-up status; no manual cross-referencing required |
| Update Stale Record | Opens the published record flagged for next-review action; reviews content for accuracy; updates last-reviewed date; makes a minor finding correction; saves; verifies the material change is captured in audit history | Record Editing (F9.4), Audit History (F9.11), Record Management List (F9.2) | "This record's last-reviewed date has passed. The content still looks accurate, but I should update one of the findings based on recent technical guidance we received. And I need the audit log to show what changed." | Thorough; responsible for governance continuity | Lifecycle changes and content corrections are not systematically tracked — stale records persist without signals; corrections are not auditable | Audit history captures all material changes (content, governance, lifecycle, configuration) with timestamp and actor; last-reviewed date update is an explicit action with a clear effect on the record's trust signal |

#### Key Moments

- **Decision Point:** Work Opportunity Queue stage — Jasmine decides whether a submission has sufficient context to accept for portfolio consideration or should be declined; this decision affects whether contributors receive a useful response or are left waiting without explanation
- **Risk of Abandonment:** Open Dashboard stage — if the dashboard is not live (e.g., shows stale counts because data is cached or requires manual refresh), Jasmine loses confidence in the tool and reverts to checking inboxes and spreadsheets; the dashboard must be an accurate, live view to be adopted as the primary triage surface
- **Delight Opportunity:** Work Contribution Queue stage — when an accepted contribution can directly seed a new record creation workflow (preserving all attribution fields without re-entry), Jasmine's curation time drops significantly and contributor accuracy is maintained through the full lifecycle

#### Success Outcome

Jasmine opens the curator dashboard and, within 30 minutes, identifies and dispositions all pending action items — two opportunity submissions (one accepted, one declined), one contribution (accepted and seeded into record creation), one engagement request (follow-up status recorded), and one stale record (reviewed and updated with audit history capturing the change) — entirely within the Hub interface, with no reliance on external spreadsheets, email inboxes, or manual date tracking. This satisfies JTBD-05.2 (maintain a unified operational view of queued submissions, pending engagement activity, and records needing lifecycle action, routing follow-up efficiently without external tools).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open Dashboard | F9.1 (Curator Summary Dashboard) |
| Work Opportunity Queue | F9.12 (Opportunity Submission Queue) |
| Work Contribution Queue | F9.13 (Contribution Submission Queue) |
| Handle Engagement Activity | F9.14 (Engagement Activity Review) |
| Update Stale Record | F9.2, F9.4, F9.11 (Record Management List, Record Editing, Audit History) |

---


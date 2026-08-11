## Cross-Journey Patterns

### Common Pain Points Appearing Across Multiple Journeys

- **Discovery depends on prior knowledge (JRN-01.1, JRN-02.1, JRN-03.1, JRN-04.1):** Every consumer persona — Margaret, David, and Priya — arrives not knowing the I&R project name, team, or file location. Carlos arrives not knowing whether overlapping work exists. The Hub's problem-oriented search and catalog (F1, F2) is the single mechanism that resolves this pain across all four journeys. Any degradation in search quality or catalog trust signals affects every primary consumer journey simultaneously.

- **Trust signals must be independently visible at the card level (JRN-01.1, JRN-02.1, JRN-03.1):** All three consumer personas scan catalog cards and make triage decisions before opening a record. If maturity and review status are conflated or visually indistinct at the card level (F1.3, F1.6), Margaret cannot calibrate sponsorship level, David cannot identify adoption-seeking records, and Priya cannot filter to technically reviewed work. False visual equivalence across cards is a cross-cutting trust failure.

- **Engagement initiation is blocked by informal channel friction (JRN-01.1, JRN-02.1, JRN-03.1):** All three consumer personas want to initiate follow-up contact with I&R from the record page (F8.1, F8.2). In each case, the current-state friction is the same: no governed path exists. Engagement Routing (F8) resolves this across all three journeys with a single pattern: CTA → structured form → routed request with originating record context attached.

- **Attribution must survive the submission-to-publication pipeline (JRN-04.1, JRN-05.1):** Carlos needs attribution preserved through the contribution form (F7.3); Jasmine needs it preserved through curation and publication (F9.8). If attribution fields are not carried forward from the contribution submission queue to the record creation interface, contributor credit is lost at the handoff — a cross-journey failure between two otherwise independent flows.

- **Reuse guidance must answer the adopter's specific question, not describe general capability (JRN-02.1, JRN-03.1):** Both David (operational applicability) and Priya (technical portability) read the reuse guidance section (F3.6) for the same underlying question: "What would my team/office need to own and do before using this?" Reuse guidance that describes general value without naming adopter responsibilities, required skills, service dependencies, and environment-specific limitations fails both personas.

### Shared Opportunities Across Multiple Journeys

- **Content Model Reference within curation interface (JRN-05.1, JRN-05.2):** Jasmine consults the content model reference (F9.16) in both curation journeys. Keeping this within the product interface rather than in an external document eliminates context-switching and ensures consistent governance application. This investment pays off across every curation session, not just the first one.

- **One record, two audiences (JRN-01.1, JRN-02.1, JRN-03.1):** Executive and technical perspectives rendered from a single record (F4.1, F4.4) benefit all three consumer personas simultaneously. Margaret reads the executive perspective; Priya reads the technical perspective; David reads both to build the operational case for his division chief. This is a structural product decision that eliminates the need for separate documents across every consumer journey.

- **Explicit non-acceptance language at point of submission (JRN-04.1, JRN-04.2):** Both of Carlos's submission journeys require clear confirmation that submission does not imply acceptance (F6.4, F7.4). Designing this as a prominent, pre-submission display element (rather than footnote or help text) serves both flows and prevents the most common submitter misunderstanding in both cases.

### Convergence Points Where Multiple Personas Interact Through the Hub

- **Innovation Record (F3) as the shared factual foundation:** The record page is where Margaret makes sponsorship decisions, David assesses operational applicability, and Priya evaluates technical reusability. All three consume the same underlying evidence — their perspectives (F4) are rendering choices, not different records. Any content quality issue in the record propagates across all three consumer journeys.

- **Engagement Routing (F8) as the shared exit action:** Every consumer persona journey ends with an engagement request (request demo, request briefing, discuss adoption, request technical guidance). All route through the same CTA → form → routing mechanism (F8.1, F8.2, F8.5). Jasmine receives all of these in the engagement activity log (F9.14) and is responsible for recording follow-up status. The quality of the engagement handoff — whether I&R receives sufficient context in the routed request — determines whether every consumer journey delivers on its promise.

- **Submission queues as the Carlos-to-Jasmine handoff:** Carlos's contribution (JRN-04.1) and opportunity submission (JRN-04.2) flow directly into Jasmine's daily operations (JRN-05.2). The quality of the structured form (F7.2, F6.2) determines whether Jasmine can disposition the submission without a follow-up exchange. A well-structured form makes JRN-04 output usable in JRN-05 without friction.

---


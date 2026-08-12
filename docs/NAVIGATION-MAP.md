# TSIO Innovation Hub — Navigation Map

**Purpose:** Route inventory confirming every route is reachable, has a nav parent,
and is implemented. All routes verified as returning HTTP 200 before launch sign-off.

**Last verified:** 2026-08-12

## Public Routes

| Route | Page | Auth Required | Nav Parent | Implementing Plan | Status |
|-------|------|---------------|-----------|-------------------|--------|
| `/` | Home / Hub entry | None | — (root) | 01-02 | ✓ |
| `/catalog` | Innovation Catalog | None | Main nav "Browse" | 01-02 | ✓ |
| `/records/:slug` | Innovation Record Detail | None (published only) | Catalog card link | 01-03 | ✓ |
| `/search` | Search and Discovery | None | Main nav "Search" | 02-02 | ✓ |
| `/login` | Sign In | None (login page) | Main nav "Sign In" (logged out) | 03-01 | ✓ |
| `/submit-opportunity` | Submit Opportunity | Authenticated | Footer / search CTAs | 03-02 | ✓ |
| `/submit-opportunity/confirmation` | Submission Confirmation | Authenticated | /submit-opportunity form | 03-02 | ✓ |
| `/submit-contribution` | Share Innovation Work | Authenticated | Footer / record CTAs | 03-03 | ✓ |
| `/submit-contribution/confirmation` | Contribution Confirmation | Authenticated | /submit-contribution form | 03-03 | ✓ |

## Curator Routes

| Route | Page | Auth Required | Nav Parent | Implementing Plan | Status |
|-------|------|---------------|-----------|-------------------|--------|
| `/curator` | Curator Dashboard | Curator | — (direct access) | 04-02 | ✓ |
| `/curator/records` | Record Management List | Curator | Curator nav "Records" | 04-02 | ✓ |
| `/curator/records/new` | New Record | Curator | Curator nav "New Record" | 04-02 | ✓ |
| `/curator/records/:id` | Record Editor | Curator | Record list row | 04-02/03 | ✓ |
| `/curator/submissions/opportunity` | Opportunity Queue | Curator | Curator nav "Opportunities" | 04-04 | ✓ |
| `/curator/submissions/contribution` | Contribution Queue | Curator | Curator nav "Contributions" | 04-04 | ✓ |
| `/curator/engagement` | Engagement Activity | Curator | Curator nav "Engagement" | 04-04 | ✓ |
| `/curator/settings` | Hub Settings | **Admin** | Curator nav "Settings" (admin only) | 04-04 | ✓ |
| `/curator/reference` | Content Model Reference | Curator | Curator nav "Content Model" | 04-04 | ✓ |

## API Routes (not user-navigable)

| Route | Method | Auth | Plan |
|-------|--------|------|------|
| `/api/v1/catalog` | GET | None | 01-02 |
| `/api/v1/search` | GET | None | 02-01 |
| `/api/v1/search/facets` | GET | None | 02-01 |
| `/api/v1/records/:slug` | GET | None | 01-03 |
| `/api/auth/login` | POST | None | 03-01 |
| `/api/auth/logout` | POST | None | 03-01 |
| `/api/auth/session` | GET | None | 03-01 |
| `/api/v1/submissions/opportunity` | POST | None (rate-limited) | 03-02 |
| `/api/v1/submissions/contribution` | POST | None (rate-limited) | 03-03 |
| `/api/v1/engagement` | POST | None (rate-limited) | 03-04 |
| `/api/v1/curator/*` | * | Curator/Admin | 04-01 through 04-04 |

## Dead Link Verification

Run before launch:
```bash
npx playwright test e2e/navigation-ia.spec.ts --reporter=list
```

All routes must return HTTP 200 (or appropriate redirect for protected routes).
No route in the "Nav Parent" column may return 404.

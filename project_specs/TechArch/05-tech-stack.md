---

## 6. Technology Stack

### 6.1 Framework and Runtime

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Runtime | Node.js | 20 LTS | Server-side JavaScript runtime; LTS for stability |
| Language | TypeScript | 5.x | Type safety; matches FRD interface definitions |
| Framework | Next.js | 14+ (App Router) | SSR + API routes; WCAG-friendly server rendering; single deployment unit |
| React | React | 18+ | UI component library (bundled with Next.js) |

### 6.2 Database

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Database engine | PostgreSQL | 15+ | Relational DB with JSONB, arrays, tsvector; referential integrity |
| ORM / Query builder | Kysely | Latest | Type-safe SQL queries; no ORM magic; explicit PostgreSQL types |
| Migrations | Custom SQL files | — | Numbered SQL migration scripts in `/migrations/`; run via Kysely migrator or `psql` |
| Connection pooling | node-postgres (pg) | 8+ | PostgreSQL driver; connection pool management |

**Rationale for Kysely over alternatives:**
- Drizzle ORM: also a strong alternative; both provide type-safe SQL without hiding query semantics
- Prisma: avoids Prisma because it obscures raw SQL operations needed for audit event patterns, `tsvector` updates, and PostgreSQL-specific constraints
- Raw pg: too verbose; Kysely provides type safety without abstraction overhead

### 6.3 Authentication

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Auth framework | NextAuth.js (Auth.js) | 5.x | OIDC/OAuth2 integration; session management; pluggable providers |
| JWT validation | jose | Latest | RS256 JWT verification; used when identity system issues JWTs |
| Session cookies | HTTP-only, SameSite=Strict | — | Secure session cookies for browser auth |
| Dev auth stub | Custom (env-gated) | — | Fixed credentials for development; disabled in production |

**Anticipated operational provider (INT-01 — TBD):** Azure Entra ID Government (OIDC) or Judiciary SSO.

### 6.4 UI and Accessibility

| Component | Technology | Version | Purpose |
|---|---|---|---|
| CSS framework | Tailwind CSS | 3.x | Utility-first CSS; WCAG-friendly with proper usage |
| UI primitives | Radix UI | Latest | Accessible, unstyled component primitives (dialogs, tabs, badges) meeting WCAG 2.1 AA |
| Icon library | Heroicons or Lucide | Latest | SVG icons with accessible title/aria-label support |
| Accessibility testing | axe-core (jest-axe) | Latest | Automated WCAG 2.1 AA testing in CI |
| Focus management | Radix UI / native | — | Keyboard navigation; focus trapping in modals |

### 6.5 Security and Middleware

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Input validation | Zod | 3.x | Schema-based validation for all API inputs |
| XSS sanitization | isomorphic-dompurify | Latest | Server-side HTML sanitization of text fields |
| Rate limiting | @upstash/ratelimit or custom | Latest | IP-based rate limiting; Redis or in-memory store |
| CSRF | built-in Next.js / custom token | — | CSRF protection for mutations |
| Security headers | Next.js middleware | — | Applied globally via `next.config.ts` headers |
| Password hashing | N/A | — | Hub does not manage passwords; delegated to identity provider |

### 6.6 Email Routing

| Component | Technology | Version | Purpose |
|---|---|---|---|
| SMTP email | Nodemailer | Latest | Server-side email send for engagement routing (INT-03) |
| Mailto fallback | Native `mailto:` URI | — | Client-side email trigger when server-side SMTP not available |
| Mode control | `EMAIL_ROUTING_MODE` env var | — | `smtp` | `mailto`; controls routing approach |

### 6.7 Infrastructure and DevOps

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Containerization | Docker | 24+ | Application packaging; consistent environments |
| Local orchestration | docker-compose | 2.x | Dev environment (app + PostgreSQL) |
| CI/CD | TBD (GitHub Actions or Azure Pipelines) | — | Confirmed during discovery/hosting decision |
| Static analysis | ESLint + TypeScript strict mode | — | Code quality; type safety enforcement |
| Testing | Jest + React Testing Library | — | Unit and integration tests |
| Accessibility testing | jest-axe + Playwright (a11y) | — | Automated WCAG 2.1 AA validation |
| Environment config | `.env` + dotenv | — | Development config; `.env.example` committed |

### 6.8 Key Dependencies Summary

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next-auth": "^5.0.0",
    "kysely": "^0.27.0",
    "pg": "^8.0.0",
    "zod": "^3.0.0",
    "nodemailer": "^6.0.0",
    "isomorphic-dompurify": "^2.0.0",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-badge": "latest",
    "tailwindcss": "^3.0.0",
    "jose": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/pg": "^8.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "jest-axe": "^8.0.0",
    "playwright": "^1.40.0",
    "eslint": "^8.0.0"
  }
}
```

### 6.9 Not Included (Explicit Exclusions)

| Technology | Reason Not Included |
|---|---|
| Elasticsearch / Algolia | PostgreSQL tsvector sufficient for MVP scale; eliminates operational dependency |
| GraphQL | REST is simpler, easier to rate-limit and audit; all FRD endpoints are resource-oriented |
| Redis (required) | Optional for rate limiting; in-memory fallback for development; Redis added when multi-instance is needed |
| AI/ML inference | Not in scope per PRD §14; no autonomous decisions |
| Social features / WebSockets | Not in scope per PRD §14 |
| External CDN | Not required for MVP; static assets served by Next.js |
| File storage (S3, Azure Blob) | Hub links to external sources; does not host artifact content (PRD design principle) |

---

# Technical Architecture — TSIO Innovation Hub MVP
# TechArch-TechSurHub

**Project:** TechSur Innovation Hub (TSIO Innovation Hub MVP)
**Organization:** TSIO Innovation & Research (I&R), Administrative Office of US Courts
**Document Type:** Technical Architecture Specification
**Version:** 1.0
**Date:** 2026-08-11
**Source Documents:** PRD-TechSurHub.md v1.0, FRD-TechSurHub.md v1.0
**Status:** Working Draft

> This document is the technical blueprint for the TSIO Innovation Hub MVP. It translates product and functional requirements into architecture patterns, data models, API design, and security controls. All implementation decisions must conform to this document. Conflicts must be escalated to the technical lead before implementation proceeds.

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture) — see `01-components.md`
3. [Data Model](#3-data-model) — see `02-data-model.md`
4. [API Design](#4-api-design) — see `03-api.md`
5. [Security Architecture](#5-security-architecture) — see `04-security.md`
6. [Technology Stack](#6-technology-stack) — see `05-tech-stack.md`
7. [Integration Points](#7-integration-points) — see `06-integrations.md`

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

The TSIO Innovation Hub is a **server-rendered monolithic web application** following the **Model-View-Controller (MVC)** pattern with a REST API layer. This pattern was chosen over a decoupled SPA architecture for the following reasons:

| Decision | Rationale |
|---|---|
| Server-Side Rendering (SSR) | Required for WCAG 2.1 AA accessibility compliance — SSR ensures content is available without JavaScript, supports semantic HTML landmarks, and ensures screen readers receive fully-rendered content. SSR also improves initial page load performance on government network environments. |
| Monolithic deployment | Hosting environment is TBD (likely Azure Government Cloud). A single containerized application is simpler to deploy, operate, and hand off to a receiving technical team than a distributed microservices architecture. |
| REST API over GraphQL | REST is simpler, easier to document, audit, and rate-limit at the infrastructure level. All FRD endpoints are resource-oriented and map naturally to REST. |
| PostgreSQL full-text search | Eliminates the need for a dedicated search service (Elasticsearch, etc.) for MVP scale. PostgreSQL `tsvector`/`tsquery` supports weighted full-text search, prefix matching, and ranking — sufficient for the anticipated catalog size at launch (≥3 records). |
| Next.js | Provides SSR + API routes in a single framework, mature government/enterprise adoption, excellent accessibility tooling, and a clear deployment path to containerized hosting or Azure Static Web Apps / App Service. |

### 1.2 Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          Judiciary Network / Internet                         │
└───────────────────────┬──────────────────────────────┬───────────────────────┘
                        │                              │
              Anonymous Stakeholders           Curators / Admins
              (public catalog, search,         (protected /curator routes,
               record viewing, submissions)     content governance)
                        │                              │
                        ▼                              ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                         Load Balancer / Reverse Proxy                         │
│                    (TLS termination, security headers, rate limiting)          │
└───────────────────────────────────────┬───────────────────────────────────────┘
                                        │
                        ┌───────────────▼───────────────┐
                        │       Next.js Application     │
                        │   ┌───────────────────────┐   │
                        │   │   SSR Page Routes     │   │  ← Public pages (catalog,
                        │   │   /app or /pages      │   │    search, record detail,
                        │   └───────────────────────┘   │    submission forms)
                        │   ┌───────────────────────┐   │
                        │   │   REST API Routes     │   │  ← /api/v1/* endpoints
                        │   │   /api/v1/...         │   │    (public + curator)
                        │   └───────────────────────┘   │
                        │   ┌───────────────────────┐   │
                        │   │   Curator Interface   │   │  ← Protected /curator/*
                        │   │   /curator/...        │   │    SSR pages
                        │   └───────────────────────┘   │
                        │   ┌───────────────────────┐   │
                        │   │   Service Layer       │   │  ← Business logic,
                        │   │   (domain services)   │   │    publication gate,
                        │   └───────────────────────┘   │    audit logging
                        │   ┌───────────────────────┐   │
                        │   │   Data Access Layer   │   │  ← Repository pattern,
                        │   │   (repositories)      │   │    query builders
                        │   └───────────────────────┘   │
                        └───────────────┬───────────────┘
                                        │
                        ┌───────────────▼───────────────┐
                        │         PostgreSQL             │
                        │  ┌─────────────────────────┐  │
                        │  │  innovation_records      │  │
                        │  │  artifacts               │  │
                        │  │  record_next_actions     │  │
                        │  │  opportunity_submissions  │  │
                        │  │  innovation_contributions │  │
                        │  │  engagement_requests      │  │
                        │  │  audit_events (append-only)│ │
                        │  │  hub_settings             │  │
                        │  └─────────────────────────┘  │
                        └───────────────────────────────┘
                                        │
                               ┌────────▼────────┐
                               │  External Systems│
                               │  (linked only)  │
                               │  SharePoint      │
                               │  Git Repositories│
                               │  SMTP / Mailto   │
                               └─────────────────┘
```

### 1.3 Deployment Topology

```
┌──────────────────────────────────────────────────────────────────┐
│                    Container Runtime                             │
│  ┌──────────────────────────────────┐                           │
│  │    tsio-hub-app                  │  ← Next.js application    │
│  │    Image: node:20-alpine         │    Port 3000 (internal)   │
│  │    ENV: DATABASE_URL             │    Secrets via env vars   │
│  │         AUTH_SECRET              │    (SEC-08)               │
│  │         SMTP_HOST / SMTP_PORT    │                           │
│  │         EMAIL_ROUTING_MODE       │                           │
│  │         ENABLE_DEV_AUTH_BYPASS   │                           │
│  │         NODE_ENV                 │                           │
│  └──────────────────────────────────┘                           │
│  ┌──────────────────────────────────┐                           │
│  │    tsio-hub-db                   │  ← PostgreSQL 15+         │
│  │    Image: postgres:15-alpine     │    Port 5432 (internal)   │
│  │    Data volume: /var/lib/...     │    Not exposed externally │
│  └──────────────────────────────────┘                           │
└──────────────────────────────────────────────────────────────────┘

Environment Variables (never in source code — SEC-08):
  DATABASE_URL           postgresql://user:pass@db:5432/tsio_hub
  AUTH_SECRET            [JWT signing secret or OIDC client secret]
  AUTH_PROVIDER_URL      [OIDC provider URL — TBD identity system]
  SMTP_HOST              [email relay host]
  SMTP_PORT              [email relay port]
  SMTP_USER              [email credentials]
  SMTP_PASS              [email credentials]
  EMAIL_ROUTING_MODE     smtp | mailto
  ENABLE_DEV_AUTH_BYPASS false (must be false in production)
  ENABLE_CAPTCHA_BYPASS  false (must be false in production)
  NODE_ENV               production | development
  NEXT_PUBLIC_APP_URL    https://[deployment-url]
  RATE_LIMIT_STORE       memory | redis
  REDIS_URL              [if redis rate limiting]
```

### 1.4 Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR required for accessibility; single framework for pages + API; mature government adoption |
| Language | TypeScript | Type safety; FRD specifies TypeScript interfaces; reduces runtime errors |
| Database | PostgreSQL 15+ | JSONB for audit event data; `text[]` array types; `tsvector` full-text search; referential integrity |
| Full-text search | PostgreSQL `tsvector` | Eliminates dedicated search service; sufficient for MVP scale; weighted search via `ts_rank` |
| ORM / Query layer | Kysely or Drizzle ORM | Type-safe SQL; supports PostgreSQL-specific types; no ORM magic that obscures audit logic |
| Authentication | JWT (RS256) or session-based | TBD pending identity system discovery; architecture must support both OIDC and local auth stub |
| Rate limiting | IP-based via middleware | Configurable per hub_settings; Redis-backed for multi-instance; in-memory fallback for dev |
| CSS / UI | Tailwind CSS + Radix UI primitives | Accessible component primitives (WCAG 2.1 AA); government-neutral design |
| Containerization | Docker + docker-compose | Consistent dev/prod environments; deployment-agnostic |
| Secrets | Environment variables only | SEC-08 compliance; `.env.example` committed, `.env` gitignored |

### 1.5 Deployment Constraints and Blockers

The following items are operational blockers that must be resolved before non-development deployment. Architecture decisions documented here account for these pending decisions.

| Blocker | Status | Architecture Impact |
|---|---|---|
| Hosting environment (INT-02) | TBD — likely Azure Government Cloud | Application is containerized and hosting-agnostic; Azure App Service, AKS, or Azure Container Apps are all compatible |
| Identity and access management (INT-01) | TBD — likely Azure AD / Entra ID Government or Judiciary SSO | Auth middleware is abstracted behind an `AuthProvider` interface; OIDC and JWT implementations are swappable |
| Security baseline for CAPTCHA (INT-05) | TBD | Rate limiting is implemented; CAPTCHA is wired but bypassable via env var in dev (SEC-09) |
| Browser compatibility list | TBD — confirmed during discovery | Next.js supports modern browser targets; legacy IE is not supported |

---

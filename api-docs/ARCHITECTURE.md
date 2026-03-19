# Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client                             │
│              (Browser / Postman / curl)                  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────────┐
│                   Express.js                            │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  │
│  │ /health │  │  /draw   │  │/matches│  │  /teams   │  │
│  └─────────┘  └──────────┘  └────────┘  └───────────┘  │
│               ┌──────────┐                              │
│               │/api-docs │                              │
│               └──────────┘                              │
└──────────────────────┬──────────────────────────────────┘
                       │ InversifyJS DI
┌──────────────────────▼──────────────────────────────────┐
│                 Bounded Contexts                        │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │    Draw      │  │   Matches    │  │    Teams      │  │
│  │  Context     │  │   Context    │  │   Context     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────────────┐
│                SQLite (dev.db)                          │
│  ┌─────────┐ ┌──────┐ ┌───┐ ┌───────────┐ ┌───────┐   │
│  │ Country │ │ Team │ │Pot│ │DrawTeamPot│ │ Match │   │
│  └─────────┘ └──────┘ └───┘ └───────────┘ └───────┘   │
│                       ┌──────┐                          │
│                       │ Draw │                          │
│                       └──────┘                          │
└─────────────────────────────────────────────────────────┘
```

## Bounded Context Structure

Each context follows the same layered pattern:

```
context/
├── domain/            Interface + entities (no external deps)
│   ├── entity.ts
│   └── repository.ts  (interface only)
│
├── application/       Use cases (depends on domain)
│   ├── service.ts
│   └── __tests__/
│
├── infrastructure/    Prisma implementation (depends on domain)
│   └── prisma-*.repository.ts
│
└── presentation/      Express router + Zod DTOs (depends on application)
    ├── router.ts
    └── dtos/
```

## Draw Context

```
draw/
├── domain/
│   ├── draw.ts                    Draw aggregate root
│   ├── draw.repository.ts         save, searchCurrent, findAllTeams, deleteAll
│   ├── match.ts                   Match value object
│   ├── team.ts                    Team value object
│   ├── country.ts                 Country value object
│   ├── application/
│   │   ├── draw-assigner.service  Constraint-satisfaction algorithm (500 retries)
│   │   └── pot-assigner.service   Assigns 36 teams to 4 pots
│   └── exceptions/
│       └── draw-already-exists    Custom error for 409 conflict
│
├── application/
│   ├── create-draw.service        Validates uniqueness, creates draw
│   ├── search-current-draw.service
│   └── draw-statistics.service    Computes match/country stats
│
├── infrastructure/
│   └── prisma-draw.repository     Transactional save, cascade delete
│
└── presentation/
    └── draw.router                POST/GET/DELETE /draw, GET /draw/statistics
```

## Matches Context

```
matches/
├── domain/
│   ├── match.entity.ts            MatchEntity aggregate root
│   └── match.repository.ts        findAll(filters, pagination, sort), findById
│
├── application/
│   └── search-matches.service     Pagination validation, filter assembly
│
├── infrastructure/
│   └── prisma-match.repository    Prisma queries with dynamic where/orderBy
│
└── presentation/
    ├── matches.router             GET /matches, GET /matches/:id
    └── dtos/
        ├── search-matches.dto     Zod schema (teamId, matchDay, range, country, sort)
        └── match-response.dto     Response Zod schemas
```

## Teams Context

```
teams/
├── domain/
│   ├── team.entity.ts
│   └── team.repository.ts         findAll, findById
│
├── application/
│   ├── search-teams.service
│   └── search-team-by-id.service  Returns team + matches
│
├── infrastructure/
│   ├── prisma-team.repository
│   └── seed.ts                    Seeds 16 countries, 4 pots, 36 teams
│
└── presentation/
    └── teams.router               GET /teams, GET /teams/:id
```

## Shared Infrastructure

```
shared/
├── container/
│   ├── container.ts               InversifyJS bindings (all contexts)
│   └── types.ts                   Symbol constants for DI
│
├── domain/
│   ├── aggregate-root.ts          Base class with domain events
│   └── value-object.ts            Immutable props, equality
│
└── infrastructure/
    ├── database.ts                PrismaClient init (BetterSQLite3 adapter)
    ├── prisma.repository.ts       Base repository (static client, transactions)
    ├── routes.ts                  Router registration + health endpoint
    └── swagger.ts                 OpenAPI spec + Swagger UI at /api-docs
```

## Request Flow

```
HTTP Request
    │
    ▼
Express Middleware (json, logger, cookies)
    │
    ▼
Router (presentation/)
    │  Zod validation on req.query/req.params
    │  container.get<Service>(TYPES.X)
    ▼
Application Service
    │  Business validation (page >= 1, draw exists, etc.)
    │  Assembles filters, calls repository
    ▼
Repository Interface (domain/)
    │
    ▼
Prisma Repository (infrastructure/)
    │  Builds Prisma query (where, orderBy, skip, take)
    │  Maps DB rows to domain entities
    ▼
SQLite via Prisma + BetterSQLite3
```

## Database Schema

```
Country 1──* Team *──* DrawTeamPot *──1 Pot
                │              │
                │              │
                │         Draw 1──* DrawTeamPot
                │           │
                │           │
                └── Match *──1 Draw
                    │
            homeTeamId ──┐
            awayTeamId ──┘── Team
```

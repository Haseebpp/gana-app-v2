app-scaffolding/                          — Project root — backend + frontend in one cohesive workspace
│
├── AGENTS.md                                 — README for agents — brief AI collaborators on goals, context, and rules
│
├── backend/                                  — JavaScript backend (Express + MongoDB)
│   ├── config/                               — Central configuration — env wiring and external connections
│   │   ├── db.js                             — Mongo connection bootstrap — creates/exports the database link
│   │   └── __placeholder.txt                 — Add more config modules (cache, mailer, third-party SDKs)
│   │
│   ├── controllers/                          — Request → business logic → response (transport-agnostic handlers)
│   │   ├── auth.controller.js                — User use-cases (CRUD/profile) orchestrated over models/services
│   │   └── __placeholder.txt                 — Add controllers per domain (e.g., orders.controller.js)
│   │
│   ├── middleware/                           — Express middle layer — auth, errors, rate limits, logging
│   │   ├── auth.middleware.js                — AuthZ/AuthN gate — verifies JWTs & roles before handlers run
│   │   ├── error.middleware.js               — Central error handler — consistent HTTP errors and safe stacks
│   │   └── __placeholder.txt                 — Add middleware (CORS, Helmet, request-id, compression)
│   │
│   ├── models/                               — Mongoose schemas — define data shape, indexes, hooks
│   │   ├── user.model.js                     — User schema/model — fields, methods, lifecycle hooks
│   │   └── __placeholder.txt                 — Add models (e.g., product.model.js, session.model.js)
│   │
│   ├── routes/                               — HTTP surface — map URL paths to controllers/middleware
│   │   ├── auth.routes.js                    — /api/users endpoints — compose middleware + controller actions
│   │   └── __placeholder.txt                 — Add route modules (e.g., auth.routes.js, admin.routes.js)
│   │
│   ├── validation/                           — Input guards — validate/parse payloads before logic runs
│   │   ├── auth.validation.js                — Schemas for user payloads — signup/login/update
│   │   └── __placeholder.txt                 — Add validators per domain (e.g., order.validation.js)
│   │
│   └── server.js                             — App entrypoint — configures Express, connects DB, starts server
│
├── frontend/                                 — TypeScript React app (Vite)
│   ├── package.json                          — Frontend deps & scripts — web app lifecycle in isolation
│   ├── vite.config.ts                        — Vite build/dev config — plugins, aliases, HMR
│   ├── tsconfig.json                         — TS root shim for tooling/path aliases (frontend scope)
│   ├── tsconfig.node.json                    — TS for node-side tools in this workspace
│   ├── tsconfig.app.json                     — TS for app compilation — strictness, JSX, paths
│   ├── eslint.config.ts                      — Lint rules — style, safety rails, import hygiene
│   ├── components.json                       — shadcn/ui registry — source of truth for generated primitives
│   ├── index.html                            — Vite HTML shell — React bundle mounts here
│   │
│   ├── public/                               — Static assets served as-is (favicons, robots, images)
│   │   ├── favicon.ico                       — App favicon — tiny icon, big first impression
│   │   └── __placeholder.txt                 — Add static files (logos, manifest, og images)
│   │
│   └── src/                                  — Application code — routes, state, UI
│       ├── route.ts                          — React Router (data router) config — define tree, loaders/actions/lazy
│       │
│       ├── state/                            — Data & logic nucleus — predictable state, testable services
│       │   ├── store.ts                      — Redux store setup — reducers, middleware, devtools
│       │   ├── slices/                       — State “organs” — each slice owns a domain & actions
│       │   │   ├── authSlice.ts              — Auth slice — login/logout flow, tokens, session
│       │   │   └── __placeholder.txt         — Add slices (cartSlice.ts, settingsSlice.ts)
│       │   └── services/                     — API callers — fetch/axios/RTK Query; single responsibility: IO
│       │       ├── authService.ts            — Auth API — sign-in, sign-up, refresh, revoke
│       │       └── __placeholder.txt         — Add services (payments, files, notifications)
│       │
│       ├── components/                       — UI building blocks — reusable, composable, unopinionated
│       │   ├── ui/                           — shadcn primitives — accessible, themeable atoms/molecules
│       │   │   ├── button.tsx                — Button component — primary CTA workhorse
│       │   │   ├── card.tsx                  — Card component — flexible content container
│       │   │   └── __placeholder.txt         — Register more primitives as the design system grows
│       │   └── ProfileCard.tsx               — Profile summary — presentational view of user data
│       │
│       ├── pages/                            — Routed pages — compose components per URL
│       │   ├── Home.tsx                      — Landing/dashboard — first contact with your product
│       │   ├── Register.tsx                  — Registration page — onboarding flow
│       │   └── Login.tsx                     — Login page — authenticate, then redirect
│       │
│       ├── App.tsx                           — Root component — providers (Router/Redux/Theme) & layout shell
│       └── main.tsx                          — Vite entry — bootstraps React and hydrates the DOM
│
├── .env                                      — Environment variables — secrets & config (never commit real keys)
└── package.json                              — Root scripts/workspaces — orchestrates backend & frontend




#app-workflow

       ┌──────────┐
       │Idea pops!│
       └────┬─────┘
            v
┌───────────────────────┐
│Design data schema     │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Add validation rules   │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Implement controllers  │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Expose routes          │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Mount routes on server │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Create axios service   │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Add Redux slice &      │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Register slice in store│
└────────┬──────────────┘
         v
┌───────────────────────┐
│Build UI & routes      │
└────────┬──────────────┘
         v
┌───────────────────────┐
│Users interact →       │
│actions dispatch → API │
│calls → DB persistence │
└───────────────────────┘


Prompt 1:


Understant the AGENTS.md and start the codebase
use the below user model to start the first feature which is just a simple but token based authentication setup:

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true, // ensures each number is unique
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
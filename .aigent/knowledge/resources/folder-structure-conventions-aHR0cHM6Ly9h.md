# Folder structure + conventions

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=4add9562-34eb-49fb-ae52-c385c5ed15e1
Updated: 2026-05-05T07:40:46.619Z

### Goals
- Fast navigation: everything has an obvious home.
- Clear ownership: route code vs reusable shared code.
- Scalable: small routes stay simple; large routes stay organized.
- Colocation: tests/stories/mocks sit next to what they validate.

## Full example folder structure

                

# Core rules (what goes where)

### Route scope (app/<route>/...)
Use for code that is owned by exactly one route:

- UI components used only in that route
- route-specific hooks
- route-specific types/constants
- route-level mocks and tests

### Shared scope (shared/...)
Use for code that is reused across routes (or intended to be reusable):

- UI primitives and reusable components
- generic hooks
- global constants (breakpoints, routes, etc)
- shared mock utilities / fixtures

### Boundary rule
- Routes must not import from other routes (no app/<route-a> importing from app/<route-b>). If something is needed in multiple routes, it lives in shared/.

## Hybrid wrapping rule (when to create folders)

### Keep flat (small routes / small feature areas)
A route stays flat when it has only a few files:

- page.tsx
- 1–3 components
- maybe types.ts / constants.ts

### Wrap (large routes / components with companions)
Create wrapper folders when size/complexity grows:

- Route wrapper folders: components/, hooks/, mocks/
- Component wrapper folder: components/<name>/ when it has multiple files (test/story/mocks/helpers)

## Naming conventions
- Folders and files: kebab-case
- class-schedule/, class-schedule.tsx, use-availability.ts
- React components: PascalCase in code
- function ClassSchedule() { ... }
- Wrapped component main file matches folder
- banner/banner.tsx, modal/modal.tsx
- Tests / Stories / Mocks file names
- *.test.ts(x)
- *.stories.tsx
- *.mocks.ts

## Route folder conventions (app/<route>/...)
- page.tsx: route entry component (Next.js page)
- page.test.tsx: integration-style tests for the route (flow + composition)
- page.mocks.ts: fixtures + test helpers specific to the route
- types.ts: route-only TypeScript types
- constants.ts: route-only constants/config/enums
- hooks/: route-only hooks (state/data/business logic)
- components/: route-only components

## Component folder conventions (*/components/<name>/...)
A component folder typically contains:

- <name>.tsx (required)
- <name>.test.tsx (if tested)
- <name>.stories.tsx (if documented in Storybook)
- <name>.mocks.ts (optional, if the component needs fixtures)
- types.ts (optional, if types are only for that component)

## Testing conventions (Jest)
- Colocate tests with the unit:
- Route: app/<route>/page.test.tsx
- Route component: app/<route>/components/<name>/<name>.test.tsx
- Shared component: shared/components/<name>/<name>.test.tsx
- Use shared/mocks/ for test utilities/fixtures used across multiple tests/routes.

## Storybook conventions

### Global Storybook
- .storybook/ holds global Storybook configuration:
- providers/decorators
- global parameters
- global mocking setup (when it applies to many stories)

### Colocated stories
- Story files live next to the component they render:
- Route component: app/<route>/components/<name>/<name>.stories.tsx (or flat for small routes)
- Shared component: shared/components/<name>/<name>.stories.tsx

### Storybook-only mocks
- If mocks/handlers are used only by stories and are global/common → .storybook/mocks/*
- If fixtures are used by both tests and stories → shared/mocks/* (preferred)

## Mocking conventions (global vs scoped)
- Global reusable mocks: shared/mocks/
- server.ts: shared mock server / setup utilities
- mock-user.ts: common fixtures
- Route-specific mocks: app/<route>/page.mocks.ts or app/<route>/mocks/*
- Component-specific mocks: */components/<name>/<name>.mocks.ts
Rule of thumb:

- Used by many places → shared/mocks/
- Only for Storybook → .storybook/mocks/
- Only for one route/component → keep it local

## Import conventions
- Import shared items from shared/ (via your alias if available, e.g. @shared/...).
- Import route-local items using local relative imports inside the route, or @app/<route>/... if you intentionally treat it as route-internal.
- Avoid deep imports that bypass the structure’s intent (don’t reach into other routes).

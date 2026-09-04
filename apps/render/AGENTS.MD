# Frontend Rules (`apps/render`)

## Architecture: Bulletproof React

- **Strict Architecture**: We strictly follow the **Bulletproof React** architecture pattern.
- **Directory Roles**:
  - `src/app/`: Application-wide orchestration, routing, layouts, providers, and global store. No feature logic belongs here.
  - `src/features/<feature-name>/`: Domain-driven feature modules (e.g. `calendar`, `columns`, `settings`, `statistics`, `table`). Each feature encapsulates its own components, hooks, slices, and types.
  - `src/shared/`: Cross-cutting, domain-agnostic building blocks (`ui`, `api`, `lib`, `types`).

## Dependency & Isolation Rules

- **Unidirectional Flow**: `app` -> `features` -> `shared`.
- **Feature Isolation**: Features must NOT directly import from other features. If logic or UI needs to be shared between multiple features, lift it to `src/shared/` or orchestrate it at the `app/routes/` level.
- **No Reverse Imports**: `features/` and `shared/` must NEVER import anything from `src/app/`.

## Shared Components Rule

- **Check Before Creating**: Before creating any new UI component, always check whether a suitable component already exists in `src/shared/ui/`.
- **Reusable UI**: Keep components in `src/shared/ui/` pure, accessible, and decoupled from any specific feature's business logic.

## General Practices

- **Don't Repeat Yourself (DRY)**: Re-use existing utilities, types, and components wherever appropriate.
- **TypeScript**: Use strict typing and prefer types from `@onda/shared` when communicating with the backend.

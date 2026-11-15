# Contributing

## Commits

- Commits are **small and atomic**: each one builds and does one thing.
- Messages follow [Conventional Commits](https://www.conventionalcommits.org): `type(scope): imperative summary`.
  - Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
  - Scopes: `frontend`, `backend`, `infra`.
  - Add a body when the *why* isn't visible in the diff.

## Dependencies

- Only add libraries that are part of the stack in [`docs/architecture.md`](docs/architecture.md). A new dependency needs an [ADR](docs/adr/).
- Depend directly on every package you import. Don't rely on transitive dependencies being installed.

## Decisions

Significant design choices are recorded as ADRs in [`docs/adr/`](docs/adr/) using the format Context → Decision → Consequences. Number them sequentially (`NNNN-short-title.md`).

## Styling

Keep CSS minimal. Rely on the editor theme and component defaults.

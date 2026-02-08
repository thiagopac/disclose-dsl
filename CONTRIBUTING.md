# Contributing to Disclose.js

Thanks for your interest in contributing.

## Getting Started

1. Fork the repository.
2. Create a feature branch.
3. Make your changes with clear commits.
4. Open a pull request.

## Release

Publishing is automated via GitHub Actions. Create a tag like `v0.1.1` and push it:

```bash
git tag v0.1.1
git push --tags
```

The workflow in `.github/workflows/release.yml` will build, test, and publish to npm.

## Branch Naming

Use the pattern:

```
<type>/<short-description>
```

Examples:

- `feat/add-gradient-stops`
- `fix/renderer-text-baseline`
- `docs/readme-quickstart`
- `chore/ci-build`

## Commit Messages (Conventional Commits)

We follow Conventional Commits:

```
<type>(<scope>): <subject>
```

Rules:

- `type` must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- `scope` is optional but recommended (e.g. `dsl`, `renderer`, `timeline`).
- `subject` is imperative, lowercase, and short.
- Breaking changes must include `!` after type/scope and/or a `BREAKING CHANGE:` footer.

Examples:

- `feat(dsl): add spiral modifier`
- `fix(renderer): handle empty canvas size`
- `docs: add quickstart`
- `refactor!: rename scene builder`

## Project Structure

- `src/` core library source
- `dist/` compiled output
- `tests/` test scaffolding (initially empty)

## Guidelines

- Prefer small, focused PRs.
- Keep API changes documented.
- Add tests when a test harness is introduced.

## Code of Conduct

This project follows the Contributor Covenant. See `CODE_OF_CONDUCT.md`.

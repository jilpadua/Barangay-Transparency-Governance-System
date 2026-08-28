---
name: git-conventions
description: >-
  Branch naming and Conventional Commit standards for this repo. Use when
  creating branches, writing commit messages, opening pull requests, or
  rewriting git history.
---

# Branch Naming Standard

## Goal

All branches must follow a consistent naming convention to keep the Git workflow organized, predictable, and easy to understand.

Branch names should immediately communicate the **purpose of the work** and, when applicable, the **area of the project affected**.

---

# Branch Format

```text
<type>/<short-description>
```

Optional scope can be included when it improves clarity:

```text
<type>/<scope>/<short-description>
```

Examples:

```text
feature/parking-reservation-timeout
fix/parking/offline-bollard-validation
refactor/api/booking-validation
ui/home/hero-redesign
```

---

# Branch Types

## feature

Use when developing a **new feature or capability**.

Examples:

```text
feature/google-login
feature/parking/reservation-timeout
feature/api/booking-endpoint
feature/notifications/push-notifications
```

---

## fix

Use when correcting a bug or restoring expected behavior.

Examples:

```text
fix/login-token-refresh
fix/parking/offline-bollard-validation
fix/booking/duplicate-reservation
fix/home/hero-flickering
```

---

## refactor

Use when restructuring or improving internal code without intentionally changing behavior.

Examples:

```text
refactor/api/booking-validation
refactor/auth/token-service
refactor/database/repository-structure
```

---

## perf

Use when the primary purpose is improving performance.

Examples:

```text
perf/database/reservation-query
perf/home/image-loading
perf/api/booking-response
```

---

## ui

Use when changing the visual appearance of the application without changing its intended behavior.

Examples:

```text
ui/home/hero-redesign
ui/parking/slot-card
ui/dashboard/sidebar
```

---

## ux

Use when improving usability, interaction, or user experience.

Examples:

```text
ux/forms/invalid-field-feedback
ux/parking/reservation-flow
ux/dialog/loading-state
```

---

## style

Use for formatting-only changes.

Examples:

```text
style/dart-format
style/import-order
style/code-formatting
```

---

## docs

Use when working exclusively on documentation.

Examples:

```text
docs/update-readme
docs/api/graphql-examples
docs/development/setup-guide
```

---

## test

Use when adding, modifying, or improving tests.

Examples:

```text
test/auth/jwt-validation
test/parking/reservation-validation
test/booking/concurrency
```

---

## build

Use for dependency, tooling, SDK, or build configuration changes.

Examples:

```text
build/upgrade-flutter
build/update-gradle
build/update-node
build/dependency-updates
```

---

## ci

Use for Continuous Integration, deployment, or automation workflow changes.

Examples:

```text
ci/release-workflow
ci/flutter-cache
ci/deployment-pipeline
```

---

## chore

Use for general maintenance work that does not directly affect application behavior.

Examples:

```text
chore/remove-deprecated-assets
chore/reorganize-project-files
chore/update-dependencies
```

---

## revert

Use when creating a branch specifically to revert a previous change.

Examples:

```text
revert/biometric-login
revert/booking-validation
```

---

# Branch Naming Rules

* Use lowercase letters.
* Use kebab-case (`-`) between words.
* Use `/` to separate the branch type and optional scope.
* Keep names short but descriptive.
* Do not use spaces.
* Do not use special characters.
* Do not use vague names such as `update`, `changes`, `stuff`, or `new`.
* Describe the purpose of the work rather than the implementation details.
* Prefer a scope when it makes the branch easier to understand.
* Keep branch names reasonably short.

Good:

```text
feature/parking-reservation-timeout
fix/auth-token-refresh
fix/parking/offline-bollard
refactor/api/booking-validator
ui/dashboard/sidebar
test/booking/concurrency
```

Bad:

```text
feature/NewFeature
fix/fix-bug
my-changes
update
john-work
test123
feature/this-is-a-really-long-branch-name-that-is-hard-to-read
```

---

# Branch vs Commit Naming

Branch types and commit types should be related, but they do not need to be identical.

Branches use descriptive words such as:

```text
feature/
fix/
refactor/
ui/
ux/
```

Commits use the conventional commit types:

```text
feat:
fix:
refactor:
ui:
ux:
```

For example:

```text
Branch:
feature/parking/offline-bollard-validation
```

Commits:

```text
feat(parking): add backend bollard validation

fix(parking): handle offline bollard response

test(parking): cover offline bollard validation
```

This allows one branch to contain multiple logical commits while maintaining a consistent history.

**Intentional distinction:** use `feature/` for branch names and `feat` for commit types. This reads naturally in Git workflows and avoids branches like `feat/...` while documentation refers to "features."

---

# Recommended Workflow

## 1. Create a branch

Start from the appropriate base branch:

```bash
git checkout main
git pull
git checkout -b feature/parking/reservation-timeout
```

---

## 2. Make focused commits

Each commit should represent one logical change:

```text
feat(parking): add reservation timeout

test(parking): cover reservation timeout

docs(parking): document timeout behavior
```

---

## 3. Push the branch

```bash
git push -u origin feature/parking/reservation-timeout
```

---

## 4. Create a Pull Request

The Pull Request should describe:

* What was changed.
* Why it was changed.
* Important implementation details.
* Testing performed.
* Any known limitations or follow-up work.

---

# Branch Examples

### New Feature

```text
feature/parking/reservation-timeout
```

Commits:

```text
feat(parking): add reservation timeout

test(parking): cover reservation timeout
```

### Bug Fix

```text
fix/parking/offline-bollard-validation
```

Commits:

```text
fix(parking): handle offline bollard validation

test(parking): cover offline bollard response
```

### UI Work

```text
ui/dashboard/sidebar-redesign
```

Commits:

```text
ui(dashboard): reorganize sidebar navigation
ui(dashboard): improve sidebar spacing
```

### Refactoring

```text
refactor/api/booking-validation
```

Commits:

```text
refactor(api): extract booking validation service
test(api): cover booking validator
```

---

# Quick Reference

| Branch Type | Purpose                    | Commit Type |
| ----------- | -------------------------- | ----------- |
| `feature/`  | New functionality          | `feat`      |
| `fix/`      | Bug fixes                  | `fix`       |
| `refactor/` | Internal restructuring     | `refactor`  |
| `perf/`     | Performance improvements   | `perf`      |
| `ui/`       | Visual changes             | `ui`        |
| `ux/`       | Usability improvements     | `ux`        |
| `style/`    | Formatting only            | `style`     |
| `docs/`     | Documentation              | `docs`      |
| `test/`     | Tests                      | `test`      |
| `build/`    | Dependencies/build tooling | `build`     |
| `ci/`       | CI/CD                      | `ci`        |
| `chore/`    | Maintenance                | `chore`     |
| `revert/`   | Reverting work             | `revert`    |

---

# Standard Branch Pattern

Use:

```text
<type>/<scope>/<short-description>
```

when a scope is useful.

Otherwise:

```text
<type>/<short-description>
```

Examples:

```text
feature/parking/reservation-timeout
feature/google-login

fix/parking/offline-bollard
fix/token-refresh

refactor/api/booking-validator

ui/dashboard/sidebar
ux/parking/reservation-flow

test/booking/concurrency
docs/api/setup-guide
```

The goal is for anyone looking at the repository to understand **what kind of work a branch contains without opening it**.

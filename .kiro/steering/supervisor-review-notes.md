# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- Global `npm run type-check` now passes, which is a meaningful improvement in branch consistency.
- Full test status is now much better: 11 test suites pass and only 2 remain red.
- The branch is still not PR-ready because the remaining failures are not yet acceptable RED-state failures.
- The next priority is to convert the remaining failures into either green tests or intentional RED tests with valid syntax and realistic fixtures.

## Highest Priority Fixes

### 1. Fix the remaining test blockers

- Fix `src/utils/ProgressCalculator.test.ts`
  - The current `mockPath` fixture is inconsistent with the canonical `PathCoordinates` shape used by the implementation.
  - Right now `calculatePosition` expects the canonical fields, but the test data still produces `undefined` waypoints/control points at runtime.
  - Resolve this by making the test fixture and implementation agree on one canonical path structure.
  - This is causing 3 currently failing tests in the full suite.
- Fix `src/hooks/useStudySession.test.ts`
  - The suite is still blocked by a parse error around line 161.
  - RED tests must be syntactically valid and runnable; they may fail behaviorally, but not at parse time.
  - This is one entire suite failure and is currently the biggest TDD hygiene issue.

### 2. Be strict about TDD state quality

- Ensure newly added test files are parsable and consistent with the current TDD phase.
- If a file is intentionally RED, it must fail for behavioral reasons only.
- Remove fixture drift where tests still reflect an older interface shape.

### 3. Continue UI work in disciplined TDD order

- `SessionHeader` and `TimeInputPopup` files now exist, which is progress.
- Keep checking that task bookkeeping matches reality; `tasks.md` currently shows forward progress, but the branch should not claim completion if the full suite is still red.
- For UI tasks, keep the flow:
  1. RED tests that parse and target realistic selectors
  2. GREEN implementation to satisfy those tests
  3. REFACTOR while preserving test clarity

## Spec Reminders

- Turtle state flow:
  - `walking -> eating (1s) -> happy (3s) -> walking`
- If timer completes during `eating` or `happy`:
  - clear async work immediately
  - transition directly to `arrived`
- Pause/resume behavior:
  - pause shows `sleeping`
  - resume restores the prior active state and any remaining timed-state duration
- Care item behavior:
  - item is given immediately in front of the turtle
  - do not model this as a delayed walk-to-item flow
- Non-interactive areas:
  - must remain complete no-op

## Recommended Next Order

1. Repair `src/hooks/useStudySession.test.ts` so the suite can execute
2. Fix `src/utils/ProgressCalculator.test.ts` fixture/runtime mismatch
3. Re-run the full test suite and only then update task status claims
4. Continue `useStudySession` / UI work only after the baseline is stable again

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

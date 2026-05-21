# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The reducer layer is in better shape and `AppReducer` tests are green.
- The branch is not yet in a PR-ready state because global type-check and full test runs still fail.
- The next priority is not adding more surface area blindly; it is restoring codebase consistency while continuing the TDD flow.

## Highest Priority Fixes

### 1. Restore type consistency in existing logic files

- Fix `src/context/AppReducer.ts`
  - `previousStateBeforePause` must only store `walking | eating | happy | null`
  - Do not allow `sleeping` or `arrived` to flow into that field
- Fix `src/utils/ProgressCalculator.ts` and related types
  - Align `PathCoordinates` usage with the actual canonical type definition
  - Resolve the mismatch between `goal/waypoints` and `end/controlPoints`
- Fix `src/utils/StateTransitionManager.ts`
  - Replace invalid `CareItem` type usage with the correct canonical type
  - Remove or use currently unused parameters cleanly

### 2. Unblock broken tests before adding more implementation

- Fix the syntax error in `src/hooks/useStudySession.test.ts`
- Ensure newly added test files are at least parsable and consistent with the current TDD phase
- If a file is still intentionally RED, make sure it fails for behavioral reasons, not because of syntax/import/config issues

### 3. Continue UI work in disciplined TDD order

- `src/components/SessionHeader.test.tsx` exists, but the component file is missing
- `src/components/TimeInputPopup.test.tsx` is ahead of the current implementation
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

1. Make `npm run type-check` pass for the existing logic layer
2. Repair `useStudySession.test.ts` so the suite can execute
3. Decide whether `TimeInputPopup` is still RED or should move to GREEN
4. Implement `SessionHeader` only after the current branch is back to a stable baseline

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- the failure state of any RED tests is intentional and meaningful

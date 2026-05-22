# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- Global `npm run type-check` now passes, which is a meaningful improvement in branch consistency.
- Full test status improved again: only one failing suite remains.
- The previous `ProgressCalculator` fixture/runtime mismatch appears resolved.
- The branch is still not PR-ready because `useStudySession` is now blocked by a missing implementation module rather than a behavioral RED failure.
- The next priority is to restore a valid TDD shape for `useStudySession`: the suite should be able to import a real module and then fail or pass for meaningful reasons.

## Highest Priority Fixes

### 1. Fix the remaining test blocker

- Fix `src/hooks/useStudySession.test.ts` / `src/hooks/useStudySession.ts`
  - The parse error is gone, which is good progress.
  - The suite now fails because `./useStudySession` cannot be imported.
  - Add the missing implementation file or correct the import path so the suite can execute.
  - After that, keep the failure mode meaningful: behavioral RED or green, not module-resolution failure.

### 2. Be strict about TDD state quality

- Ensure newly added test files are parsable and consistent with the current TDD phase.
- If a file is intentionally RED, it must fail for behavioral reasons only.
- Avoid module-resolution failures; create the implementation shell before expanding tests further.

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

1. Add or correct `src/hooks/useStudySession.ts` so the test suite can import it
2. Run the `useStudySession` tests and decide the correct TDD phase from actual results
3. Re-run the full test suite and only then update task status claims
4. Continue feature work only after the baseline is stable again

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

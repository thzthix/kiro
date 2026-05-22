# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The branch is split between a green runtime/test baseline and a broken type baseline.
- `npm run type-check` fails.
- `npm test -- --runInBand` passes.
- Current test status:
  - 29 suites passing
  - 0 suites failing
  - 607 tests passing
  - 0 tests failing
- The prior `TouchInteraction` regression appears resolved or removed from the active test baseline.
- The current blockers are type-check only:
  - unused local variables in `src/components/ErrorHandling.test.tsx`
  - an unreachable comparison in `src/utils/StateTransitionManager.ts`
- `tasks.md` now marks `15.2` and `15.4` complete, and leaves `15.5` unchecked.
- The next risk is claiming GREEN task completion while `tsc --noEmit` is still red.

## Highest Priority Fixes

### 1. Restore the full green baseline

- First fix the type-check blockers before adding more scope.
- In `src/components/ErrorHandling.test.tsx`, remove or rewrite the newly introduced unused locals:
  - `_timerStartFailed`
  - `_timerOutOfSync`
- In `src/utils/StateTransitionManager.ts`, remove the redundant `currentState === 'arrived'` branch inside the paused-state handling because `arrived` was already returned earlier.
- Re-run:
  - `npm run type-check`
  - `npm test -- --runInBand`

### 2. Keep TDD honest

- New RED tests are acceptable only if they are:
  - syntactically valid
  - importable/runnable
  - behaviorally failing for a meaningful reason
- Avoid:
  - wrong-node assertions
  - module-resolution failures
  - parse errors
  - invalid property-test structure
  - dumping many new suites into the branch before stabilizing earlier ones
  - partial render-helper failures like `render method has not been called`
  - assertions against non-public implementation props on host nodes
  - marking GREEN work complete when tests pass but `type-check` is still red

### 3. Verify task bookkeeping against reality

- If `tasks.md` marks items complete, ensure the implementation and tests truly back that claim.
- Avoid claiming completion just because a component file exists; confirm behavior against the spec.
- `15.2` and `15.4` may be behaviorally close, but the branch is not fully GREEN until type-check passes too.
- When moving to the next task, check that the current branch still aligns with:
  - `requirements.md`
  - `design.md`
  - steering docs

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

1. Fix the `ErrorHandling.test.tsx` unused-local type errors
2. Fix the unreachable `arrived` comparison in `StateTransitionManager`
3. Re-run full type-check
4. Re-run the full test suite
5. Only then continue with the next unfinished feature area

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

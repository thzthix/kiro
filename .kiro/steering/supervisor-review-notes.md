# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The branch has regressed in the integration layer.
- `npm run type-check` did not surface a blocking error in the latest review.
- `npm test -- --runInBand` fails.
- Current test status:
  - 30 suites passing
  - 1 suite failing
  - 636 tests passing
  - 20 tests failing
- All current failures are concentrated in `src/__tests__/integration.test.tsx`.
- The common symptom is that `StudySessionScreen` renders only the empty `study-session-screen` container during integration flows, which strongly suggests the session never gets created in the `AppProvider`/`HomeScreen`/`useStudySession` path.
- This is not a broad UI-contract regression. It is a higher-level state/bootstrap regression in the active session flow.
- The previous type-check blockers are no longer the main issue. The priority has shifted to restoring an actual running session in integration scenarios.

## Highest Priority Fixes

### 1. Restore the integration baseline

- Fix the session bootstrap path before adding more UI or error-handling scope.
- Start with the components/hooks that decide whether a session exists:
  - `src/hooks/useStudySession.ts`
  - `src/screens/HomeScreen.tsx`
  - `src/screens/StudySessionScreen.tsx`
  - `src/context/AppContext.tsx`
- In integration runs, `StudySessionScreen` is hitting the `if (!session)` early return, so trace why the session is missing after the Home screen flow should have started one.
- Re-run focused integration tests first:
  - `npm test -- src/__tests__/integration.test.tsx --runInBand`
- Then re-run the full suite.

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
  - claiming GREEN progress from isolated component tests while the integration path is still broken

### 3. Verify task bookkeeping against reality

- If `tasks.md` marks items complete, ensure the implementation and tests truly back that claim.
- Avoid claiming completion just because a component file exists; confirm behavior against the spec.
- Do not treat any new screen/session task as complete while the main integration flow still renders an empty session screen.
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

1. Restore session creation in the `AppProvider` -> `HomeScreen` -> `useStudySession` flow
2. Make `StudySessionScreen` render the actual session subcomponents during integration tests
3. Re-run `src/__tests__/integration.test.tsx`
4. Re-run the full suite
5. Only then continue with the next unfinished feature area

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

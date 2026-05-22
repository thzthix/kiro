# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The branch still has a UI test-contract regression, but the failure cluster has shifted.
- `npm run type-check` passes.
- `npm test -- --runInBand` fails.
- Current test status:
  - 22 suites passing
  - 9 suites failing
  - 570 tests passing
  - 86 tests failing
- The changed files are concentrated in app-facing UI layers:
  - `App.tsx`
  - `src/components/CareItemsPanel.tsx`
  - `src/components/SessionControls.tsx`
  - `src/components/SessionHeader.tsx`
  - `src/components/StudyCanvas.tsx`
  - `src/components/TurtleCharacter.tsx`
  - `src/constants/theme.ts`
  - `src/hooks/useStudySession.ts`
  - `src/screens/HomeScreen.tsx`
  - `src/screens/StudySessionScreen.tsx`
  - `src/types/assets.d.ts`
- New image assets were also introduced:
  - `assets/images/time_pannel_number.jpeg`
  - `assets/images/timer_pannel_base.jpeg`
  - `assets/images/turtle_walking_frame.jpeg`
  - `assets/timer_pannel_apperance.jpeg`
- The failure pattern is still not broad type breakage; it is test-contract drift after a visual/UI refactor and asset swap.
- Common symptoms:
  - `StudySessionScreen` tests are still failing after changes in the provider/session setup path or screen composition
  - `ProgressBar` no longer renders the expected `progress-bar-turtle-slider` node
  - `TurtleCharacter` now points at a different walking asset than the tests expect
- Earlier `CareItemsPanel` / `SessionControls` failures appear to have improved, but the regression moved into session screen, progress bar, and turtle asset contracts.
- The current risk is that visual refactoring is rewriting public test contracts and asset expectations without preserving or intentionally updating them.

## Highest Priority Fixes

### 1. Restore the UI test baseline

- Stop broad visual churn until the failing suites are stabilized again.
- Re-run focused suites first, not just the full suite.
- Start with:
  - `src/screens/StudySessionScreen.test.tsx`
  - `src/components/ProgressBar.test.tsx`
  - `src/components/TurtleCharacter.test.tsx`
- Then re-run the full suite.

### 2. Reconcile rendered UI contracts with tests

- If the new design intentionally changed structure, update tests to assert the new public contract.
- If the design did not intentionally change behavior, preserve prior public hooks:
  - stable `testID`s
  - progress bar turtle slider rendering
  - session screen child composition
  - turtle sprite/source mapping by state
- Be careful with style assertions:
  - tests that call `toMatchObject` on `container.props.style` will fail if the component now passes a style array
  - either flatten the style in tests or preserve a shape the current tests intentionally target
- Be careful with asset swaps:
  - if a sprite file changed intentionally, update the tests and any steering/spec references that still assume the old asset
  - if the old asset contract should remain, restore the previous source mapping instead of silently switching files

### 3. Keep TDD honest

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
  - large UI refactors that silently invalidate many existing contracts at once

### 4. Verify task bookkeeping against reality

- If `tasks.md` marks items complete, ensure the implementation and tests truly back that claim.
- Avoid claiming completion just because a component file exists; confirm behavior against the spec.
- Do not treat the current UI refresh as complete while `StudySessionScreen`, `ProgressBar`, and `TurtleCharacter` tests are still failing.
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

1. Stabilize `StudySessionScreen` provider/session rendering path
2. Restore or intentionally redefine `ProgressBar` turtle-slider contract
3. Restore or intentionally redefine `TurtleCharacter` walking asset contract
4. Re-run the focused failing suites
5. Re-run the full suite
6. Only then continue with additional UI/web polish

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

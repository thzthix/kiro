# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The branch has expanded further into multiple UI components, constants, and screens:
  - `BackgroundImage`
  - `CareItemsPanel`
  - `DecorativeElements`
  - `PathComponent`
  - `SessionControls`
  - `StudyCanvas`
  - `TurtleCharacter`
  - `HomeScreen`
  - `StudySessionScreen`
  - `CompletionScreen`
- This introduced a broad regression in the test baseline.
- The branch is currently less stable than before:
  - `npm run type-check` is broken again
  - full test execution aborts early with a React Native Testing Library screen/render error
- Do not continue expanding feature surface area until the baseline is restored.

## Highest Priority Fixes

### 1. Stop expansion and stabilize the UI test baseline

- First restore `npm run type-check`
  - `CareItemsPanel.property.test.tsx` uses async predicates in `fast-check` incorrectly
  - several test files have unused bindings that currently fail strict TS checks
  - `TurtleCharacter.tsx` still passes invalid custom props to `Animated.View`
  - `CompletionScreen.tsx` passes invalid `onError` prop to `View`
  - `StudySessionScreen.tsx` narrows `SessionStatus` incorrectly
- Fix `src/components/TimeInputPopup.test.tsx` and `src/components/TimeInputPopup.tsx`
  - The suite executes, but the remaining assertions are brittle.
  - Current failure suggests the test is checking `accessible` on the wrong queried node.
  - Align the component and tests on realistic React Native testing targets:
    - use stable `testID`s
    - expose pressable/accessibility props intentionally
    - assert against the actual host element that owns those props
  - Remove noisy assumptions if the test is checking props on a text node instead of the button container.
- Fix `src/components/TurtleCharacter.test.tsx` and `src/components/TurtleCharacter.tsx`
  - The component renders `testID="turtle-character"` but tests expect `turtle-container`.
  - Canonicalize the identifier and keep tests/components consistent.
  - Remove invalid custom props from `Animated.View` such as `progress`, `state`, and `direction`.
- Fix `src/components/CareItemsPanel.property.test.tsx`
  - The property tests are currently violating `fast-check` expectations by using async predicates in a non-supported way.
  - Convert them into valid async property tests or rewrite them synchronously.

### 2. Restore test hygiene before adding any more UI

- The branch should not add additional components/tests until focused suites are green or intentionally RED in valid ways.
- Avoid:
  - wrong-node assertions
  - module-resolution failures
  - parse errors
  - invalid property-test structure
  - dumping many new suites into the branch before stabilizing earlier ones
  - partial render-helper failures like `render method has not been called`

### 3. Be strict about TDD state quality

- Ensure newly added test files are parsable and consistent with the current TDD phase.
- If a file is intentionally RED, it must fail for behavioral reasons only.
- Avoid module-resolution failures; create the implementation shell before expanding tests further.
- Avoid brittle UI tests that inspect the wrong rendered node for accessibility/touch behavior.

### 4. Continue UI work in disciplined TDD order

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

1. Restore `npm run type-check`
2. Stabilize `CareItemsPanel` property tests
3. Stabilize `TurtleCharacter`
4. Stabilize `TimeInputPopup`
5. Re-run focused suites first
6. Re-run the full suite
7. Only then continue expanding UI/screens

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

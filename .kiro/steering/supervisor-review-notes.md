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
- Type-check is green again, which is a meaningful recovery.
- Full test execution now completes instead of aborting early.
- Current test status:
  - 20 suites passing
  - 4 suites failing
  - 477 tests passing
  - 41 tests failing
- The branch is improving, but the remaining failures are concentrated in a few UI contract areas and should be stabilized before more expansion.

## Highest Priority Fixes

### 1. Stop expansion and stabilize the UI test baseline

- First stabilize the four remaining failing suites:
  - `src/components/CareItemsPanel.property.test.tsx`
  - `src/components/StudyCanvas.test.tsx`
  - `src/components/TurtleCharacter.test.tsx`
  - `src/screens/StudySessionScreen.test.tsx`
- Fix `src/components/TimeInputPopup.test.tsx` and `src/components/TimeInputPopup.tsx`
  - The suite executes, but the remaining assertions are brittle.
  - Current failure suggests the test is checking `accessible` on the wrong queried node.
  - Align the component and tests on realistic React Native testing targets:
    - use stable `testID`s
    - expose pressable/accessibility props intentionally
    - assert against the actual host element that owns those props
  - Remove noisy assumptions if the test is checking props on a text node instead of the button container.
- Fix `src/components/TurtleCharacter.test.tsx` and `src/components/TurtleCharacter.tsx`
  - The current component/test contract is still inconsistent.
  - Tests expect state-specific test IDs like `turtle-character-walking` / `turtle-character-arrived`, but the component renders only `turtle-character`.
  - Canonicalize the identifier strategy and keep tests/components consistent.
- Fix `src/components/CareItemsPanel.property.test.tsx`
  - The property tests are now structurally runnable, but still need stabilization and noise reduction.
  - Keep them focused on true properties rather than render noise.
- Fix `src/components/StudyCanvas.test.tsx` and `src/components/StudyCanvas.tsx`
  - Tests expect `progress` and `state` to be inspectable on the queried turtle node, but those props are not available on the host element being asserted.
  - Align tests with the public rendered contract rather than implementation-only props.
- Fix `src/screens/StudySessionScreen.test.tsx`
  - Tests expect IDs like `care-items-panel`, `session-controls`, and state-specific turtle IDs that do not match current rendered output.
  - Some edge-case expectations for restored turtle state are also failing.

### 2. Restore test hygiene before adding any more UI

- The branch should not add additional components/tests until focused suites are green or intentionally RED in valid ways.
- Avoid:
  - wrong-node assertions
  - module-resolution failures
  - parse errors
  - invalid property-test structure
  - dumping many new suites into the branch before stabilizing earlier ones
  - partial render-helper failures like `render method has not been called`
  - assertions against non-public implementation props on host nodes

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

1. Stabilize `TurtleCharacter`
2. Stabilize `StudyCanvas`
3. Stabilize `StudySessionScreen`
4. Stabilize `CareItemsPanel` property tests
5. Re-run focused suites first
6. Re-run the full suite
7. Only then continue expanding UI/screens

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

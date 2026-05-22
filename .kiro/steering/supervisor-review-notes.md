# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The branch baseline is fully recovered.
- `npm run type-check` passes.
- `npm test -- --runInBand` passes.
- Current test status:
  - 24 suites passing
  - 0 suites failing
  - 518 tests passing
  - 0 tests failing
- The previous UI contract regressions appear resolved.
- The next risk is no longer baseline instability; it is making sure task bookkeeping, implementation quality, and spec alignment stay honest as work continues.
- `tasks.md` was updated to mark `8.5`, `9.1`, and checkpoint `10` complete.
- Checkpoint `10` is now consistent with reality because the full suite and type-check are green.

## Highest Priority Fixes

### 1. Protect the green baseline

- Re-run focused suites before and after each new UI change.
- Do not merge “many new files + many new tests” without verifying the full suite remains green.
- Keep public component contracts explicit:
  - stable `testID`s
  - accessibility roles/labels on actual pressable hosts
  - tests asserting rendered behavior rather than private implementation props

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

### 3. Verify task bookkeeping against reality

- If `tasks.md` marks items complete, ensure the implementation and tests truly back that claim.
- Avoid claiming completion just because a component file exists; confirm behavior against the spec.
- The newly checked checkpoint for “all tests pass” is currently justified; keep it that way while subsequent UI work continues.
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

1. Preserve the green baseline
2. Compare current implementation coverage against `tasks.md` and the spec
3. Only then move to the next unfinished feature area
4. Keep full type-check and full test suite green after every meaningful chunk

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

# Supervisor Review Notes

## Purpose

This note captures current review findings and the recommended next execution order for the turtle-study-app implementation. Read this before continuing implementation so the branch stays aligned with the spec and avoids compounding type/test regressions.

## Operating Rule For Kiro

- Codex updates this file approximately every hour after reviewing the workspace and Kiro GUI task progress.
- Before starting a new implementation step, before changing task focus, and after finishing a meaningful chunk of work, read this file again and follow the latest guidance.
- If instructions here conflict with an older local plan, prefer the latest guidance in this file unless the spec documents clearly require otherwise.

## Current Assessment

- The branch baseline is green again.
- `npm run type-check` passes.
- `npm test -- --runInBand` passes.
- Current test status:
  - 31 suites passing
  - 0 suites failing
  - 656 tests passing
  - 0 tests failing
- The recent integration and type-check regressions appear resolved.
- The scope has expanded meaningfully toward web support:
  - `webpack.config.js`
  - `index.web.js`
  - `public/`
  - updates to `package.json`, `package-lock.json`, and `babel.config.js`
  - `.github/` additions
- The current risk is no longer red tests. It is making sure this web-platform expansion stays aligned with the product spec and does not quietly diverge from the React Native app behavior.

## Highest Priority Fixes

### 1. Protect the green baseline during web expansion

- Keep both the existing app behavior and the new web target green after every meaningful chunk.
- Re-run at minimum:
  - `npm run type-check`
  - `npm test -- --runInBand`
- If web-specific codepaths are added, prefer adding focused coverage rather than assuming the native test suite is sufficient.

### 2. Verify web support against the existing spec

- Confirm the web entry/build setup does not change core study-session behavior:
  - session start flow
  - pause/resume
  - care item interactions
  - timer completion to `arrived`
  - non-interactive area no-op behavior
- Preserve the same public UI/test contracts where possible:
  - stable `testID`s
  - same state transitions
  - same visible structure for session-critical elements

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
  - claiming platform support complete just because build scaffolding exists

### 4. Verify task bookkeeping against reality

- If `tasks.md` marks items complete, ensure the implementation and tests truly back that claim.
- Avoid claiming completion just because a component file exists; confirm behavior against the spec.
- Do not treat web support as complete just because webpack, deploy scripts, or a web entry file exist.
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

1. Preserve the green baseline while web support files are landing
2. Verify the web-target additions do not alter spec-defined session behavior
3. Add or review focused validation for any web-only branch where behavior could drift
4. Re-run the full suite and type-check after each meaningful web/setup change
5. Only then continue with the next unfinished feature area

## Definition of “Good Progress”

Before claiming the next task complete, prefer to verify:

- targeted tests for the changed unit pass
- full `npm run type-check` passes
- full `npm test -- --runInBand` is either green or only intentionally RED in valid, runnable suites
- the failure state of any RED tests is intentional and meaningful

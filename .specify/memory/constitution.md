<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (template) → 1.0.0
  Bump rationale: MAJOR — initial constitution ratification

  Modified principles:
  - [PRINCIPLE_1_NAME] → I. Code Quality
  - [PRINCIPLE_2_NAME] → II. Testing Standards
  - [PRINCIPLE_3_NAME] → III. User Experience Consistency
  - [PRINCIPLE_4_NAME] → IV. Performance Requirements
  - [PRINCIPLE_5_NAME] → removed (not needed)

  Added sections:
  - Quality Gates (replaces SECTION_2)
  - Development Workflow (replaces SECTION_3)

  Removed sections:
  - None (template placeholders replaced)

  Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed
    (Constitution Check section is dynamic; principles align)
  - .specify/templates/spec-template.md ✅ no changes needed
    (Success Criteria already supports performance metrics)
  - .specify/templates/tasks-template.md ✅ no changes needed
    (Polish phase already includes performance + testing)
  - .specify/templates/checklist-template.md ✅ no changes needed
    (Generated dynamically per feature)

  Deferred items: None
-->

# Valentine Constitution

## Core Principles

### I. Code Quality

- All code MUST be clean, readable, and self-documenting.
  Function and variable names MUST convey intent without
  requiring explanatory comments.
- Files MUST have a single, clear responsibility. No file
  should exceed 300 lines without explicit justification.
- All public interfaces MUST use strict typing. Dynamic or
  loosely typed values at module boundaries are prohibited.
- Dead code, unused imports, and TODO comments without
  linked issues MUST NOT be merged into the main branch.
- Linting and formatting rules MUST be enforced via
  automated tooling on every commit. No manual style
  reviews.

### II. Testing Standards

- Every user-facing feature MUST have at least one
  integration test covering the primary happy path before
  it can be considered complete.
- Unit tests MUST cover all non-trivial business logic.
  Trivial getters, setters, and pass-through functions are
  exempt.
- Tests MUST be deterministic. Flaky tests MUST be
  quarantined within 24 hours and fixed or removed within
  one week.
- Test names MUST describe the behavior under test using
  a "given/when/then" or "should" convention so failures
  are self-explanatory.
- Test data MUST be isolated per test. Shared mutable
  state between tests is prohibited.

### III. User Experience Consistency

- All user-facing components MUST follow the project's
  established design system (spacing, color, typography,
  and interaction patterns).
- Error messages MUST be human-readable, actionable, and
  free of internal jargon or stack traces.
- Loading, empty, and error states MUST be designed for
  every view that depends on asynchronous data.
- Interactions MUST provide immediate visual feedback
  (within 100 ms) to acknowledge user input.
- Accessibility MUST meet WCAG 2.1 AA compliance. All
  interactive elements MUST be keyboard navigable and
  screen-reader compatible.

### IV. Performance Requirements

- Initial page load (Largest Contentful Paint) MUST
  complete within 2.5 seconds on a median mobile
  connection.
- API responses MUST return within 200 ms at p95 under
  expected load.
- Client-side JavaScript bundle size MUST NOT exceed
  250 KB gzipped without explicit justification and an
  approved exception in the Complexity Tracking table.
- Memory leaks MUST NOT exist. Long-running processes
  MUST maintain stable memory usage over a 24-hour
  period.
- Performance budgets MUST be enforced in CI. Any
  regression exceeding 10% on a tracked metric MUST
  block the merge.

## Quality Gates

All code changes MUST pass the following gates before
merge to the main branch:

1. **Lint & Format**: Zero warnings, zero errors from
   the project's configured linting and formatting tools.
2. **Type Check**: Full type-check pass with no
   suppressions added in the diff.
3. **Test Suite**: All existing tests pass. New code
   includes tests per Testing Standards (Principle II).
4. **Performance Budget**: CI performance checks pass
   with no regressions exceeding 10% on tracked metrics.
5. **Accessibility Scan**: Automated a11y checks report
   zero critical or serious violations.
6. **Code Review**: At least one approving review from
   a team member who did not author the change.

## Development Workflow

1. **Branch from main**: One branch per feature or fix,
   named with the convention `###-short-description`.
2. **Small, focused commits**: Each commit MUST represent
   a single logical change. Commits MUST NOT mix
   refactoring with feature work.
3. **Tests before implementation**: When adding new
   behavior, write failing tests first, then implement
   until tests pass, then refactor.
4. **PR scope**: Pull requests SHOULD touch fewer than
   10 files and fewer than 400 lines changed. Larger
   PRs MUST be split or justified.
5. **Continuous integration**: Every push triggers the
   full Quality Gates pipeline. Broken builds MUST be
   fixed before any new work is merged.

## Governance

This constitution is the authoritative source for project
standards. All code reviews, architectural decisions, and
tooling choices MUST align with these principles.

- **Amendments** require a documented proposal, team
  review, and an updated constitution version before
  taking effect.
- **Versioning** follows semantic versioning: MAJOR for
  principle removals or incompatible redefinitions,
  MINOR for new principles or material expansions,
  PATCH for clarifications and wording fixes.
- **Compliance review**: At least once per quarter, the
  team MUST audit recent work against these principles
  and document findings.
- **Exceptions**: Any deviation from a principle MUST be
  recorded in the Complexity Tracking table of the
  relevant plan.md with a justification and the simpler
  alternative that was rejected.

**Version**: 1.0.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10

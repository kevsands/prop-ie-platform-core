# Testing Pipeline

This document outlines our testing workflow, continuous integration setup, and coverage tracking approach.

## Testing Workflow

Our testing pipeline consists of the following components:

1. **Local Testing**: Developers run tests during development
2. **Pre-commit Checks**: Basic test suite runs before allowing commits
3. **CI Testing**: Comprehensive test suite runs on pull requests and merges
4. **Coverage Tracking**: Test coverage is measured and tracked over time
5. **Quality Gates**: PRs must meet minimum test coverage requirements

## Test Coverage Dashboard

The Test Coverage Dashboard is a key component of our testing strategy. It provides:

- Visual representation of test coverage across the codebase
- Historical tracking to identify trends
- Module-level breakdown to identify problem areas
- Integration with our CI/CD pipeline

### Generating the Dashboard

**Locally**:
```bash
# Run tests with coverage and generate dashboard
npm run test:with-dashboard

# Generate dashboard from existing coverage data
npm run coverage:dashboard

# Generate and save to history
npm run coverage:dashboard:save
```

**In CI**:
The dashboard is automatically generated on CI runs and available as an artifact.

## GitHub Actions Workflow

We use GitHub Actions to:

1. Run tests on all PRs and branch pushes
2. Generate coverage reports
3. Create the coverage dashboard
4. Add coverage information as PR comments
5. Update coverage badges in the README

### PR Comments

When a PR is created or updated, our GitHub Action will automatically add a comment with:
- Overall coverage metrics
- Coverage changes from the base branch
- List of low-coverage modules that need attention
- Link to the full coverage dashboard

### Coverage Badge

Our README includes an automatically updated coverage badge:

![Test Coverage](https://img.shields.io/badge/coverage-XX%25-brightgreen)

This badge is updated whenever changes are merged to the main branch.

## Coverage Expectations

We maintain the following coverage targets:

| Component Type | Target Coverage |
|----------------|----------------|
| Core Services  | 80%+           |
| UI Components  | 70%+           |
| Utilities      | 90%+           |
| Overall        | 75%+           |

### Improving Coverage

To improve test coverage:

1. Use the Coverage Dashboard to identify low-coverage areas
2. Focus on critical business logic first
3. Use component tests for UI elements
4. Ensure edge cases and error conditions are tested
5. Update tests when fixing bugs or adding features

## Integration with Test Utilities

Our coverage tracking is integrated with our standardized test utilities (see [Test Patterns](./TESTING_PATTERNS.md)) to provide a comprehensive testing solution.

The dashboard helps guide testing efforts by highlighting:
- Modules with insufficient coverage
- Changes in coverage over time
- Impact of new tests on overall coverage

## Workflow Integration

The coverage dashboard is integrated into our development workflow:

1. **Sprint Planning**: Teams review coverage metrics when planning work
2. **Development**: Developers can generate the dashboard locally
3. **Code Review**: Reviewers have access to coverage information in PR comments
4. **Retrospectives**: Teams review coverage trends during sprint retrospectives
5. **Quality Reporting**: Coverage metrics are included in quality reports

## Example PR Comment

Here's an example of the coverage information that appears on PRs:

```
## Test Coverage Report

🟢 Overall coverage: 78.45%
🟢 Statement coverage: 82.34%
🟡 Function coverage: 75.12%
🔴 Branch coverage: 62.15%

### Low Coverage Modules

| Module | Files | Coverage |
| ------ | ----- | -------- |
| services | 12 | 🔴 45.32% |
| auth | 5 | 🟡 65.87% |
| api | 8 | 🟡 68.23% |

[View full coverage dashboard](https://github.com/example/repo/actions/runs/12345)
```

## Future Improvements

We plan to enhance our coverage tracking with:

1. Coverage diff visualization to show changes between commits
2. Automated recommendations for areas to focus testing efforts
3. Team-specific coverage goals and tracking
4. Integration with code quality metrics
5. Automated test generation suggestions
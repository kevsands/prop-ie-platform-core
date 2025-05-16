# CI Integration Instructions for Test Coverage Dashboard

This guide explains how to integrate the test coverage dashboard into your CI/CD pipeline for automated coverage tracking.

## Overview

By integrating the coverage dashboard into CI, you'll automatically:
1. Generate coverage reports for all PRs and commits
2. Track historical coverage data over time
3. Notify developers about coverage changes in their code
4. Maintain consistent test quality standards

## GitHub Actions Integration (Already Implemented)

The `.github/workflows/test-coverage.yml` workflow is already configured to:
- Run on PRs to main/master branches and direct pushes
- Generate coverage data and the dashboard
- Comment on PRs with coverage metrics
- Store the dashboard as an artifact
- Track historical coverage data

## Adding Coverage Checks to Required PR Checks

To enforce coverage standards, add this workflow to your required PR checks:

1. Go to your GitHub repository settings
2. Navigate to "Branches" > "Branch protection rules"
3. Select your main branch protection rule
4. Under "Require status checks to pass before merging", search for "Test Coverage Dashboard"
5. Check this status check to make it required

## Setting Coverage Thresholds

To establish minimum coverage standards:

1. Edit your `jest.config.js` file to include coverage thresholds:
```javascript
module.exports = {
  // ... other config
  coverageThresholds: {
    global: {
      statements: 60, // Minimum statement coverage percentage
      branches: 50,   // Minimum branch coverage percentage
      functions: 60,  // Minimum function coverage percentage
      lines: 60       // Minimum line coverage percentage
    }
  }
}
```

2. You can also set module-specific thresholds:
```javascript
module.exports = {
  // ... other config
  coverageThresholds: {
    global: { 
      statements: 60, 
      branches: 50, 
      functions: 60, 
      lines: 60 
    },
    "./src/components/**/*.{ts,tsx}": {
      statements: 80, // Higher standards for UI components
      branches: 70,
      functions: 80, 
      lines: 80
    },
    "./src/lib/**/*.{ts,tsx}": {
      statements: 90, // Highest standards for core library code
      branches: 85,
      functions: 90,
      lines: 90
    }
  }
}
```

## Integrating with Pull Request Policies

For Azure DevOps or similar systems:

1. Create a policy that requires the coverage workflow to pass
2. Set a policy that coverage cannot decrease from the base branch

## Adding Coverage Badges to README

Add these badges to your README.md file:

```markdown
![Coverage](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/coverage-data/latest.json&label=coverage&query=$.totals.coverage&color=brightgreen&suffix=%)
![Statement Coverage](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/coverage-data/latest.json&label=statements&query=$.totals.statementCoverage&color=blue&suffix=%)
![Branch Coverage](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/coverage-data/latest.json&label=branches&query=$.totals.branchCoverage&color=orange&suffix=%)
```

## Dashboard Access in CI

To make the dashboard accessible from your CI system:

1. Store the dashboard as an artifact (already configured)
2. For persistent access, publish the dashboard to GitHub Pages:

```yaml
- name: Publish Dashboard to GitHub Pages
  if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    folder: coverage-dashboard
    branch: gh-pages
    target-folder: coverage-dashboard
```

3. Then access at: `https://YOUR_ORG.github.io/YOUR_REPO/coverage-dashboard/`

## Team Implementation Plan

1. **Initial Setup** (Day 1):
   - Add coverage thresholds to Jest config
   - Ensure CI workflow is running properly

2. **Education** (Week 1):
   - Run demo session with `npm run coverage:demo`
   - Share dashboard URL with all team members
   - Review PR with coverage comments

3. **Standard Enforcement** (Week 2+):
   - Gradually enable required status checks
   - Begin enforcing coverage thresholds
   - Use dashboard in sprint planning to prioritize test improvements

4. **Monitoring** (Ongoing):
   - Review coverage trends monthly
   - Adjust thresholds as needed
   - Celebrate coverage milestones

## Troubleshooting

If the CI dashboard generation fails:

1. Check that Jest is configured correctly with coverage reporting
2. Verify that the CI environment has proper permissions to run the scripts
3. Ensure coverage directory is included in artifact paths
4. Check CI logs for any errors during dashboard generation

## Support

For questions or issues with the coverage dashboard CI integration:
- See `TEST_COVERAGE_DASHBOARD.md` for dashboard usage details
- See `TESTING_PIPELINE.md` for general testing workflow information
- Create an issue with the label "coverage-dashboard" for technical problems
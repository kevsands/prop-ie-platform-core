# Git Workflow & Team Coordination Guide

**Date:** July 2, 2025  
**Team:** Ethan (Lead Developer), Nate's Team (External), Kevin (CTO)  
**Status:** ACTIVE - Immediate Implementation Required

---

## 🚨 Current State & Critical Actions

### Version Alignment Status
```bash
✅ Canonical Version: 231e13e2 (deployment/staging-ready)
❌ Ethan's Version: 35ac090c (9 commits behind)
⚠️  Action Required: Immediate version sync
```

### Immediate Actions for Ethan
```bash
# 1. Save current work
git stash push -m "WIP: microservice segmentation - pre-sync"

# 2. Update to canonical version
git fetch origin
git checkout deployment/staging-ready
git pull origin deployment/staging-ready

# 3. Verify correct version
git log --oneline -1
# Expected: 231e13e2 fix: Update API routes for Next.js 15 compatibility

# 4. Create microservice work branch
git checkout -b feature/microservice-extraction
git stash pop  # Restore previous work
```

---

## 🔄 Team Git Workflow

### Branch Strategy
```
main (protected)
├── deployment/staging-ready (protected) ← CANONICAL VERSION
├── feature/microservice-extraction (Ethan's work)
├── feature/external-team-assessment (Nate's team)
└── hotfix/* (emergency fixes only)
```

### Branch Protection Rules
```bash
Protected Branches:
├── main: Requires 2 approvals, CI/CD success
├── deployment/staging-ready: Requires 1 approval, build success
└── No direct pushes to protected branches
```

---

## 👥 Team Coordination Protocol

### Daily Coordination (Required)
```typescript
Daily Standup Items:
├── Current working branch & commit
├── Planned changes for the day
├── Merge conflicts or blockers
├── Integration points with other team members
└── Risk areas requiring coordination
```

### Communication Channels
```typescript
Coordination Methods:
├── Daily: Slack/WhatsApp for quick updates
├── Weekly: Video calls for architecture discussions  
├── Urgent: Phone calls for blocking issues
├── Documentation: Git commit messages + PR descriptions
└── Status: Regular updates on development progress
```

---

## 🔧 Development Workflow

### For Ethan's Microservice Work
```bash
# Daily workflow
git checkout feature/microservice-extraction
git pull origin deployment/staging-ready  # Daily sync with main
git merge deployment/staging-ready        # Resolve conflicts immediately

# Work on microservice extraction
# ... make changes ...

# Commit with descriptive messages
git add .
git commit -m "feat(auth): Extract authentication service from monolith

- Consolidate AuthContext and EnterpriseAuthContext  
- Create unified authentication interface
- Prepare for AWS Cognito decoupling
- Add service boundary documentation

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push regularly
git push origin feature/microservice-extraction
```

### For Nate's Team Assessment
```bash
# Setup assessment branch
git checkout deployment/staging-ready
git pull origin deployment/staging-ready
git checkout -b feature/external-team-assessment

# Assessment work
# ... analysis and documentation ...

# Commit assessment findings
git add .
git commit -m "docs(architecture): Add external team codebase assessment

- Comprehensive technical debt analysis
- Microservice extraction recommendations  
- AWS decoupling strategy
- Infrastructure modernization plan

External Assessment: Nate's Team (triplebolt.io)"

git push origin feature/external-team-assessment
```

### For Kevin's Coordination
```bash
# Monitor all branches
git fetch --all
git branch -a

# Review team progress
git log --oneline --graph --all -10

# Coordinate merges when ready
git checkout deployment/staging-ready
git merge feature/microservice-extraction  # When Ethan's work is ready
```

---

## 📋 Commit Message Standards

### Format Template
```
<type>(<scope>): <description>

<body explaining what and why>

<footer with co-authors/references>
```

### Examples
```bash
# Microservice extraction
feat(auth): Extract authentication microservice
feat(analytics): Consolidate analytics services
refactor(components): Unify dashboard components

# Infrastructure changes  
infra(aws): Add cloud-agnostic abstractions
devops(docker): Add microservice containerization
ci(pipeline): Implement service-specific builds

# Documentation
docs(api): Document microservice boundaries
docs(arch): Add technical debt analysis
docs(team): Update coordination procedures
```

---

## 🚀 Integration & Deployment

### Pre-merge Checklist
```typescript
Before Merging to deployment/staging-ready:
├── ✅ All tests passing locally
├── ✅ No TypeScript errors  
├── ✅ Server starts successfully (port 3001)
├── ✅ Critical APIs returning 200 responses
├── ✅ No merge conflicts with main branch
├── ✅ Code review approval (if applicable)
└── ✅ Integration test validation
```

### Testing Protocol
```bash
# Ethan's microservice testing
npm run dev                    # Server should start on port 3001
npm run typecheck             # No TypeScript errors
npm run lint                  # Code quality validation

# Critical endpoint testing
curl -I http://localhost:3001/developments/fitzgerald-gardens
curl http://localhost:3001/api/htb/status/f25c3f7c-23ce-404f-b9fa-d53ef97554b0
curl http://localhost:3001/api/notifications/user/f25c3f7c-23ce-404f-b9fa-d53ef97554b0

# All should return 200 OK
```

### Merge Strategy
```bash
# When microservice extraction is ready
git checkout deployment/staging-ready
git pull origin deployment/staging-ready
git merge feature/microservice-extraction --no-ff
git push origin deployment/staging-ready

# Tag significant milestones
git tag -a v1.5.0-microservice-auth -m "Authentication microservice extraction complete"
git push origin v1.5.0-microservice-auth
```

---

## ⚠️ Risk Management

### Conflict Resolution
```typescript
Merge Conflict Protocol:
├── Stop work immediately
├── Coordinate with affected team members
├── Create conflict resolution branch
├── Test thoroughly after resolution
└── Document resolution for future reference
```

### Emergency Procedures
```bash
# If critical issues arise
git checkout deployment/staging-ready
git checkout -b hotfix/urgent-issue-description

# Fix the issue
# ... emergency changes ...

git commit -m "hotfix: Description of critical issue fix"
git push origin hotfix/urgent-issue-description

# Immediate coordination with team
# Merge after minimal validation
```

### Rollback Procedures
```bash
# If deployment issues occur
git log --oneline -5
git revert <commit-hash>      # Safest option
# OR
git reset --hard <good-commit> # If private branch

# Coordinate rollback with team immediately
```

---

## 📊 Progress Tracking

### Weekly Metrics
```typescript
Track Weekly:
├── Commits per team member
├── Lines of code changed
├── Services extracted/consolidated
├── Test coverage improvements
├── Technical debt reduction
└── Integration success rate
```

### Status Dashboard
```bash
# Quick status check
git log --oneline --since="1 week ago" --author="Ethan"
git log --oneline --since="1 week ago" --author="Nate"
git log --oneline --since="1 week ago" --author="Kevin"

# Branch status
git branch -v
git status
```

---

## 🎯 Success Criteria

### Short-term Goals (2 weeks)
- [ ] All team members on same version (`231e13e2`)
- [ ] Daily coordination protocol established
- [ ] Microservice boundaries documented
- [ ] First service extraction branch created
- [ ] No merge conflicts or coordination issues

### Medium-term Goals (6 weeks)  
- [ ] Authentication microservice extracted
- [ ] Component consolidation in progress
- [ ] AWS decoupling strategy implemented
- [ ] CI/CD pipeline supporting microservices
- [ ] External team recommendations integrated

### Long-term Goals (3 months)
- [ ] 3+ microservices successfully extracted
- [ ] 40% reduction in service layer complexity
- [ ] Cloud-agnostic deployment capability
- [ ] Improved development velocity metrics
- [ ] Team scaling capability demonstrated

---

**Critical Note:** This workflow is designed to prevent the version misalignment issue from recurring while supporting parallel development efforts. Immediate implementation is required for successful team coordination.
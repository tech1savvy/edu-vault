# EduVault - Admin Features Implementation Plan

## Overview

5-phase plan with dedicated branches for each phase.

| Phase | Branch | Description |
|-------|--------|-------------|
| 1 | `admin/security-fixes` | Secure unprotected sync endpoints |
| 2 | `admin/user-management` | User list, roles, resume viewing |
| 3 | `admin/analytics-dashboard` | Stats, metrics, visualizations |
| 4 | `admin/job-enhancements` | Job status, categories, export |
| 5 | `admin/system-admin` | Audit logs, health, backups |

---

## Phase 1: Security Fixes

**Branch**: `admin/security-fixes` ✅ **COMPLETED**

**Objective**: Fix critical vulnerabilities in ML sync endpoints.

### Changes
| File | Change |
|------|--------|
| `server/features/ml/sync.routes.js` | Add `authenticateToken` to all routes; add `authorizeRoles('administrator')` to `/job` and `/all` |

### Files: 1 backend
- `server/features/ml/sync.routes.js` - Added auth middleware

### Route Protection
| Endpoint | Authentication | Admin Only |
|----------|---------------|------------|
| `POST /sync/resume/:userId` | ✅ Yes | No |
| `POST /sync/resume` | ✅ Yes | No |
| `POST /sync/job/:jobId` | ✅ Yes | ✅ Yes |
| `POST /sync/job` | ✅ Yes | ✅ Yes |
| `POST /sync/all` | ✅ Yes | ✅ Yes |

### Acceptance Criteria
- [x] All sync endpoints require authentication
- [x] `/sync/all` requires administrator role
- [x] Unauthorized requests return 401/403

**Completed**: 2026-03-22

---

## Phase 2: User Management

**Branch**: `admin/user-management`

**Objective**: Enable admins to view/manage users and see student resumes.

### Security Rules (Option B)
- Admins can view all users (including other admins)
- Admins can only modify **students** (role = 'student')
- Admins **cannot** modify other admins (role = 'administrator')
- Admins **cannot** modify their own account
- Non-admin users cannot access user management endpoints

### Database
**New Migration** (`YYYYMMDDHHMMSS-add-user-status.js`):
```javascript
addColumn('Users', 'status', ENUM('active', 'inactive', 'suspended'))
addColumn('Users', 'last_login', DATE)
```

### Backend Files (6)
| File | Purpose |
|------|---------|
| `server/features/user-management/userManagement.controller.js` | CRUD operations + security checks |
| `server/features/user-management/userManagement.service.js` | Business logic + authorization |
| `server/features/user-management/userManagement.repository.js` | DB queries |
| `server/features/user-management/userManagement.routes.js` | Routes with auth |
| `server/features/user-management/userManagement.validation.js` | Joi schemas |
| `server/routes.js` | Register routes |

### API Endpoints
```
GET    /api/users                    - List all users (admin)
GET    /api/users/:id               - Get user details (admin)
GET    /api/users/:id/resume        - Get full resume (admin)
PUT    /api/users/:id/role          - Change role (admin, students only)
PUT    /api/users/:id/status        - Change status (admin, students only)
```

### Backend Security Implementation
In `userManagement.service.js`:
```javascript
const updateRole = async (targetUserId, newRole, requestingAdminId) => {
  const targetUser = await repository.findById(targetUserId);
  
  // Cannot modify own account
  if (targetUserId === requestingAdminId) {
    throw new Error('Cannot modify your own role');
  }
  
  // Cannot modify other admins
  if (targetUser.role === 'administrator') {
    throw new Error('Cannot modify another administrator\'s role');
  }
  
  // Can only set role to 'student'
  if (newRole !== 'student') {
    throw new Error('Cannot assign administrator role via this endpoint');
  }
  
  return repository.updateRole(targetUserId, newRole);
};
```

### Frontend Files (5)
| File | Purpose |
|------|---------|
| `client/src/pages/UsersPage.jsx` | User list with filters, pagination |
| `client/src/pages/UserDetailPage.jsx` | User profile + full resume view |
| `client/src/services/adminApi.js` | Add user management methods |
| `client/src/App.jsx` | Add routes |
| `client/src/components/Navbar.jsx` | Add "Users" nav link |

### Frontend Security
- UsersPage: Hide role/status actions for other admins and self
- UserDetailPage: Disable role/status controls for admins and self
- Show appropriate error messages when restricted actions are attempted

### Acceptance Criteria
- [ ] User list page displays all users with pagination
- [ ] Admin can view any user's complete resume
- [ ] Role/status changes work for students only
- [ ] Admin cannot modify other admins (returns 403)
- [ ] Admin cannot modify own account (returns 403)
- [ ] Non-admin access blocked (returns 403)

---

## Phase 3: Analytics Dashboard

**Branch**: `admin/analytics-dashboard`

**Objective**: Provide platform statistics and insights.

### Database
**New Migration** (`YYYYMMDDHHMMSS-create-platform-stats.js`):
```javascript
createTable('MatchHistory', {
  id, job_id, user_id, match_score, matched_at
})
```

### Backend Files (6)
| File | Purpose |
|------|---------|
| `server/features/analytics/analytics.controller.js` | Stats endpoints |
| `server/features/analytics/analytics.service.js` | Compute metrics |
| `server/features/analytics/analytics.repository.js` | DB queries |
| `server/features/analytics/analytics.routes.js` | Routes |
| `server/models/matchHistory.js` | New model |
| `server/features/job-description/jobDescription.controller.js` | Save matches |

### API Endpoints
```
GET /api/analytics/dashboard  - Overview stats
GET /api/analytics/users      - User statistics
GET /api/analytics/jobs       - Job statistics
GET /api/analytics/matches    - Match statistics
```

### Frontend Files (3)
| File | Purpose |
|------|---------|
| `client/src/pages/AnalyticsPage.jsx` | Dashboard with charts |
| `client/src/pages/AnalyticsPage.css` | Styling |
| `client/src/services/adminApi.js` | Add analytics methods |

### Dashboard Features
- **Stats Cards**: Total Students, Jobs, Active Matches, Avg Completion Rate
- **Charts**: Resume completion distribution, Top skills, Matches over time
- **Recent Activity Table**: Last 20 actions

### Acceptance Criteria
- [ ] Dashboard displays all key metrics
- [ ] Charts render with real data
- [ ] Export functionality works
- [ ] Page loads within 2 seconds

---

## Phase 4: Job Enhancements

**Branch**: `admin/job-enhancements`

**Objective**: Job status workflow, categories, application tracking, export.

### Database
**New Migration** (`YYYYMMDDHHMMSS-add-job-status-categories.js`):
```javascript
// JobDescriptions
addColumn('status', ENUM('draft', 'active', 'archived', 'closed'))
addColumn('category', STRING)
addColumn('expires_at', DATE)

// New table
createTable('JobApplications', {
  id, job_id, user_id, status, notes, applied_at
})
addConstraint('unique_job_user_application')
```

### Backend Files (5)
| File | Purpose |
|------|---------|
| `server/models/jobApplication.js` | New model |
| `server/features/job-description/jobDescription.controller.js` | Add endpoints |
| `server/features/job-description/jobDescription.routes.js` | Add routes |
| `server/features/job-description/jobDescription.validation.js` | Update validation |
| `server/models/jobDescription.js` | Add new fields |

### API Endpoints
```
GET  /api/job-descriptions/statuses      - List statuses
GET  /api/job-descriptions/categories   - List categories
GET  /api/job-descriptions/:id/applications  - Get applicants
POST /api/job-descriptions/:id/apply    - Student apply
PUT  /api/job-descriptions/:id/applications/:appId  - Update status
GET  /api/job-descriptions/:id/export    - Export matches (csv/json)
```

### Frontend Files (5)
| File | Purpose |
|------|---------|
| `client/src/pages/AdminDashboardPage.jsx` | Enhanced with filters |
| `client/src/pages/JobDescriptionFormPage.jsx` | Add status/category fields |
| `client/src/pages/JobApplicationsPage.jsx` | Applicant management |
| `client/src/components/ExportButton.jsx` | Reusable export component |
| `client/src/services/adminApi.js` | Add application methods |

### Acceptance Criteria
- [ ] Job status workflow works correctly
- [ ] Students can apply to jobs
- [ ] Admins manage applications
- [ ] Export produces valid files

---

## Phase 5: System Administration

**Branch**: `admin/system-admin`

**Objective**: Audit logging, health monitoring, backup capabilities.

### Database
**New Migration** (`YYYYMMDDHHMMSS-create-audit-logs.js`):
```javascript
createTable('AuditLogs', {
  id, user_id, action, resource_type, resource_id,
  details (JSONB), ip_address, user_agent, created_at
})
```

### Backend Files (10)
| File | Purpose |
|------|---------|
| `server/features/audit-logs/` (5 files) | Audit log management |
| `server/features/health/` (3 files) | Health check endpoints |
| `server/features/admin/` (4 files) | Backup/restore/settings |
| `server/middleware/audit.js` | Auto-logging middleware |
| `server/models/auditLog.js` | New model |

### API Endpoints
```
# Health
GET /api/health              - Basic health
GET /api/health/detailed     - Detailed (admin)

# Audit
GET /api/audit-logs              - List logs
GET /api/audit-logs/:id           - Get log
GET /api/audit-logs/resource/:type/:id - By resource
GET /api/audit-logs/user/:id      - By user

# Admin
POST   /api/admin/backup          - Create backup
GET    /api/admin/backups         - List backups
GET    /api/admin/backups/:id/download
POST   /api/admin/backups/:id/restore
GET    /api/admin/settings
PUT    /api/admin/settings
```

### Frontend Files (5)
| File | Purpose |
|------|---------|
| `client/src/pages/SystemAdminPage.jsx` | Health status + actions |
| `client/src/pages/SystemAdminPage.css` | Styling |
| `client/src/pages/AuditLogsPage.jsx` | Filterable log viewer |
| `client/src/pages/SettingsPage.jsx` | System configuration |
| `client/src/services/adminApi.js` | Add system methods |

### System Admin Features
- **Health Dashboard**: DB, ML, Qdrant status + memory/uptime
- **Quick Actions**: Full sync, Create backup, Clear cache
- **Backups Table**: Download/restore previous backups
- **Audit Logs**: Filterable by action, resource, user, date
- **Settings**: Sync interval, match threshold, notifications

### Acceptance Criteria
- [ ] Health dashboard shows real-time status
- [ ] Audit logs capture all admin actions
- [ ] Backup files are downloadable
- [ ] Settings persist correctly

---

## Implementation Order

```
Phase 1 ──────► Phase 2 ──────► Phase 3 ────┐
       └───────────────────────────────┼─────┼─────► Phase 5
                       Phase 4 ──────► ────┘
```

**Notes**:
- Phase 1 must be first (security)
- Phase 3 depends on MatchHistory (Phase 2/4)
- Phase 4 can parallel Phase 2-3
- Phase 5 is last (adds monitoring)

---

## File Count Summary

| Phase | Backend | Frontend | Migrations |
|-------|---------|----------|------------|
| 1 | 1 | 0 | 0 |
| 2 | 6 | 5 | 1 |
| 3 | 6 | 3 | 1 |
| 4 | 5 | 5 | 2 |
| 5 | 10 | 5 | 1 |
| **Total** | **28** | **17** | **5** |

---

## Rollback Plan

1. Each phase has isolated migration
2. Use `sequelize-cli db:migrate:undo` to rollback
3. Delete branch, recreate from `main`
4. Document issues in PR for next attempt

---

## Created
2026-03-22

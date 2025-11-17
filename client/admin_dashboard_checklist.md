# Admin Dashboard Implementation Checklist

This checklist outlines the steps for implementing the Admin Dashboard in the frontend, based on the `client/implementation_plan.md`. Commits will be made after each grouped feature is completed.

---

## Group 1: Authentication Context

*   **1.1 Create `client/src/context/AuthContext.jsx`**
    *   [x] Define `AuthContext` and `AuthProvider`.
    *   [x] Manage `user` state (including `role`) and `token`.
    *   [x] Provide `login`, `logout` functions.

*   **1.2 Update `client/src/App.jsx` to wrap `Routes` with `AuthProvider`.**
    *   [x] Import `AuthProvider` from `AuthContext.jsx`.
    *   [x] Wrap the `<Routes>` component with `<AuthProvider>`.

---

## Group 2: Admin API Service

*   **2.1 Create `client/src/services/adminApi.js`**
    *   [x] Create an Axios instance for admin-specific API calls.
    *   [x] Implement an Axios interceptor to automatically attach the `Authorization` token from `AuthContext` to requests.
    *   [x] Implement error handling within `adminApi.js`, such as redirecting to the login page on 401 Unauthorized errors.
    *   [x] Implement functions for:
        *   [x] `getJobDescriptions()`
        *   [x] `getJobDescriptionById(id)`
        *   [x] `createJobDescription(data)`
        *   [x] `updateJobDescription(id, data)`
        *   [x] `deleteJobDescription(id)`
        *   [x] `matchJobDescription(id, topN)`
        *   [x] `triggerFullSync()`

---

## Group 3: Job Description Form Page

*   **3.1 Create `client/src/pages/JobDescriptionFormPage.jsx`**
    *   [x] Implement a form with fields for `title`, `description`, `requirements` using a simple stacked layout.
    *   [x] Handle both creation and editing logic based on route parameters. For editing, the component will fetch the job description by ID to populate the form.
    *   [x] Integrate with `adminApi.js` for `POST` and `PUT` requests.
    *   [x] Implement basic "required" validation for all fields.
    *   [x] After successfully creating or updating a job description, redirect the user back to the `AdminDashboardPage`.

---

## Group 4: Admin Dashboard Page

*   **4.1 Create `client/src/pages/AdminDashboardPage.jsx`**
    *   [ ] Update API calls to use `adminApi.js`.
    *   [ ] Implement logic to display match results on the dashboard as a list of cards, limited by `topN`. These results will persist until another match operation is performed or the page is refreshed.
    *   [ ] Refine styling using Bootstrap classes.
    *   [ ] Use `AuthContext` to check for admin role.
    *   [ ] Implement navigation to `JobDescriptionFormPage` for viewing job description details.
    *   [ ] Implement "Edit" and "Delete" actions on job description cards using simple buttons.

---

## Group 5: Routing and Navigation

*   **5.1 Create `client/src/components/AdminRoute.jsx`**
    *   [ ] Implement an `AdminRoute` wrapper component to protect routes, redirecting unauthorized users to the login page.

*   **5.2 Update `client/src/App.jsx`**
    *   [ ] Import `AdminDashboardPage` and `JobDescriptionFormPage`.
    *   [ ] Add new `Route` components for `/admin/dashboard`, `/admin/job-descriptions/new`, and `/admin/job-descriptions/edit/:id`, protected by `AdminRoute`.

*   **5.3 Update `client/src/components/Navbar.jsx`**
    *   [ ] Use `AuthContext` to conditionally render a link to `/admin/dashboard` only if the logged-in user has an `administrator` role.
    *   [ ] Set link text to "Admin Dashboard", place it in the right corner, and set its text color to green.

---

## Group 6: Testing

*   **6.1 Manually test all functionalities:**
    *   [ ] Viewing job descriptions.
    *   [ ] Creating job descriptions.
    *   [ ] Editing job descriptions.
    *   [ ] Deleting job descriptions.
    *   [ ] Matching resumes.
    *   [ ] Triggering full sync.

*   **6.2 Verify authentication and authorization for admin routes.**
    *   [ ] Ensure only admin users can access admin routes.
    *   [ ] Ensure non-admin users are redirected to the login page.

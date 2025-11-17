# Admin Dashboard Implementation Plan

## Objective
To create an administrative dashboard in the frontend that allows authorized users to manage job descriptions and trigger full synchronization of semantic search indexes, based on the updated API documentation.

## Features

The Admin Dashboard will provide the following functionalities:

1.  **Job Description Management**:
    *   **View Job Description Details**: Clicking on a job description will navigate to the `JobDescriptionFormPage` (in read-only mode or with disabled fields) to display its full details.
    *   **Create New Job Description**: Provide a form to add a new job description.
    *   **Edit Job Description**: Allow editing of an existing job description.
    *   **Delete Job Description**: Enable removal of a job description.
    *   **Match Job Description with Resumes**: Trigger a semantic search to find and rank resumes that best match a selected job description. Display the results.

2.  **Synchronization**:
    *   **Trigger Full Synchronization**: Provide a button to initiate a full re-indexing of all user resumes and job descriptions for semantic search.

## Frontend Components

The following new React components will be created or modified:

*   **`client/src/pages/AdminDashboardPage.jsx`**: The main dashboard component, responsible for displaying job descriptions, managing them, and triggering synchronization.
*   **`client/src/pages/JobDescriptionFormPage.jsx` (New)**: A reusable form component for creating and editing job descriptions.
*   **`client/src/services/api.js` (Modification)**: Add new API client functions for the admin-specific endpoints.
*   **`client/src/App.jsx` (Modification)**: Add routes for the `AdminDashboardPage` and `JobDescriptionFormPage`.
*   **`client/src/components/Navbar.jsx` (Modification)**: Potentially add a link to the Admin Dashboard for admin users.

## API Integration

2.  **API Integration**:
    *   **Action**: Create a separate `client/src/services/adminApi.js` for admin-specific API calls. This will keep `client/src/services/api.js` cleaner and maintain a clear separation of concerns. This `adminApi.js` will be configured to use the same base URL as `api.js` and will include the authentication token from the `AuthContext`.
    *   **Error Handling**: `adminApi.js` will simply re-throw errors for calling components to handle.

The frontend will interact with the following backend API endpoints:

*   **Job Description Endpoints**:
    *   `GET /api/job-descriptions`
    *   `GET /api/job-descriptions/{jobDescriptionId}`
    *   `POST /api/job-descriptions`
    *   `PUT /api/job-descriptions/{jobDescriptionId}`
    *   `DELETE /api/job-descriptions/{jobDescriptionId}`
    *   `POST /api/job-descriptions/{jobDescriptionId}/match`
*   **Synchronization Endpoint**:
    *   `POST /api/sync/all`

All requests will require a Bearer Token for authentication, and most will require an `administrator` role.

## Routing

New routes will be added to `client/src/App.jsx`:

*   `/admin/dashboard`: For the `AdminDashboardPage`.
*   `/admin/job-descriptions/new`: For creating a new job description.
*   `/admin/job-descriptions/edit/:id`: For editing an existing job description.

These routes will need to be protected to ensure only authenticated admin users can access them.

## Styling

Bootstrap classes will be used for styling to maintain consistency with the existing application setup.

## Development Steps

1.  **Create `client/src/context/AuthContext.jsx`**:
    *   Define `AuthContext` and `AuthProvider`.
    *   Manage `user` state (including `role`) and `token`.
    *   Provide `login`, `logout` functions.

2.  **Create `client/src/services/adminApi.js`**:
    *   Create an Axios instance for admin-specific API calls.
    *   Implement an Axios interceptor to automatically attach the `Authorization` token from `AuthContext` to requests.
    *   Implement error handling within `adminApi.js`, such as redirecting to the login page on 401 Unauthorized errors.
    *   Implement functions for: `getJobDescriptions()`, `getJobDescriptionById(id)`, `createJobDescription(data)`, `updateJobDescription(id, data)`, `deleteJobDescription(id)`, `matchJobDescription(id, topN)`, `triggerFullSync()`.

3.  **Create `client/src/pages/JobDescriptionFormPage.jsx`**:
    *   Implement a form with fields for `title`, `description`, `requirements` using a simple stacked layout.
    *   Handle both creation and editing logic based on route parameters. For editing, the component will fetch the job description by ID to populate the form.
    *   Integrate with `adminApi.js` for `POST` and `PUT` requests.
    *   **Form Submission Success**: After successfully creating or updating a job description, the user will be redirected back to the `AdminDashboardPage`.
    *   **Form Validation**: Implement basic "required" validation for all fields.

4.  **Modify `client/src/pages/AdminDashboardPage.jsx`**:
    *   Update API calls to use `adminApi.js`.
    *   Implement logic to display match results on the dashboard as a list of cards, limited by `topN`. These results will persist until another match operation is performed or the page is refreshed.
    *   Refine styling using Bootstrap classes.
    *   Use `AuthContext` to check for admin role.
    *   **Job Description Details**: Clicking on a job description will navigate to the `JobDescriptionFormPage` to display its full details.
    *   **Job Description Card Actions**: "Edit" and "Delete" actions on job description cards will be implemented using simple buttons.

5.  **Update `client/src/App.jsx`**:
    *   Import `AuthContext` and wrap the `Routes` with `AuthProvider`.
    *   Import `AdminDashboardPage` and `JobDescriptionFormPage`.
    *   Add new `Route` components for `/admin/dashboard`, `/admin/job-descriptions/new`, and `/admin/job-descriptions/edit/:id`.
    *   Implement an `AdminRoute` wrapper component (in a separate file, e.g., `client/src/components/AdminRoute.jsx`) to protect these routes, redirecting unauthorized users to the login page.

6.  **Update `client/src/components/Navbar.jsx`**:
    *   Use `AuthContext` to conditionally render a link to `/admin/dashboard` only if the logged-in user has an `administrator` role.
    *   The link text will be "Admin Dashboard", it will be placed in the right corner of the Navbar, and its text color will be green.

7.  **Testing**:
    *   Manually test all functionalities: viewing, creating, editing, deleting job descriptions, matching resumes, and triggering sync.
    *   Verify authentication and authorization for admin routes.

This plan will guide the implementation of the Admin Dashboard.

## Authentication and Authorization

1.  **Authentication and Authorization**:
    *   **Action**: Create a new React Context (`AuthContext`) for managing user authentication and authorization, including the user's role. This context will provide the current user's information and methods for login/logout. Components will consume this context to determine access and display appropriate UI.

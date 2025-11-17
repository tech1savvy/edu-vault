# Manual Testing Plan

This document provides a step-by-step guide to manually verify that the new resume ranking feature is working correctly.

## Prerequisites

1.  **Running Application:** Make sure the server is running, preferably in development mode: `npm run dev`.
2.  **Environment Variables:** Your `.env` file must be correctly configured with valid credentials for your database AND for Pinecone (`PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`).
3.  **Postman:** You will need an API client like Postman to test the endpoints.
4.  **Database:** Your database should be migrated with `npx sequelize-cli db:migrate`.
5.  **User Accounts:** For best results, ensure you have:
    - At least two "student" users created.
    - At least one "administrator" user created.

---

## Part 1: Verifying Synchronization with Pinecone

This part tests the "invisible" background processes that sync your resume and job data to the Pinecone vector database.

### Test Case 1.1: Resume Data Sync

1.  **Action:** Using Postman, log in as a student user and add several pieces of information to their resume (e.g., an experience entry, a few skills, and a project).
2.  **Verification:**
    - Log in to your [Pinecone dashboard](https://app.pinecone.io/).
    - Navigate to your project and select the `eduvault-resumes` index.
    - You should see that the "Vector count" is **1**.
    - The vector ID should be `user-<userId>`, where `<userId>` is the ID of the student you used.
3.  **Action:** Update one of the resume items you just created (e.g., change the description of the project).
4.  **Verification:**
    - In the Pinecone dashboard, the "Vector count" should still be **1**. The system should have updated the existing vector, not created a new one.

### Test Case 1.2: Job Description Data Sync

1.  **Action:** Using Postman, log in as an **administrator** and create a new Job Description via the `POST /api/job-descriptions` endpoint.
2.  **Verification:**
    - In the Pinecone dashboard for the `eduvault-resumes` index, you should now see the "Vector count" increase to **2**.
    - You can use the "Query" feature in the dashboard to fetch the new vector by its ID (e.g., `job-<jobId>`) to confirm it was stored correctly.

---

## Part 2: Testing the Job Matching API (Postman)

This part tests the main feature endpoint.

### Test Setup

Before running these tests, create the following data:
-   **Student A:** A student user whose resume is filled with terms related to **"Frontend Development," "React," "JavaScript," and "CSS."**
-   **Student B:** A student user whose resume is filled with terms related to **"Backend Engineering," "Node.js," "Databases," and "SQL."**
-   **Job Posting:** An administrator creates a job description for a **"React Frontend Developer"** role. Note the ID of this job posting.

### Test Case 2.1: Successful Match

1.  **Request:**
    - **Method:** `POST`
    - **URL:** `http://localhost:8000/api/job-descriptions/<jobId>/match` (replace `<jobId>` with the ID of the "React Frontend Developer" job).
    - **Authorization:** Set `Bearer Token` to your **administrator's** JWT token.
    - **Body (raw, JSON):**
      ```json
      {
        "top_n": 5
      }
      ```
2.  **Expected Result:**
    - **Status:** `200 OK`.
    - **Body:** A JSON array of candidates.
      - **Student A should be the first result** in the array and have the highest `score`.
      - Student B should be ranked lower or not appear at all.
      - The user object for Student A should contain their `id`, `name`, `email`, and `role`.

### Test Case 2.2: No Matches Found

1.  **Action:** Create a new job description with nonsensical text (e.g., "lorem ipsum dolor sit amet").
2.  **Request:** Repeat the Postman request from Test Case 2.1, but use the ID of this new nonsensical job.
3.  **Expected Result:**
    - **Status:** `200 OK`.
    - **Body:** An empty array `[]`.

### Test Case 2.3: Unauthorized Access

1.  **Request:** Repeat the Postman request from Test Case 2.1, but this time set the `Bearer Token` to a **student's** JWT token.
2.  **Expected Result:**
    - **Status:** `403 Forbidden`. The endpoint should be accessible only by administrators.

---

## Part 3: Verifying Error Logging

This test ensures that if Pinecone synchronization fails, the error is logged correctly without crashing the application.

1.  **Action:** Stop the server.
2.  **Action:** In your `.env` file, change the `PINECONE_API_KEY` to an invalid value (e.g., `12345-invalid-key`).
3.  **Action:** Restart the server (`npm run dev`).
4.  **Action:** Using Postman, make a valid request to update any part of a student's resume (e.g., add a new skill). The request itself should succeed with a `200 OK` or `201 Created` status.
5.  **Verification:**
---

## Part 4: Verifying Bulk Synchronization

This test ensures the new `POST /api/sync/all` endpoint correctly triggers a re-synchronization of all data.

1.  **Setup:**
    - In your Pinecone dashboard, delete all vectors from the `eduvault-resumes` index to simulate a fresh start. The vector count should be 0.
    - Ensure you have data in your local database by running the seeder (`npx sequelize-cli db:seed:all`). This should give you 2 users and 1 admin.
2.  **Request (Postman):**
    - **Method:** `POST`
    - **URL:** `http://localhost:8000/api/sync/all`
    - **Authorization:** Set `Bearer Token` to your **administrator's** JWT token.
    - **Body:** None
3.  **Expected Result:**
    - You should receive an **immediate** response with a `202 Accepted` status code and the body:
      ```json
      {
        "message": "Synchronization process started."
      }
      ```
    - Wait for about 15-30 seconds for the background process to run.
    - In your Pinecone dashboard, refresh the index view. The "Vector count" should now be **3** (2 resumes + 1 job description from the seeder).
    - Check your server console for the log message: `Bulk synchronization process initiated for all items.`

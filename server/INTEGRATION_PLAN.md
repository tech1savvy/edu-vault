
# Resume Ranking Integration Plan

This document outlines the plan to integrate a resume-to-job-description ranking system into the EduVault backend.

## 1. Objective

To implement a feature that allows ranking of student resumes against a given job description based on semantic similarity. This will be achieved by generating vector embeddings for all resumes and job descriptions and using a vector database to find and rank the best matches.

## 2. Core Technologies

- **Vector Embeddings:** `@xenova/transformers` (using the `Xenova/all-MiniLM-L6-v2` model)
- **Vector Database:** `@pinecone-database/pinecone`

## 3. Phased Implementation

### Phase 1: Setup and Configuration

1.  **Add Dependencies:** Install the required NPM packages: `@xenova/transformers` and `@pinecone-database/pinecone`.
2.  **Environment Variables:** Add `PINECONE_API_KEY` and `PINECONE_ENVIRONMENT` to `.env.example`.
    - **Integration:** These variables will be loaded into the application's central configuration object via `config/config.js`.
3.  **Pinecone Initialization:** Create a new service to initialize the Pinecone client.
    - The index will be named `eduvault-resumes` and use the `cosine` similarity metric.
    - The service will use a singleton pattern to manage the embedding model.

### Phase 2: Resume Vectorization & Synchronization

1.  **Create ML Service:** Establish a new centralized service (`features/ml/ml.service.js`) for all vector operations.
2.  **Aggregate Resume Data:** Create a function to compile resume parts into a single text document with structured headers.
3.  **Real-time Sync:** Modify resume component services to call the ML service after any CUD operation to upsert the resume vector to Pinecone.
    - **Vector ID:** `user-<userId>`
    - **Metadata:** `{ type: 'resume', userId: <userId> }`
4.  **Error Handling:** Synchronization errors will be logged to a dedicated `pinecone-sync.log` file without failing the primary user action.

### Phase 3: Job Description Synchronization

1.  **Update Service Logic:** Modify `jobDescription.service.js` to call the ML service on CUD operations.
2.  **Upsert to Pinecone:** The ML service will generate and upsert the job description embedding to the same Pinecone index.
    - **Vector ID:** `job-<jobId>`
    - **Metadata:** `{ type: 'job', jobId: <jobId> }`

### Phase 4: Job Matching API

1.  **Create New Endpoint:** `POST /api/job-descriptions/:id/match` (Admin only)
2.  **Implement Logic:**
    - **Request Body:** Expects `{ "top_n": 5 }`.
    - **Service Logic (Two-Step Query):**
        a. Fetch the job vector from Pinecone (ID: `job-<jobId>`).
        b. Use the job vector to query Pinecone for the top `N` resume vectors.
        c. Fetch user details from PostgreSQL for the results.
    - **Response Body:** Return a ranked list of candidates (`name`, `email`, `role`, `score`).
        - If no matches are found, the API will return an empty array `[]` with a `200 OK` status.
    - **Resiliency:** On-the-fly vector generation for jobs missing from Pinecone.

### Phase 5: Manual Bulk Synchronization

1.  **Create New Endpoint:** Add a new route for bulk synchronization:
    - **Method:** `POST`
    - **Endpoint:** `/api/sync/all`
    - **Auth:** Admin User
2.  **Implement Logic:**
    - The API will return an immediate `202 Accepted` response to indicate the process has started.
    - In the background, the service will:
        a. Fetch all users from the database and call `syncResume` for each one.
        b. Fetch all job descriptions from the database and call `syncJobDescription` for each one.

### Phase 6: Future Enhancements (Post-MVP)

1.  **Background Processing:** Move the synchronization logic to a background job queue.
2.  **Advanced PII Redaction:** Implement a utility to scan and clean resume text.

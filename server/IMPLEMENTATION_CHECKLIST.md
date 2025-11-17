# Implementation Checklist

This checklist breaks down the integration plan into granular, actionable steps.

### Phase 1: Setup and Configuration

- [ ] **Dependencies**
  - [ ] Install `@xenova/transformers` via npm.
  - [ ] Install `@pinecone-database/pinecone` via npm.
- [ ] **Environment & Config**
  - [ ] Add `PINECONE_API_KEY` to `.env.example`.
  - [ ] Add `PINECONE_ENVIRONMENT` to `.env.example`.
  - [ ] Update `config/config.js` to load and export the Pinecone variables from `process.env`.
- [ ] **Logging**
  - [ ] Update `config/logger.js` to add a new Winston file transport for `pinecone-sync.log`.
- [ ] **ML Service Scaffolding**
  - [ ] Create new directory: `features/ml`.
  - [ ] Create `features/ml/embedding.service.js` for the embedding model singleton.
  - [ ] Create `features/ml/pinecone.service.js` for the Pinecone client and operations.
  - [ ] Create `features/ml/index.js` to export the services.

### Phase 2: Core ML Service Implementation

- [ ] **Embedding Service (`embedding.service.js`)**
  - [ ] Implement a singleton class or object to manage the `Xenova/all-MiniLM-L6-v2` model.
  - [ ] Add a `getInstance` method that loads the model on first call and returns the same instance subsequently.
  - [ ] Create a `generateEmbedding(text)` method within the service.
- [ ] **Pinecone Service (`pinecone.service.js`)**
  - [ ] Initialize the Pinecone client using the variables from `config/config.js`.
  - [ ] Implement an `init` function that checks if the `eduvault-resumes` index exists and creates it if not (using `cosine` metric and dimension 384).
  - [ ] Create an `upsert(vector)` method that handles upserting to Pinecone.
  - [ ] Create a `fetch(id)` method to retrieve a single vector by its ID.
  - [ ] Create a `query(vector, topK, filter)` method to perform the similarity search.

### Phase 3: Resume & Job Description Synchronization

- [ ] **Resume Data Aggregation**
  - [ ] Create a new file `features/resume/resume.aggregator.js`.
  - [ ] Implement a function `getAggregatedResumeText(userId)` that:
    - [ ] Fetches all resume components (heading, skills, experience, etc.) for a given user.
    - [ ] Formats the data into a single string with structured headers.
    - [ ] Correctly groups multiple entries and omits empty sections.
- [ ] **Resume Sync Hooks**
  - [ ] In each resume component service (e.g., `skill.service.js`, `experience.service.js`):
    - [ ] Import the aggregator and the Pinecone service.
    - [ ] After each `create`, `update`, and `delete` function, add a call to a new `syncResume(userId)` function.
    - [ ] The `syncResume` function will get the aggregated text, generate an embedding, and call the Pinecone `upsert` method with the correct ID (`user-<userId>`) and metadata.
    - [ ] Wrap the `syncResume` call in a `try...catch` block and log any errors to the `pinecone-sync.log` file.
- [ ] **Job Description Sync Hooks**
  - [ ] In `jobDescription.service.js`:
    - [ ] Import the embedding and Pinecone services.
    - [ ] After the `create` and `update` functions, add a call to a new `syncJobDescription(jobId)` function.
    - [ ] The `syncJobDescription` function will get the job text, generate an embedding, and call Pinecone `upsert` with the correct ID (`job-<jobId>`) and metadata.
    - [ ] Wrap the call in a `try...catch` block and log errors to `pinecone-sync.log`.

### Phase 4: Job Matching API

- [x] **API Route**
  - [x] Add the `POST /:id/match` route to `features/job-description/jobDescription.routes.js`, pointing to a new controller function.
- [x] **Validation**
  - [x] Add a new validation schema in `jobDescription.validation.js` for the match request, requiring `top_n` to be an integer.
- [x] **Controller (`jobDescription.controller.js`)**
  - [x] Create the `matchJob` controller function.
  - [x] It should call the corresponding service function and send the results.
- [x] **Service (`jobDescription.service.js`)**
  - [x] Create the `matchJob(jobId, topN)` service function.
  - [x] **Step 1: Get Job Vector**
    - [x] Call the Pinecone service to `fetch` the vector for `job-<jobId>`.
    - [x] If the vector is not found, fetch the job from PostgreSQL, generate the embedding on-the-fly, and proceed.
  - [x] **Step 2: Query for Resumes**
    - [x] Call the Pinecone service's `query` method with the job vector, `topN`, and a filter for `{ type: 'resume' }`.
  - [x] **Step 3: Format Results**
    - [x] If the query returns no results, return an empty array `[]`.
    - [x] Extract the `userId` from the match results.
    - [x] Fetch the corresponding user details (`name`, `email`, `role`) from the `users` or `headings` table.
    - [x] Combine the user details with the similarity `score` and return the final ranked list.

### Phase 5: Manual Bulk Sync API

- [ ] **Repository**
  - [ ] Add `findAll()` method to `features/user/user.repository.js`.
- [ ] **Scaffolding**
  - [ ] Create new directory: `features/sync`.
  - [ ] Create `features/sync/sync.routes.js`.
  - [ ] Create `features/sync/sync.controller.js`.
- [ ] **Service (`sync.service.js`)**
  - [ ] Add a `syncAll()` function that fetches all users and jobs and calls the respective sync functions for each item.
- [ ] **Routing**
  - [ ] Mount the new sync routes at `/api/sync` in the main `routes.js` file.

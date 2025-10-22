# Resume Embedding and Retrieval Workflow

This document outlines the steps to implement the resume embedding and retrieval feature. The goal is to take a user's complete resume data, process it, and store it in a vector database for semantic search against job profiles.

## Workflow Overview

The process can be broken down into three main parts:

1.  **Client-Side Data Collection:** Gather all resume sections from the client application into a single, structured object.
2.  **Server-Side Processing & Embedding:** Receive the data on the server, prepare it for embedding, generate vector embeddings, and store them.
3.  **Retrieval (Future Task):** Use a job profile to query the vector database and find the most relevant resumes.

---

## Step 1: Client-Side Implementation (React)

The first step is to collect all the resume data that is currently managed by the `ResumeContext`.

1.  **Create a Data Aggregation Function:**
    *   In the client, create a function that accesses the `ResumeContext` and pulls data from all the different states (`heading`, `education`, `experiences`, etc.).
    *   This function will compile all the data into a single, well-structured JSON object. For example:
        ```json
        {
          "heading": { ... },
          "education": [ ... ],
          "experiences": [ ... ],
          "projects": [ ... ],
          "skills": [ ... ],
          "achievements": [ ... ],
          "certifications": [ ... ]
        }
        ```

2.  **Create a "Process Resume" Button:**
    *   Add a new button to the UI (e.g., in the `Navbar.jsx` or a new component).
    *   When this button is clicked, it will trigger the data aggregation function.

3.  **Send Data to Server:**
    *   Upon clicking the button, make a `POST` request to a new server endpoint (e.g., `/api/resume/process`).
    *   The body of this request will be the aggregated JSON object of the resume data.

---

## Step 2: Server-Side Implementation (Node.js)

On the server, we will receive the resume data, process it for embedding, and store it.

1.  **Choose and Set Up a Vector Database:**
    *   A vector database needs to be chosen. Popular options include **Pinecone** (cloud-based), **Chroma DB** (open-source, can be self-hosted), or **Weaviate**.
    *   Install the corresponding Node.js client library for the chosen database (e.g., `@pinecone-database/pinecone`).
    *   Configure the connection to the database, likely involving API keys and environment variables in the `.env` file.

2.  **Choose an Embedding Model/Service:**
    *   We need a way to convert text into vector embeddings.
    *   **Option A (API-based):** Use a service like **OpenAI's Embedding API** or **Cohere's Embed API**. This is often easier to implement.
    *   **Option B (Local Model):** Use a library like `@xenova/transformers` to run an embedding model directly on the server. This is more complex but avoids external API calls.

3.  **Create a New "Process" Endpoint:**
    *   In the server's `routes.js`, create a new route: `router.post('/resume/process', handleProcessResume);`.
    *   Create a new handler function, `handleProcessResume`.

4.  **Implement the Processing Logic:**
    *   **Data Chunking:** The handler will receive the resume JSON. It needs to break down the resume into meaningful "chunks" of text. For example, each experience, project, or education entry could be a chunk. A simple approach is to stringify each object in the arrays.
        ```javascript
        // Example chunk:
        "Role: Software Engineer, Company: Google, Details: Developed and maintained various software."
        ```
    *   **Generate Embeddings:** For each chunk of text, call the chosen embedding service/model to get its vector embedding.
    *   **Store in Vector DB:** Store each chunk's text and its corresponding vector embedding in the vector database. It's crucial to also store the `user_id` or a unique `resume_id` with each vector to associate it with the original user.

---

## Step 3: Retrieval Workflow (Future Task)

This part will be implemented after the embedding and storage are complete.

1.  **Job Profile Input:** Create a new UI where a user can paste a job description or profile.
2.  **Generate Job Profile Embedding:**
    *   Send the job profile text to a server endpoint.
    *   The server will use the *same* embedding model to generate a vector embedding for the job profile.
3.  **Query the Vector Database:**
    *   Use the job profile's vector to query the vector database.
    *   The database will perform a similarity search (e.g., cosine similarity) and return the most similar resume chunks.
4.  **Display Results:**
    *   The server will receive the top matching chunks.
    *   It can then retrieve the full resume(s) associated with those chunks (using the stored `user_id` or `resume_id`).
    *   The client will then display the most relevant resumes to the user.

---

## Implementation To-Do List

### Part 1: Environment Setup

- [x] **Server:** Install Pinecone and Google AI dependencies.
  - `npm install @pinecone-database/pinecone`
  - `npm install @google/generative-ai`
- [x] **Server:** Update `.env` file with new API keys.
  - `PINECONE_API_KEY=your_pinecone_api_key`
  - `GEMINI_API_KEY=your_gemini_api_key`

### Part 2: Server-Side Implementation

- [x] **Pinecone:** Create a script to initialize the Pinecone index (e.g., `utils/db/setupPinecone.js`).
- [x] **New Feature:** Create a new feature folder `server/features/process`.
- [x] **Routing:** Inside the new folder, create `process.routes.js` to define the `POST /` endpoint.
- [x] **Handler:** Create `process.handlers.js` with an async `handleProcessResume` function.
- [x] **Logic:** Create `process.js` to contain the core logic (with placeholders).
- [ ] **Chunking:** Implement a function to convert the incoming resume JSON into an array of text chunks.
- [ ] **Embedding:** Implement a function that takes a text chunk and uses the Gemini API (`@google/generative-ai`) to generate an embedding for it.
- [ ] **Storage:** Implement a function to take the chunks, their embeddings, and the user ID, and `upsert` them into the Pinecone index.
- [x] **Main Router:** Wire up the new process router in `server/routes.js`.

### Part 3: Client-Side Implementation

- [x] **UI:** Add a "Process Resume for AI" button to `client/src/components/Navbar.jsx`.
- [x] **Data Aggregation:** Create a function to access `ResumeContext` and combine data into a single JSON object.
- [x] **API Call:** Implement the `onClick` handler to POST the data to the server.


- try to add git commits so that we can keep track of what is changes or what progress is made.
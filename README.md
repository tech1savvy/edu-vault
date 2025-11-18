# EduVault: AI-Augmented Centralized Student Profiling

EduVault is a comprehensive platform designed to centralize student achievements and records for Higher Education Institutions (HEIs). It provides a digital solution for cataloging academic, co-curricular, and extracurricular activities, empowering students to build dynamic, verified portfolios and enabling institutions to streamline reporting for accreditation and audits.

## About the Project

EduVault addresses the challenge of fragmented student records by offering a unified, verifiable, and analytics-ready platform. It captures a holistic view of a student's journey, from enrollment to graduation, and provides tools for both students and administrators to leverage this information effectively.

### Key Features

- **Dynamic Resume Builder:** EduVault allows students to build a comprehensive, professional resume section by section. The following sections are supported:
  - Heading (name, contact information, etc.)
  - Professional Experience
  - Education
  - Projects
  - Skills
  - Achievements
  - Certifications

- **Portfolio Generation:** The platform can generate different portfolio layouts from the user's resume data, providing a professional and visually appealing presentation of their skills and experience.

- **Administrator Dashboard:** A dedicated dashboard for administrators provides an overview of the platform's data and access to powerful features, including:
  - **Job Description Management:** Administrators can create, read, update, and delete job descriptions.
  - **AI-Powered Resume Matching:** For any given job description, administrators can trigger an AI-powered matching process to find the most suitable candidates from the platform's user base. The system returns a list of top candidates with a similarity score for each.
  - **Data Synchronization:** Administrators can trigger a full synchronization of all resume and job description data with the AI-powered search and matching engine.

- **AI-Powered Search and Matching:** At the heart of EduVault is a powerful AI engine that uses vector embeddings to understand the semantic meaning of resumes and job descriptions.
  - **Resume Aggregation:** The platform aggregates a user's entire resume into a single text document.
  - **Vector Embeddings:** Using the `Xenova/all-MiniLM-L6-v2` model, the platform generates vector embeddings for each resume and job description.
  - **Vector Database:** These embeddings are stored in a [Pinecone](https://www.pinecone.io/) vector database, which allows for efficient similarity searches.
  - **Semantic Search:** When an administrator triggers a resume match, the system queries the Pinecone database to find the resumes that are most semantically similar to the job description.

## Project Structure

The project is organized into two main directories:

- **`client/`**: Contains the frontend React application, built with Vite.
  - **`src/`**: The main source code for the client application.
    - **`components/`**: Reusable React components, including the resume builder and portfolio layouts.
    - **`pages/`**: Top-level page components, such as the admin dashboard and login page.
    - **`services/`**: API service modules for communicating with the backend.
- **`server/`**: Contains the backend Express.js application.
  - **`config/`**: Configuration files for the application, including database and logging settings.
  - **`features/`**: The core application logic, organized by feature (auth, resume, job-description, ml, etc.).
  - **`migrations/`**: Database migration files.
  - **`models/`**: Sequelize models for the database tables.
  - **`routes/`**: API route definitions.

## API Documentation

For more information about the available API endpoints, please refer to the [API Documentation](server/API_DOCUMENTATION.md).


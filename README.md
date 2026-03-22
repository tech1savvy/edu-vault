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
  - **Vector Embeddings:** Using the `all-MiniLM-L6-v2` model, the Python semantic-ranking service generates vector embeddings for each resume and job description.
  - **Vector Database:** These embeddings are stored in a [Qdrant](https://qdrant.tech/) vector database for efficient similarity searches.
  - **Semantic Search:** When an administrator triggers a resume match, the system queries Qdrant to find the resumes that are most semantically similar to the job description.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Compose                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐      RabbitMQ       ┌─────────────────────┐   │
│  │  Node.js    │  ──────────────────▶ │  Python Service     │   │
│  │  Server     │  ◀────────────────── │  (semantic-ranking)  │   │
│  │  (Express)  │    (match results)   │                     │   │
│  └─────────────┘                      │  - pika (consumer)  │   │
│        │                              │  - sentence-transformers│
│        │                              │  - qdrant-client    │   │
│        ▼                              └──────────┬──────────┘   │
│  ┌─────────────┐                                 │              │
│  │  PostgreSQL │                                 │              │
│  └─────────────┘                                 ▼              │
│                                        ┌─────────────────────┐  │
│                                        │      Qdrant         │  │
│                                        │   (Vector DB)       │  │
│                                        └─────────────────────┘  │
│                                                                 │
│  ┌─────────────┐                                                │
│  │   Client    │  React + Vite                                  │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Resume/Job Sync:** When a resume or job description is created/updated, the Node.js server publishes a message to RabbitMQ. The Python service consumes this message, generates embeddings, and stores them in Qdrant.

2. **Match Request:** When an administrator requests resume matching, the Node.js server publishes a match request to RabbitMQ. The Python service:
   - Generates embedding for the job description
   - Queries Qdrant for similar resumes
   - Publishes results back to RabbitMQ
   - Node.js enriches results with user details from PostgreSQL

## Project Structure

```
edu-vault/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── components/        # Reusable components
│       ├── pages/             # Page components
│       └── services/          # API service modules
│
├── server/                    # Express.js backend
│   ├── config/                # Configuration (DB, logging)
│   ├── features/
│   │   ├── auth/              # Authentication
│   │   ├── resume/            # Resume sections
│   │   ├── job-description/   # Job descriptions & matching
│   │   ├── ml/                # RabbitMQ publisher
│   │   └── user/              # User management
│   ├── migrations/            # Database migrations
│   └── models/                # Sequelize models
│
├── semantic-ranking/          # Python microservice
│   ├── main.py                # Entry point
│   ├── config.py              # Environment configuration
│   ├── logger.py              # Winston-style logging
│   ├── embedding_service.py   # sentence-transformers wrapper
│   ├── qdrant_service.py      # Qdrant client
│   └── mq_consumer.py         # Pika consumer
│
└── docker-compose.yml         # Infrastructure orchestration
```

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS

### Backend (Node.js)
- Express.js
- Sequelize (PostgreSQL)
- Winston (logging)
- amqplib (RabbitMQ client)

### Semantic Ranking Service (Python)
- FastAPI (optional health endpoints)
- sentence-transformers (all-MiniLM-L6-v2)
- Qdrant client
- Pika (RabbitMQ client)

### Infrastructure
- PostgreSQL (primary database)
- Qdrant (vector database)
- RabbitMQ (message broker)
- Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.10+

### Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| RabbitMQ Management | http://localhost:15672 |
| Qdrant Dashboard | http://localhost:6333/dashboard |

### Environment Variables

**Server (`.env`)**
```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=edu_vault
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your_jwt_secret
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

**Semantic Ranking (`.env`)**
```
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
QDRANT_URL=http://qdrant:6333
QDRANT_COLLECTION=eduvault
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

## API Documentation

For more information about the available API endpoints, please refer to the [Server README](server/README.md#api-documentation).

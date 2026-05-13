# 6.2 API DESIGN

## Overview

The EduVault backend exposes a REST API on port 8000 with all endpoints prefixed by /api. Most endpoints require JWT authentication via the Authorization header. Role-based access control restricts certain endpoints to administrator or mentor roles.

## Authentication Endpoints

These endpoints are public and do not require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/signup | Register a new user account |
| POST | /auth/login | Authenticate and receive JWT token |

## Resume Endpoints

All resume endpoints require authentication. Students manage their own resume data while mentors and administrators can view all resumes. Each resume section (heading, skills, experience, education, projects, certifications, achievements) exposes standard CRUD operations under /resume/{section}.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /resume/{section} | List user's resume section items |
| POST | /resume/{section} | Add new item to section |
| PUT | /resume/{section}/:id | Update section item |
| DELETE | /resume/{section}/:id | Delete section item |

## Business Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /job-descriptions | List job postings |
| POST | /job-descriptions | Create job posting (admin) |
| POST | /job-descriptions/:id/match | Find matching resumes (admin) |
| POST | /applications/job/:jobId/apply | Submit job application |
| POST | /sync/all | Sync all data to ML service (admin) |

## Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List all users |
| PUT | /users/:id/role | Update user role |
| GET | /analytics/dashboard | Dashboard statistics |
| GET | /applications/job/:jobId | List applications for job |

## Error Handling

All errors return a standard response with success: false and an error message. HTTP status codes indicate error types: 400 for validation errors, 401 for authentication failures, 403 for authorization failures, 404 for not found, and 500 for server errors.
# EduVault API Documentation

This documentation provides details about the API endpoints for the EduVault application.

## Base URL

`{{baseURL}}` (e.g., `http://localhost:8000`)

---

## Authentication

Most endpoints require a Bearer Token for authentication. The token should be included in the `Authorization` header.

-   **Student User Token:** Obtainable via the "Login Student User" endpoint.
-   **Admin User Token:** Obtainable via the "Login Admin User" endpoint.

---

## User

### Auth

#### Signup Student User

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/signup`
-   **Description:** Registers a new student user.
-   **Request Body:**
    ```json
    {
        "name": "Test User",
        "email": "student@example.com",
        "password": "password123"
    }
    ```

#### Login Student User

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/login`
-   **Description:** Logs in a student user and returns a JWT token.
-   **Request Body:**
    ```json
    {
        "email": "{{testUserEmail}}",
        "password": "{{testUserPassword}}"
    }
    ```

#### Login Admin User

-   **Method:** `POST`
-   **Endpoint:** `/api/auth/login`
-   **Description:** Logs in an admin user and returns a JWT token.
-   **Request Body:**
    ```json
    {
        "email": "{{testAdminUserEmail}}",
        "password": "{{testAdminUserPassword}}"
    }
    ```

---

## Resume

### Heading

#### Get Heading

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/heading`
-   **Auth:** Bearer Token (Student)

#### Create/Update Heading

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/heading`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "name": "John Doe",
        "role": "Software Engineer",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "location": "New York, USA",
        "link": "linkedin.com/in/johndoe"
    }
    ```

### Skills

#### Get Skills

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/skills`
-   **Auth:** Bearer Token (Student)

#### Add Skill

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/skills`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "name": "TypeScript",
        "level": "Intermediate"
    }
    ```

#### Update Skill

-   **Method:** `PUT`
-   **Endpoint:** `/api/resume/skills/{skillId}`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "name": "TypeScript",
        "level": "Expert"
    }
    ```

#### Delete Skill

-   **Method:** `DELETE`
-   **Endpoint:** `/api/resume/skills/{skillId}`
-   **Auth:** Bearer Token (Student)

### Projects

#### Get Projects

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/projects`
-   **Auth:** Bearer Token (Student)

#### Add Project

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/projects`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "title": "Project Title",
        "description": "Project Description",
        "techstack": "React, Node.js",
        "timeline": "2 months",
        "type": "Personal",
        "collaborators": "None"
    }
    ```

#### Update Project

-   **Method:** `PUT`
-   **Endpoint:** `/api/resume/projects/{projectId}`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "title": "Updated Project Title"
    }
    ```

#### Delete Project

-   **Method:** `DELETE`
-   **Endpoint:** `/api/resume/projects/{projectId}`
-   **Auth:** Bearer Token (Student)

### Achievements

#### Get Achievements

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/achievements`
-   **Auth:** Bearer Token (Student)

#### Add Achievement

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/achievements`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "title": "Award for Creativity",
        "description": "Received an award for innovative project design.",
        "date": "2022"
    }
    ```

#### Update Achievement

-   **Method:** `PUT`
-   **Endpoint:** `/api/resume/achievements/{achievementId}`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "description": "Received an award for creative project design."
    }
    ```

#### Delete Achievement

-   **Method:** `DELETE`
-   **Endpoint:** `/api/resume/achievements/{achievementId}`
-   **Auth:** Bearer Token (Student)

### Certifications

#### Get Certifications

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/certifications`
-   **Auth:** Bearer Token (Student)

#### Add Certification

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/certifications`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "name": "GCP Certified Developer",
        "issuer": "Google Cloud",
        "date": "2021",
        "credentialid": "ABC123XYZ"
    }
    ```

#### Update Certification

-   **Method:** `PUT`
-   **Endpoint:** `/api/resume/certifications/{certificationId}`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "issuer": "Google"
    }
    ```

#### Delete Certification

-   **Method:** `DELETE`
-   **Endpoint:** `/api/resume/certifications/{certificationId}`
-   **Auth:** Bearer Token (Student)

### Education

#### Get Educations

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/education`
-   **Auth:** Bearer Token (Student)

#### Add Education

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/education`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "institution": "University of ABC",
        "degree": "Master of Science",
        "fieldofstudy": "Computer Science",
        "duration": "2018-2020",
        "details": "Specialized in AI and Machine Learning."
    }
    ```

#### Update Education

-   **Method:** `PUT`
-   **Endpoint:** `/api/resume/education/{educationId}`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "degree": "Expert of Science"
    }
    ```

#### Delete Education

-   **Method:** `DELETE`
-   **Endpoint:** `/api/resume/education/{educationId}`
-   **Auth:** Bearer Token (Student)

### Experiences

#### Get Experiences

-   **Method:** `GET`
-   **Endpoint:** `/api/resume/experiences`
-   **Auth:** Bearer Token (Student)

#### Add Experience

-   **Method:** `POST`
-   **Endpoint:** `/api/resume/experiences`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "type": "Part-time",
        "company": "Google",
        "role": "Software Engineer",
        "duration": "2020-Present",
        "details": "Developed and maintained various software."
    }
    ```

#### Update Experience

-   **Method:** `PUT`
-   **Endpoint:** `/api/resume/experiences/{experienceId}`
-   **Auth:** Bearer Token (Student)
-   **Request Body:**
    ```json
    {
        "company": "Microsoft"
    }
    ```

#### Delete Experience

-   **Method:** `DELETE`
-   **Endpoint:** `/api/resume/experiences/{experienceId}`
-   **Auth:** Bearer Token (Student)

---

## Job Descriptions

### Get All Job Descriptions

-   **Method:** `GET`
-   **Endpoint:** `/api/job-descriptions`
-   **Auth:** Bearer Token (Admin)

### Get Job Description by ID

-   **Method:** `GET`
-   **Endpoint:** `/api/job-descriptions/{jobDescriptionId}`
-   **Auth:** Bearer Token (Admin)

### Create Job Description

-   **Method:** `POST`
-   **Endpoint:** `/api/job-descriptions`
-   **Auth:** Bearer Token (Admin)
-   **Request Body:**
    ```json
    {
        "title": "Software Engineer",
        "description": "We are looking for a talented Software Engineer to join our team",
        "requirements": "B.S. in Computer Science or a related field, 3+ years of experience in software development."
    }
    ```

### Update Job Description

-   **Method:** `PUT`
-   **Endpoint:** `/api/job-descriptions/{jobDescriptionId}`
-   **Auth:** Bearer Token (Admin)
-   **Request Body:**
    ```json
    {
        "title": "DevOps Engineer"
    }
    ```

### Delete Job Description

-   **Method:** `DELETE`
-   **Endpoint:** `/api/job-descriptions/{jobDescriptionId}`
-   **Auth:** Bearer Token (Admin)

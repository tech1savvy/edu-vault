# EduVault Client

React frontend for EduVault student profiling platform.

## Overview

A dynamic resume builder that allows students to create and manage professional portfolios. Administrators can post job descriptions and use AI-powered matching to find suitable candidates.

## Features

### Student Features
- **Resume Builder** - Section-by-section resume construction
  - Personal heading (name, contact, links)
  - Professional experience
  - Education history
  - Projects with tech stack
  - Skills with proficiency levels
  - Achievements and awards
  - Certifications

### Admin Features
- **Job Description Management** - CRUD operations for positions
- **AI Resume Matching** - Find best candidates using vector similarity
- **Dashboard Overview** - Platform-wide statistics

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service modules
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── resume.js       # Resume section endpoints
│   │   └── jobDescription.js
│   ├── components/         # Reusable UI components
│   │   ├── Layout/         # App shell (Navbar, Sidebar)
│   │   ├── Resume/         # Resume section components
│   │   │   ├── Forms/      # Edit forms for each section
│   │   │   ├── Achievements.jsx
│   │   │   ├── Certifications.jsx
│   │   │   └── ...
│   │   └── common/         # Shared components
│   ├── context/            # React Context providers
│   │   └── ResumeProvider.jsx  # Resume state management
│   ├── pages/             # Route-level components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ResumeBuilder.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx            # Root component with routing
│   └── main.jsx           # Entry point
├── Dockerfile
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Context Architecture

### ResumeProvider

Global state for resume data. Provides sections via React Context:

```jsx
const { heading, skills, projects, experiences, education, achievements, certifications } = useContext(ResumeContext);
```

All sections auto-sync to backend on changes.

## Components

### Layout Components
- **Navbar** - Top navigation with user info
- **ProtectedRoute** - Role-based route guards

### Resume Components
- **Achievements** / **Certifications** - Display lists
- **AchievementsForm** / **CertificationsForm** - Add/edit forms

Each resume section follows this pattern:
- `Section.jsx` - View mode (read data)
- `Forms/SectionForm.jsx` - Edit mode (add/update)

## API Integration

API calls go to backend at `http://localhost:8000`:

```javascript
// Example: Fetch skills
const response = await axios.get('/api/resume/skills', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Development

Runs in Docker only - see [root README](../README.md).

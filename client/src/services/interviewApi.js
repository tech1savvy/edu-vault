import axios from "axios";

// Match axiosInstance.js / api.js: VITE_API_BASE_URL is host only; /api is appended when missing.
const rawBase =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")) ||
  "http://localhost:8000";
const normalizedBase = String(rawBase).replace(/\/$/, "");
const API_URL = normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`;

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Domains supported by the written AI interview (must match server list). */
export const WRITTEN_INTERVIEW_DOMAINS = [
  "React",
  "Node.js",
  "Java",
  "Python",
  "DevOps",
  "SQL",
  "System Design",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Data Science & Analytics",
  "Cloud (AWS/Azure/GCP)",
  "Security",
  "Mobile (iOS/Android)",
];

export const INTERVIEW_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
export const INTERVIEW_QUESTION_COUNTS = [5, 10, 15];

/** Legacy slug map (used by DomainCard if shown elsewhere). */
export const LABEL_TO_SLUG = {
  "Full Stack Development": "full-stack-development",
  "Frontend Development": "frontend-development",
  "Backend Development": "backend-development",
  "Data Science & Analytics": "data-science-analytics",
  "DevOps Engineering": "devops-engineering",
};

export const SLUG_TO_LABEL = Object.fromEntries(
  Object.entries(LABEL_TO_SLUG).map(([label, slug]) => [slug, label])
);

export function slugForDomainLabel(label) {
  return LABEL_TO_SLUG[label] ?? null;
}

export async function fetchDomainDetection() {
  const { data } = await client.get("/interview/domain-detection");
  return data;
}

export async function startWrittenInterview(payload) {
  const { data } = await client.post("/interview/start", payload);
  return data;
}

export async function fetchNextInterviewQuestion(sessionId) {
  const { data } = await client.post("/interview/question", { sessionId });
  return data;
}

export async function evaluateInterviewAnswer(sessionId, answerText, skipped = false) {
  const { data } = await client.post("/interview/evaluate", {
    sessionId,
    answerText,
    skipped,
  });
  return data;
}

export async function endWrittenInterview(sessionId, durationSeconds, abandoned = false) {
  const { data } = await client.post("/interview/end", {
    sessionId,
    durationSeconds,
    abandoned,
  });
  return data;
}

export async function fetchInterviewReport(id) {
  const { data } = await client.get(`/interview/${encodeURIComponent(id)}/report`);
  return data;
}

export default client;

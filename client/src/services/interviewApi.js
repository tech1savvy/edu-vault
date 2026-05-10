import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

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

/** Canonical domain label → URL slug (must match server DOMAIN_SLUG_MAP keys) */
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

export async function fetchQuestions(domainSlug) {
  const { data } = await client.get(`/interview/questions/${encodeURIComponent(domainSlug)}`);
  return data;
}

export async function submitInterview(payload) {
  const { data } = await client.post("/interview/submit", payload);
  return data;
}

export async function fetchInterviewResult(id) {
  const { data } = await client.get(`/interview/result/${id}`);
  return data;
}

export default client;

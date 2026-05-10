"use strict";

/**
 * Heuristic domain detection from student profile signals (skills, projects,
 * certifications, experience, profile heading). Returns ranked domains with
 * confidence, matched skill tokens, and human-readable descriptions.
 */

const CANONICAL_DOMAINS = [
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Data Science & Analytics",
  "DevOps Engineering",
];

const DOMAIN_DESCRIPTIONS = {
  "Full Stack Development":
    "End-to-end web application design covering client UI, APIs, persistence, authentication, and deployment patterns.",
  "Frontend Development":
    "User interfaces with modern frameworks, accessibility, styling systems, networking from the browser, and client performance.",
  "Backend Development":
    "Server APIs, databases, scalability, integrations, caching, queues, authentication, and service architecture.",
  "Data Science & Analytics":
    "Data wrangling, statistics, exploratory analysis, experimentation, modelling, visualization, and toolchains like Python notebooks.",
  "DevOps Engineering":
    "CI/CD pipelines, containers, orchestration, cloud infrastructure, observability, and automation for reliable delivery.",
};

/** URL slug → canonical domain label used in questionBank.json keys */
const DOMAIN_SLUG_MAP = Object.freeze({
  "full-stack-development": "Full Stack Development",
  "frontend-development": "Frontend Development",
  "backend-development": "Backend Development",
  "data-science-analytics": "Data Science & Analytics",
  "devops-engineering": "DevOps Engineering",
});

const DOMAIN_PATTERN_WEIGHTS = {
  "Full Stack Development": [
    { re: /\b(full[-\s]?stack|mern|mean|jamstack)\b/i, w: 4 },
    { re: /\b(react|vue|angular|next\.?js|svelte)\b/i, w: 2 },
    { re: /\b(node\.?js|express|nestjs|nestjs)\b/i, w: 2 },
    { re: /\b(rest|graphql|api)\b/i, w: 1 },
    { re: /\b(postgres|postgresql|mongodb|mongoose|sequelize|prisma)\b/i, w: 2 },
    { re: /\b(jwt|oauth|authentication)\b/i, w: 1 },
  ],
  "Frontend Development": [
    { re: /\b(react|vue|angular|next\.?js|vite|webpack|tailwind|sass|scss)\b/i, w: 3 },
    { re: /\b(css|styled[-\s]?components|responsive|accessibility|a11y|aria)\b/i, w: 2 },
    { re: /\b(dom|csr|spa|jsx|tsx|hooks)\b/i, w: 2 },
    { re: /\b(browser|devtools|lazy[-\s]?load|memoization)\b/i, w: 1 },
  ],
  "Backend Development": [
    { re: /\b(express|nestjs|django|flask|fastapi|spring|laravel|rails)\b/i, w: 3 },
    { re: /\b(rest|graphql|grpc|microservice|message[-\s]?queue|kafka|rabbitmq)\b/i, w: 2 },
    { re: /\b(postgres|mysql|redis|elastic|sql|orm|transaction)\b/i, w: 2 },
    { re: /\b(cache|rate[-\s]?limit|middleware|authorization)\b/i, w: 1 },
  ],
  "Data Science & Analytics": [
    { re: /\b(python|pandas|numpy|polars|jupyter|notebook)\b/i, w: 3 },
    { re: /\b(statistics|hypothesis|regression|classification|clustering)\b/i, w: 2 },
    { re: /\b(tensorflow|pytorch|keras|scikit|sklearn|ml|machine[-\s]?learning)\b/i, w: 3 },
    { re: /\b(visualization|matplotlib|seaborn|tableau|power[-\s]?bi)\b/i, w: 2 },
    { re: /\b(etl|feature[-\s]?engineering|eda)\b/i, w: 1 },
  ],
  "DevOps Engineering": [
    { re: /\b(docker|kubernetes|k8s|helm|container)\b/i, w: 3 },
    { re: /\b(ci\/cd|github[-\s]?actions|gitlab|jenkins|terraform|ansible)\b/i, w: 3 },
    { re: /\b(aws|gcp|azure|linux|nginx|prometheus|grafana|observability)\b/i, w: 2 },
    { re: /\b(iac|infrastructure|deployment|rollback|blue[-\s]?green)\b/i, w: 1 },
  ],
};

function normalizeToken(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+\s.#/]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectProfileText({ heading, skills, projects, certifications, experiences }) {
  const parts = [];
  if (heading) {
    parts.push(heading.name, heading.role, heading.link);
  }
  (skills || []).forEach((s) => parts.push(s.name, s.level));
  (projects || []).forEach((p) =>
    parts.push(p.title, p.description, p.techStack, p.type)
  );
  (certifications || []).forEach((c) => parts.push(c.name, c.issuer));
  (experiences || []).forEach((e) =>
    parts.push(e.role, e.company, e.details, e.type)
  );
  return normalizeToken(parts.filter(Boolean).join(" "));
}

function scoreDomainFromText(domain, corpora) {
  let raw = 0;
  const patterns = DOMAIN_PATTERN_WEIGHTS[domain] || [];
  for (const { re, w } of patterns) {
    if (re.test(corpora)) raw += w;
  }
  return raw;
}

function extractMatchedSkills(domain, skillNames, corpora) {
  const skillSet = new Set();
  const combined = `${corpora} ${normalizeToken(skillNames.join(" "))}`;
  for (const { re } of DOMAIN_PATTERN_WEIGHTS[domain] || []) {
    const m = combined.match(re);
    if (m && m[0]) skillSet.add(m[0].replace(/\s+/g, " ").trim());
  }
  (skillNames || []).forEach((name) => {
    const n = normalizeToken(name);
    if (!n) return;
    for (const { re } of DOMAIN_PATTERN_WEIGHTS[domain] || []) {
      if (re.test(n)) skillSet.add(name.trim());
    }
  });
  return [...skillSet].slice(0, 12);
}

function normalizeScoresToPercentages(scores) {
  const entries = CANONICAL_DOMAINS.map((d) => [d, scores[d] || 0]);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  return entries.map(([domain, raw]) => {
    const byMax = (raw / max) * 100;
    const byShare = (raw / total) * 100;
    const blended = Math.round(byMax * 0.55 + byShare * 0.45);
    const confidence = Math.min(98, Math.max(8, blended));
    return { domain, raw, confidence };
  });
}

/**
 * Map route param to canonical domain key present in questionBank.json
 * @param {string} param - slug or URL-encoded full name
 */
function resolveDomainFromParam(param) {
  if (!param || typeof param !== "string") return null;
  const trimmed = param.trim();
  const slug = trimmed.toLowerCase();
  if (DOMAIN_SLUG_MAP[slug]) return DOMAIN_SLUG_MAP[slug];
  const decoded = decodeURIComponent(trimmed);
  if (CANONICAL_DOMAINS.includes(decoded)) return decoded;
  const alt = decoded.replace(/\+/g, " ");
  if (CANONICAL_DOMAINS.includes(alt)) return alt;
  return null;
}

/**
 * @param {object} profile - { heading, skills[], projects[], certifications[], experiences[] }
 */
function analyzeStudentProfile(profile) {
  const skillNames = (profile.skills || []).map((s) => s.name).filter(Boolean);
  const corpora = collectProfileText(profile);

  const rawScores = {};
  for (const domain of CANONICAL_DOMAINS) {
    rawScores[domain] = scoreDomainFromText(domain, corpora);
  }

  const normalized = normalizeScoresToPercentages(rawScores);
  normalized.sort((a, b) => b.confidence - a.confidence);

  const suggestedDomains = normalized.map(({ domain, confidence }) => ({
    domain,
    confidence,
    matchedSkills: extractMatchedSkills(domain, skillNames, corpora),
    description: DOMAIN_DESCRIPTIONS[domain],
  }));

  const primary = suggestedDomains[0];
  const keySkillsAnalyzed = [...new Set(skillNames.map((s) => s.trim()).filter(Boolean))].slice(
    0,
    20
  );

  return {
    matchConfidence: primary?.confidence ?? 0,
    primaryDomain: primary?.domain ?? CANONICAL_DOMAINS[0],
    keySkillsAnalyzed,
    suggestedDomains,
    howItWorks: [
      "We scan your profile heading, experience, projects, certifications, and skills for domain-specific signals.",
      "Scores blend keyword strength and how your signals distribute across domains to avoid a single-label bias.",
      "Pick the domain that best matches your interview goal; you can retake with another domain anytime.",
    ],
  };
}

module.exports = {
  CANONICAL_DOMAINS,
  DOMAIN_SLUG_MAP,
  DOMAIN_DESCRIPTIONS,
  resolveDomainFromParam,
  analyzeStudentProfile,
};

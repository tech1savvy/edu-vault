"use strict";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../config/logger");

const MODEL_ID = "gemini-2.5-flash";

function getModel(jsonMode = true) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || typeof key !== "string" || !key.trim()) {
    const err = new Error("GEMINI_API_KEY is not configured on the server");
    err.code = "GEMINI_CONFIG";
    throw err;
  }
  const genAI = new GoogleGenerativeAI(key.trim());
  return genAI.getGenerativeModel({
    model: MODEL_ID,
    generationConfig: jsonMode
      ? {
          responseMimeType: "application/json",
          temperature: 0.55,
        }
      : { temperature: 0.55 },
  });
}

function extractText(response) {
  try {
    return response?.response?.text?.() ?? "";
  } catch (e) {
    logger.warn("Gemini response text extraction failed", e);
    return "";
  }
}

function parseJsonLoose(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const body = fence ? fence[1].trim() : trimmed;
  try {
    return JSON.parse(body);
  } catch {
    const start = body.indexOf("{");
    const end = body.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(body.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * @param {object} params
 * @returns {Promise<{ question: string }>}
 */
async function generateInterviewQuestion(params) {
  const { domain, difficulty, previousQuestions } = params;
  const prev = Array.isArray(previousQuestions) ? previousQuestions : [];
  const model = getModel(true);
  const prompt = `You are a technical hiring interviewer.

Generate ONE concise written interview question (2–4 sentences max) for a mock interview.

Context:
- Technical domain / track: ${domain}
- Difficulty: ${difficulty}
- Questions already asked in this session (do NOT repeat or trivially rephrase these):
${prev.length ? prev.map((q, i) => `${i + 1}. ${q}`).join("\n") : "(none yet)"}

Rules:
- Ask for a written answer (concept explanation, tradeoffs, design, or problem-solving — appropriate to difficulty).
- Must be unique vs the list above.
- Return ONLY valid JSON with shape: {"question":"..."}`;

  const result = await model.generateContent(prompt);
  const text = extractText(result);
  const parsed = parseJsonLoose(text);
  if (!parsed || typeof parsed.question !== "string" || !parsed.question.trim()) {
    throw new Error("Model did not return a valid question JSON");
  }
  return { question: parsed.question.trim() };
}

/**
 * @param {object} params
 * @returns {Promise<object>}
 */
async function evaluateInterviewAnswer(params) {
  const { domain, difficulty, question, answer } = params;
  const model = getModel(true);
  const prompt = `You are an expert interviewer and coach.

Evaluate this WRITTEN interview answer.

Context:
- Domain: ${domain}
- Difficulty level: ${difficulty}

Question:
${question}

Candidate answer:
${answer}

Return ONLY valid JSON with this exact shape:
{
  "score": <number 0-10 inclusive, integer>,
  "feedback": "<detailed paragraph>",
  "strengths": ["<string>", ...],
  "weaknesses": ["<string>", ...],
  "idealAnswer": "<best possible concise answer>",
  "followUpQuestion": "<one follow-up question string, or empty string>",
  "followUpRelevant": <true|false — true only if a follow-up would deepen assessment of THIS answer>
}

Rules:
- Be fair for the stated difficulty.
- Strengths and weaknesses: short phrases (arrays of strings).
- If the answer is very weak, followUpRelevant should usually be false unless a tiny follow-up clarifies a critical ambiguity.`;

  const result = await model.generateContent(prompt);
  const text = extractText(result);
  const parsed = parseJsonLoose(text);
  if (!parsed || typeof parsed.score !== "number") {
    throw new Error("Model did not return valid evaluation JSON");
  }
  const score = Math.max(0, Math.min(10, Math.round(parsed.score)));
  return {
    score,
    feedback: String(parsed.feedback ?? "").trim(),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.map(String) : [],
    idealAnswer: String(parsed.idealAnswer ?? "").trim(),
    followUpQuestion: String(parsed.followUpQuestion ?? "").trim(),
    followUpRelevant: Boolean(parsed.followUpRelevant),
  };
}

/**
 * @param {object} params
 * @returns {Promise<object>}
 */
async function generateFinalInterviewReport(params) {
  const { domain, difficulty, turns, averageScore, overallScore } = params;
  const model = getModel(true);
  const prompt = `You are a senior coach summarizing a completed written technical mock interview.

Domain: ${domain}
Difficulty: ${difficulty}
Computed average score (0–10): ${averageScore}
Computed overall score (0–10, same as average here): ${overallScore}

Per-question data (JSON):
${JSON.stringify(turns, null, 2)}

Return ONLY valid JSON:
{
  "overallSummary": "<2-4 sentences>",
  "finalStrengths": ["<string>", ...],
  "finalWeaknesses": ["<string>", ...],
  "improvementSuggestions": ["<actionable suggestion>", ... at least 4 items]
}`;

  const result = await model.generateContent(prompt);
  const text = extractText(result);
  const parsed = parseJsonLoose(text);
  if (!parsed) {
    throw new Error("Model did not return valid final report JSON");
  }
  return {
    overallSummary: String(parsed.overallSummary ?? "").trim(),
    finalStrengths: Array.isArray(parsed.finalStrengths) ? parsed.finalStrengths.map(String) : [],
    finalWeaknesses: Array.isArray(parsed.finalWeaknesses) ? parsed.finalWeaknesses.map(String) : [],
    improvementSuggestions: Array.isArray(parsed.improvementSuggestions)
      ? parsed.improvementSuggestions.map(String)
      : [],
  };
}

module.exports = {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
  generateFinalInterviewReport,
  MODEL_ID,
};

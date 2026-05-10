"use strict";

const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const db = require("../models");
const logger = require("../config/logger");
const {
  analyzeStudentProfile,
  resolveDomainFromParam,
} = require("../utils/domainDetector");
const { summarizeAttempt } = require("../utils/scoreCalculator");
const { generateFeedbackFromTopics } = require("../utils/feedbackGenerator");

const { Heading, Skill, Project, Certification, Experience, Interview } = db;

const QUESTION_COUNT = 17;
const BANK_PATH = path.join(__dirname, "..", "data", "questionBank.json");

let questionBankCache = null;

function loadQuestionBank() {
  if (!questionBankCache) {
    const raw = fs.readFileSync(BANK_PATH, "utf8");
    questionBankCache = JSON.parse(raw);
  }
  return questionBankCache;
}

function shuffleInPlace(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stripCorrectAnswer(question) {
  const { correctAnswer: _omit, ...rest } = question;
  return rest;
}

function resolveDomain(raw) {
  if (!raw || typeof raw !== "string") return null;
  const fromSlug = resolveDomainFromParam(raw.trim());
  if (fromSlug) return fromSlug;
  const trimmed = raw.trim();
  const bank = loadQuestionBank();
  if (bank[trimmed]) return trimmed;
  return null;
}

function computeApproxPercentileFromScore(scoreOutOf100) {
  const s = Number(scoreOutOf100);
  if (Number.isNaN(s)) return 50;
  return Math.min(98, Math.max(12, Math.round(55 + (s - 72) * 1.05)));
}

async function percentileFromStoredCohort(domain, score) {
  const total = await Interview.count({
    where: { selectedDomain: domain },
  });
  if (total <= 1) {
    return computeApproxPercentileFromScore(score);
  }
  const strictlyLess = await Interview.count({
    where: {
      selectedDomain: domain,
      score: { [Op.lt]: score },
    },
  });
  const equal = await Interview.count({
    where: {
      selectedDomain: domain,
      score,
    },
  });

  const midRank = strictlyLess + 0.5 * equal;
  return Math.round((midRank / total) * 100);
}

/**
 * GET /api/interview/domain-detection
 */
async function detectDomains(req, res) {
  try {
    const userId = req.user.userId;
    const [heading, skills, projects, certifications, experiences] = await Promise.all([
      Heading.findOne({ where: { userId } }),
      Skill.findAll({ where: { userId } }),
      Project.findAll({ where: { userId } }),
      Certification.findAll({ where: { userId } }),
      Experience.findAll({ where: { userId } }),
    ]);

    const analysis = analyzeStudentProfile({
      heading: heading ? heading.toJSON() : null,
      skills,
      projects,
      certifications,
      experiences,
    });

    res.json(analysis);
  } catch (err) {
    logger.error("Interview domain-detection failed", err);
    res.status(500).json({ error: "Unable to analyze profile domains" });
  }
}

/**
 * GET /api/interview/questions/:domain
 */
async function getQuestions(req, res) {
  try {
    const domain = resolveDomain(req.params.domain);
    if (!domain) {
      return res.status(400).json({
        error: "Unknown interview domain",
        hint: "Use a slug such as full-stack-development or the exact canonical domain label.",
      });
    }

    const bank = loadQuestionBank();
    const pool = bank[domain];
    if (!Array.isArray(pool) || pool.length === 0) {
      return res.status(500).json({ error: "Question bank unavailable for domain" });
    }

    const count = Math.min(QUESTION_COUNT, pool.length);
    const picks = shuffleInPlace(pool).slice(0, count);
    const questions = picks.map(stripCorrectAnswer);

    res.json({
      domain,
      count: questions.length,
      questions,
    });
  } catch (err) {
    logger.error("Interview questions GET failed", err);
    res.status(500).json({ error: "Unable to load interview questions" });
  }
}

/**
 * POST /api/interview/submit
 * Body: { selectedDomain:string, answers: { questionId, selectedOption:null|0-3 }[], durationSeconds:number }
 */
async function submitInterview(req, res) {
  try {
    const userId = req.user.userId;
    const { selectedDomain: rawDomain, answers, durationSeconds } = req.body || {};

    const domain = resolveDomain(rawDomain);
    if (!domain) {
      return res
        .status(400)
        .json({ error: "selectedDomain is required and must resolve to a configured domain." });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "answers must be a non-empty array." });
    }

    const duration = Number(durationSeconds);
    const timeTaken = Number.isFinite(duration) && duration >= 0 ? Math.floor(duration) : 0;

    const bank = loadQuestionBank();
    const pool = bank[domain];

    const answerMap = new Map();
    for (const row of answers) {
      const qId = row?.questionId;
      if (!qId) {
        return res.status(400).json({ error: "Each answer must include questionId." });
      }
      if (answerMap.has(qId)) {
        return res.status(400).json({ error: `Duplicate answer for questionId ${qId}.` });
      }
      let opt =
        row.selectedOption === undefined || row.selectedOption === ""
          ? null
          : row.selectedOption;
      if (opt !== null && opt !== undefined && typeof opt !== "number") {
        const parsed = Number(opt);
        opt = Number.isInteger(parsed) ? parsed : NaN;
      }
      if (opt !== null && (typeof opt !== "number" || opt < 0 || opt > 3 || !Number.isInteger(opt))) {
        return res.status(400).json({ error: `Invalid selectedOption for ${qId}; use integer 0–3 or null to skip.` });
      }
      answerMap.set(qId, opt);
    }

    const summary = summarizeAttempt(pool, answerMap);
    if (summary.error) {
      return res.status(400).json({ error: summary.error });
    }

    const { strengths, weaknesses, recommendations } = generateFeedbackFromTopics(
      summary.byTopicPayload
    );

    const analytics = {
      correct: summary.correct,
      incorrect: summary.incorrect,
      skipped: summary.skipped,
      attemptedTotal: summary.attemptedTotal,
      totalSeen: summary.totalSeen,
      topicBreakdown: summary.byTopicPayload,
    };

    const interview = await Interview.create({
      userId,
      selectedDomain: domain,
      questions: summary.sanitizedQuestionsPayload,
      answers: [...answerMap.entries()].map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
      score: summary.scoreRounded,
      percentile: 0,
      strengths,
      weaknesses,
      recommendations,
      analytics,
      timeTaken,
    });

    const percentileRounded = await percentileFromStoredCohort(domain, summary.scoreRounded);

    await interview.update({ percentile: percentileRounded });

    res.status(201).json({
      interviewId: interview.id,
      selectedDomain: domain,
      score: summary.scoreRounded,
      percentile: percentileRounded,
      timeTaken,
      analytics,
      strengths,
      weaknesses,
      recommendations,
    });
  } catch (err) {
    logger.error("Interview submit failed", err);
    res.status(500).json({ error: "Unable to submit interview attempt" });
  }
}

/**
 * GET /api/interview/result/:id
 */
async function getResult(req, res) {
  try {
    const userId = req.user.userId;
    const idNum = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(idNum)) {
      return res.status(400).json({ error: "Invalid interview id" });
    }

    const row = await Interview.findOne({
      where: { id: idNum, userId },
    });
    if (!row) {
      return res.status(404).json({ error: "Interview result not found" });
    }

    const payload = row.toJSON();
    res.json({
      id: payload.id,
      selectedDomain: payload.selectedDomain,
      score: payload.score,
      percentile: Number(payload.percentile),
      strengths: payload.strengths,
      weaknesses: payload.weaknesses,
      recommendations: payload.recommendations,
      analytics: payload.analytics || null,
      timeTaken: payload.timeTaken,
      questions: payload.questions,
      answers: payload.answers,
      createdAt: payload.createdAt,
    });
  } catch (err) {
    logger.error("Interview result GET failed", err);
    res.status(500).json({ error: "Unable to retrieve interview result" });
  }
}

module.exports = {
  detectDomains,
  getQuestions,
  submitInterview,
  getResult,
};

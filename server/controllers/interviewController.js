"use strict";

const db = require("../models");
const logger = require("../config/logger");
const { analyzeStudentProfile } = require("../utils/domainDetector");
const {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
  generateFinalInterviewReport,
} = require("../services/geminiInterview.service");

const { Heading, Skill, Project, Certification, Experience, WrittenInterviewSession } = db;

const ALLOWED_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const ALLOWED_COUNTS = [5, 10, 15];

const WRITTEN_INTERVIEW_DOMAINS = [
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

function normalizeQuestion(q) {
  return String(q || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isNearDuplicate(newQ, list) {
  const n = normalizeQuestion(newQ);
  if (!n) return true;
  for (const existing of list) {
    const e = normalizeQuestion(existing);
    if (!e) continue;
    if (n === e) return true;
    if (n.length >= 48 && (e.includes(n.slice(0, 48)) || n.includes(e.slice(0, 48)))) return true;
  }
  return false;
}

async function loadActiveSession(sessionId, userId) {
  const idNum = Number.parseInt(String(sessionId), 10);
  if (!Number.isInteger(idNum) || idNum < 1) return null;
  return WrittenInterviewSession.findOne({
    where: { id: idNum, userId },
  });
}

function pendingAnswerTurn(turns) {
  const t = turns?.length ? turns[turns.length - 1] : null;
  if (!t || !t.questionText) return null;
  const evaluated = t.skipped === true || (t.evaluation && t.evaluation.evaluated !== false);
  return evaluated ? null : t;
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
 * POST /api/interview/start
 * Body: { domain, difficulty, questionCount }
 */
async function startWrittenInterview(req, res) {
  try {
    const userId = req.user.userId;
    const { domain, difficulty, questionCount } = req.body || {};

    if (!domain || typeof domain !== "string" || !WRITTEN_INTERVIEW_DOMAINS.includes(domain.trim())) {
      return res.status(400).json({
        error: "Invalid domain",
        allowedDomains: WRITTEN_INTERVIEW_DOMAINS,
      });
    }
    if (!difficulty || typeof difficulty !== "string" || !ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        error: "Invalid difficulty",
        allowed: ALLOWED_DIFFICULTIES,
      });
    }
    const count = Number(questionCount);
    if (!ALLOWED_COUNTS.includes(count)) {
      return res.status(400).json({
        error: "Invalid questionCount",
        allowed: ALLOWED_COUNTS,
      });
    }

    const session = await WrittenInterviewSession.create({
      userId,
      domain: domain.trim(),
      difficulty,
      targetQuestionCount: count,
      status: "active",
      turns: [],
      previousQuestions: [],
      lastEvaluation: null,
      followUpConsumed: false,
    });

    res.status(201).json({
      sessionId: session.id,
      domain: session.domain,
      difficulty: session.difficulty,
      questionCount: session.targetQuestionCount,
    });
  } catch (err) {
    logger.error("Interview start failed", err);
    const sqlMsg = err?.parent?.message || err?.original?.message || err?.message;
    const details =
      process.env.NODE_ENV !== "production" && sqlMsg
        ? String(sqlMsg).slice(0, 500)
        : undefined;
    res.status(500).json({
      error: "Unable to start interview session",
      ...(details ? { details } : {}),
    });
  }
}

/**
 * POST /api/interview/question
 * Body: { sessionId }
 */
async function nextQuestion(req, res) {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.body || {};
    const session = await loadActiveSession(sessionId, userId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }
    if (session.status !== "active") {
      return res.status(400).json({ error: "Session is not active" });
    }

    const turns = Array.isArray(session.turns) ? [...session.turns] : [];
    const prevList = Array.isArray(session.previousQuestions) ? [...session.previousQuestions] : [];

    const pending = pendingAnswerTurn(turns);
    if (pending) {
      return res.json({
        question: pending.questionText,
        questionIndex: turns.length,
        totalPlanned: session.targetQuestionCount,
      });
    }

    if (turns.length >= session.targetQuestionCount) {
      return res.status(400).json({
        error: "All planned questions have been presented. Use POST /api/interview/end to finish.",
      });
    }

    let questionText = null;
    const lastEval = session.lastEvaluation;

    const canUseFollowUp =
      lastEval &&
      lastEval.followUpRelevant === true &&
      typeof lastEval.followUpQuestion === "string" &&
      lastEval.followUpQuestion.trim() &&
      !session.followUpConsumed;

    let followUpConsumed = session.followUpConsumed;

    if (canUseFollowUp) {
      const fq = lastEval.followUpQuestion.trim();
      if (!isNearDuplicate(fq, prevList)) {
        questionText = fq;
        followUpConsumed = true;
      }
    }

    if (!questionText) {
      let attempts = 0;
      while (attempts < 4 && !questionText) {
        attempts += 1;
        const gen = await generateInterviewQuestion({
          domain: session.domain,
          difficulty: session.difficulty,
          previousQuestions: prevList,
        });
        if (!isNearDuplicate(gen.question, prevList)) {
          questionText = gen.question;
          break;
        }
      }
      if (!questionText) {
        return res.status(502).json({ error: "Could not generate a unique question. Try again." });
      }
      followUpConsumed = false;
    }

    turns.push({
      questionText,
      answerText: null,
      skipped: false,
      evaluation: null,
    });
    prevList.push(questionText);

    await session.update({
      turns,
      previousQuestions: prevList,
      followUpConsumed,
    });

    res.json({
      question: questionText,
      questionIndex: turns.length,
      totalPlanned: session.targetQuestionCount,
    });
  } catch (err) {
    if (err.code === "GEMINI_CONFIG") {
      return res.status(503).json({ error: "Interview AI is not configured (missing GEMINI_API_KEY)." });
    }
    logger.error("Interview question generation failed", err);
    res.status(500).json({ error: err.message || "Unable to generate question" });
  }
}

/**
 * POST /api/interview/evaluate
 * Body: { sessionId, answerText?, skipped?: boolean }
 */
async function evaluateAnswer(req, res) {
  try {
    const userId = req.user.userId;
    const { sessionId, answerText, skipped } = req.body || {};
    const session = await loadActiveSession(sessionId, userId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }
    if (session.status !== "active") {
      return res.status(400).json({ error: "Session is not active" });
    }

    const turns = Array.isArray(session.turns) ? [...session.turns] : [];
    const pending = pendingAnswerTurn(turns);
    if (!pending) {
      return res.status(400).json({ error: "No active question to evaluate. Request a question first." });
    }

    const isSkip = skipped === true || skipped === "true";
    const qText = pending.questionText;
    const idx = turns.length - 1;

    if (isSkip) {
      const skipEval = {
        score: null,
        feedback: "This question was skipped. No score was assigned.",
        strengths: [],
        weaknesses: ["Question skipped — opportunity to practice this topic missed."],
        idealAnswer: "",
        followUpQuestion: "",
        followUpRelevant: false,
        skipped: true,
        evaluated: true,
        isSkip: true,
      };
      turns[idx] = {
        questionText: qText,
        answerText: null,
        skipped: true,
        evaluation: skipEval,
      };
      await session.update({
        turns,
        lastEvaluation: skipEval,
        followUpConsumed: false,
      });
      return res.json({
        skipped: true,
        score: null,
        feedback: skipEval.feedback,
        strengths: skipEval.strengths,
        weaknesses: skipEval.weaknesses,
        idealAnswer: skipEval.idealAnswer,
        followUpQuestion: skipEval.followUpQuestion,
        followUpRelevant: false,
        questionIndex: turns.length,
        totalPlanned: session.targetQuestionCount,
      });
    }

    const trimmed = typeof answerText === "string" ? answerText.trim() : "";
    if (!trimmed) {
      return res.status(400).json({ error: "answerText is required unless skipped is true." });
    }

    const evaluation = await evaluateInterviewAnswer({
      domain: session.domain,
      difficulty: session.difficulty,
      question: qText,
      answer: trimmed,
    });

    const storedEval = {
      ...evaluation,
      evaluated: true,
      skipped: false,
    };

    turns[idx] = {
      questionText: qText,
      answerText: trimmed,
      skipped: false,
      evaluation: storedEval,
    };

    await session.update({
      turns,
      lastEvaluation: storedEval,
      followUpConsumed: false,
    });

    res.json({
      skipped: false,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      idealAnswer: evaluation.idealAnswer,
      followUpQuestion: evaluation.followUpQuestion,
      followUpRelevant: evaluation.followUpRelevant,
      questionIndex: turns.length,
      totalPlanned: session.targetQuestionCount,
    });
  } catch (err) {
    if (err.code === "GEMINI_CONFIG") {
      return res.status(503).json({ error: "Interview AI is not configured (missing GEMINI_API_KEY)." });
    }
    logger.error("Interview evaluate failed", err);
    res.status(500).json({ error: err.message || "Unable to evaluate answer" });
  }
}

function computeScoresFromTurns(turns) {
  const scored = (turns || [])
    .map((t) => t?.evaluation?.score)
    .filter((s) => typeof s === "number" && !Number.isNaN(s));
  if (!scored.length) {
    return { averageScore: 0, overallScore: 0 };
  }
  const sum = scored.reduce((a, b) => a + b, 0);
  const avg = sum / scored.length;
  return {
    averageScore: Math.round(avg * 100) / 100,
    overallScore: Math.round(avg * 100) / 100,
  };
}

/**
 * POST /api/interview/end
 * Body: { sessionId, durationSeconds?, abandoned?: boolean }
 */
async function endInterview(req, res) {
  try {
    const userId = req.user.userId;
    const { sessionId, durationSeconds, abandoned } = req.body || {};
    const session = await loadActiveSession(sessionId, userId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }
    if (session.status !== "active") {
      return res.status(400).json({ error: "Session has already been ended" });
    }

    let turns = Array.isArray(session.turns) ? [...session.turns] : [];
    let prevList = Array.isArray(session.previousQuestions) ? [...session.previousQuestions] : [];

    const dur = Number(durationSeconds);
    const timeTaken = Number.isFinite(dur) && dur >= 0 ? Math.floor(dur) : null;

    const isAbandoned = abandoned === true || abandoned === "true";

    if (isAbandoned && pendingAnswerTurn(turns)) {
      turns.pop();
      if (prevList.length > turns.length) {
        prevList = prevList.slice(0, turns.length);
      } else if (prevList.length) {
        prevList.pop();
      }
      await session.update({
        turns,
        previousQuestions: prevList,
        lastEvaluation: null,
        followUpConsumed: false,
      });
    } else if (!isAbandoned && pendingAnswerTurn(turns)) {
      return res.status(400).json({
        error: "Submit or skip the current question before ending the interview.",
      });
    }

    const { averageScore, overallScore } = computeScoresFromTurns(turns);

    let finalReport = null;
    if (!isAbandoned && turns.length > 0) {
      try {
        finalReport = await generateFinalInterviewReport({
          domain: session.domain,
          difficulty: session.difficulty,
          turns,
          averageScore,
          overallScore,
        });
      } catch (e) {
        logger.warn("Final Gemini report failed; using fallback summary", e);
        finalReport = {
          overallSummary: "Interview completed. Review per-question feedback for details.",
          finalStrengths: [],
          finalWeaknesses: [],
          improvementSuggestions: [
            "Re-read weaker answers and compare them to the ideal answers shown.",
            "Drill fundamentals in your selected domain at the chosen difficulty.",
            "Write longer structured answers (situation → approach → tradeoffs → conclusion).",
            "Schedule another session after focused study.",
          ],
        };
      }
    } else {
      finalReport = {
        overallSummary: isAbandoned
          ? "Interview ended early. Progress has been saved as abandoned."
          : "No questions were completed.",
        finalStrengths: [],
        finalWeaknesses: [],
        improvementSuggestions: [],
      };
    }

    const fullReport = {
      sessionId: session.id,
      domain: session.domain,
      difficulty: session.difficulty,
      targetQuestionCount: session.targetQuestionCount,
      questionsCompleted: turns.length,
      averageScore,
      overallScore,
      turns,
      finalStrengths: finalReport.finalStrengths || [],
      finalWeaknesses: finalReport.finalWeaknesses || [],
      improvementSuggestions: finalReport.improvementSuggestions || [],
      overallSummary: finalReport.overallSummary || "",
      timeTakenSeconds: timeTaken,
      abandoned: isAbandoned,
    };

    await session.update({
      status: isAbandoned ? "abandoned" : "completed",
      finalReport: fullReport,
      overallScore,
      averageScore,
      timeTakenSeconds: timeTaken,
    });

    res.json({ report: fullReport });
  } catch (err) {
    if (err.code === "GEMINI_CONFIG") {
      return res.status(503).json({ error: "Interview AI is not configured (missing GEMINI_API_KEY)." });
    }
    logger.error("Interview end failed", err);
    res.status(500).json({ error: "Unable to finalize interview" });
  }
}

/**
 * GET /api/interview/:id/report
 */
async function getInterviewReport(req, res) {
  try {
    const userId = req.user.userId;
    const idNum = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(idNum)) {
      return res.status(400).json({ error: "Invalid interview id" });
    }

    const session = await WrittenInterviewSession.findOne({
      where: { id: idNum, userId },
    });
    if (!session) {
      return res.status(404).json({ error: "Interview report not found" });
    }
    if (session.status === "active") {
      return res.status(400).json({ error: "Interview is still in progress" });
    }

    const report = session.finalReport;
    if (!report) {
      return res.status(404).json({ error: "Report not available" });
    }

    res.json(report);
  } catch (err) {
    logger.error("Interview report GET failed", err);
    res.status(500).json({ error: "Unable to retrieve interview report" });
  }
}

module.exports = {
  detectDomains,
  startWrittenInterview,
  nextQuestion,
  evaluateAnswer,
  endInterview,
  getInterviewReport,
  WRITTEN_INTERVIEW_DOMAINS,
  ALLOWED_DIFFICULTIES,
  ALLOWED_COUNTS,
};

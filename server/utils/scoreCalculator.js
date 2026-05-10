"use strict";

/**
 * Pure evaluation of MCQ attempt against the full question pool for a domain.
 * @param {Array<object>} pool question bank entries for the domain (includes correctAnswer)
 * @param {Map<string, number|null>} answerMap questionId -> selected option 0-3 or null (skip)
 * @returns {{ error?: string } & object}
 */
function summarizeAttempt(pool, answerMap) {
  const byId = new Map(pool.map((q) => [q.id, q]));
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  const topicStats = {};
  const sanitizedQuestionsPayload = [];

  for (const [questionId, selectedOption] of answerMap.entries()) {
    const full = byId.get(questionId);
    if (!full || full.correctAnswer === undefined) {
      return {
        error: `Question ${questionId} is not part of the configured bank for this domain.`,
      };
    }

    const topic = full.topic || "General";
    if (!topicStats[topic]) {
      topicStats[topic] = { attempted: 0, correctCount: 0 };
    }

    const { correctAnswer: _c, ...stripped } = full;
    sanitizedQuestionsPayload.push(stripped);

    if (selectedOption === null) {
      skipped += 1;
      continue;
    }

    topicStats[topic].attempted += 1;
    if (selectedOption === full.correctAnswer) {
      correct += 1;
      topicStats[topic].correctCount += 1;
    } else {
      incorrect += 1;
    }
  }

  const attemptedTotal = correct + incorrect;
  const scoreRounded =
    attemptedTotal > 0 ? Math.round((correct / attemptedTotal) * 100) : 0;

  const byTopicPayload = {};
  Object.entries(topicStats).forEach(([topic, stats]) => {
    byTopicPayload[topic] = {
      attempted: stats.attempted,
      correct: stats.correctCount,
      accuracy: stats.attempted ? stats.correctCount / stats.attempted : 0,
    };
  });

  return {
    correct,
    incorrect,
    skipped,
    attemptedTotal,
    totalSeen: attemptedTotal + skipped,
    byTopicPayload,
    sanitizedQuestionsPayload,
    scoreRounded,
  };
}

module.exports = {
  summarizeAttempt,
};

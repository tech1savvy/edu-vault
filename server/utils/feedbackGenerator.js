"use strict";

/**
 * @param {Record<string, { attempted: number, correct: number, accuracy: number }>} byTopicPayload
 * @returns {{ strengths: string[], weaknesses: string[], recommendations: string[] }}
 */
function generateFeedbackFromTopics(byTopicPayload) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  const entries = Object.entries(byTopicPayload);
  entries.sort((a, b) => b[1].accuracy - a[1].accuracy);

  for (const [topic, { accuracy, attempted }] of entries) {
    if (attempted === 0) continue;
    if (accuracy >= 0.75) {
      strengths.push(
        `Strong conceptual grasp in ${topic}: ${Math.round(accuracy * 100)}% accuracy (${attempted} attempted).`
      );
    } else if (accuracy <= 0.45) {
      weaknesses.push(
        `${topic}: ${Math.round(accuracy * 100)}% across ${attempted} attempted question(s); review fundamentals and drill similar items.`
      );
      recommendations.push(
        `Allocate 30–60 minutes on "${topic}" with spaced quizzes, then redo a shorter timed slice to validate gains.`
      );
    }
  }

  if (strengths.length === 0) {
    strengths.push(
      "You completed the session under timed conditions—baseline metrics captured for your next sprint."
    );
  }
  if (weaknesses.length === 0) {
    weaknesses.push(
      "No brittle topic hotspots versus your attempted mix—raise difficulty with labs or narrower subtopics."
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Alternate complementary topics daily, pair theory with builds, then retake to measure velocity—not just correctness."
    );
  }

  return { strengths, weaknesses, recommendations };
}

module.exports = {
  generateFeedbackFromTopics,
};

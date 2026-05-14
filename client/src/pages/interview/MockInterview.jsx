import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Timer from "../../components/interview/Timer";
import ProgressBar from "../../components/interview/ProgressBar";
import {
  fetchNextInterviewQuestion,
  evaluateInterviewAnswer,
  endWrittenInterview,
} from "../../services/interviewApi";
import "./interview-pages.css";

const OPTIONAL_TIMER_SECONDS = 30 * 60;

export default function MockInterview() {
  const { sessionId: sessionIdParam } = useParams();
  const navigate = useNavigate();
  const sessionId = Number.parseInt(String(sessionIdParam), 10);
  const validSession = Number.isInteger(sessionId) && sessionId > 0;

  const [phase, setPhase] = useState("loading"); // loading | question | evaluating | feedback | ending
  const [error, setError] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalPlanned, setTotalPlanned] = useState(0);
  const [answerDraft, setAnswerDraft] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(OPTIONAL_TIMER_SECONDS);
  const startRef = useRef(null);

  const loadQuestion = useCallback(async () => {
    setPhase("loading");
    setError(null);
    setFeedback(null);
    setAnswerDraft("");
    const res = await fetchNextInterviewQuestion(sessionId);
    setQuestionText(res.question);
    setQuestionIndex(res.questionIndex);
    setTotalPlanned(res.totalPlanned);
    setPhase("question");
  }, [sessionId]);

  useEffect(() => {
    if (!validSession) {
      setError("Invalid session.");
      setPhase("error");
      return undefined;
    }
    if (!startRef.current) startRef.current = Date.now();
    let cancelled = false;
    (async () => {
      try {
        await loadQuestion();
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.error ?? e.message ?? "Failed to load question");
          setPhase("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [validSession, loadQuestion]);

  useEffect(() => {
    if (phase !== "question" && phase !== "evaluating" && phase !== "feedback") return undefined;
    const id = setInterval(() => {
      setTimeLeft((t) => (t <= 0 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const handleSubmit = async () => {
    const text = answerDraft.trim();
    if (!text) {
      setError("Please write an answer or use Skip.");
      return;
    }
    setError(null);
    setPhase("evaluating");
    try {
      const res = await evaluateInterviewAnswer(sessionId, text, false);
      setFeedback(res);
      setPhase("feedback");
    } catch (e) {
      setError(e?.response?.data?.error ?? e.message ?? "Evaluation failed");
      setPhase("question");
    }
  };

  const handleSkip = async () => {
    setError(null);
    setPhase("evaluating");
    try {
      const res = await evaluateInterviewAnswer(sessionId, "", true);
      setFeedback(res);
      setPhase("feedback");
    } catch (e) {
      setError(e?.response?.data?.error ?? e.message ?? "Skip failed");
      setPhase("question");
    }
  };

  const handleContinue = async () => {
    if (questionIndex >= totalPlanned) {
      await handleEnd(false);
      return;
    }
    try {
      await loadQuestion();
    } catch (e) {
      if (e?.response?.status === 400 && String(e?.response?.data?.error || "").includes("planned")) {
        await handleEnd(false);
        return;
      }
      setError(e?.response?.data?.error ?? e.message ?? "Could not load next question");
      setPhase("error");
    }
  };

  const handleEnd = async (abandoned) => {
    setPhase("ending");
    setError(null);
    try {
      const elapsed = startRef.current
        ? Math.floor((Date.now() - startRef.current) / 1000)
        : OPTIONAL_TIMER_SECONDS - timeLeft;
      await endWrittenInterview(sessionId, elapsed, abandoned);
      navigate(`/interview/result/${sessionId}`, { replace: true });
    } catch (e) {
      setError(e?.response?.data?.error ?? e.message ?? "Could not end interview");
      setPhase("feedback");
    }
  };

  const handleExit = () => {
    if (window.confirm("End this interview? Unsaved progress will be marked as abandoned.")) {
      void handleEnd(true);
    }
  };

  const atLastQuestion = questionIndex >= totalPlanned && phase === "feedback";

  if (!validSession) {
    return (
      <div className="interview-shell p-4">
        <p className="text-yellow-400">Invalid session id.</p>
        <Link to="/interview/domain" className="text-cyan-400 no-underline">Return to setup</Link>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="interview-shell p-4">
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-3">{error}</div>
        <Link to="/interview/domain" className="btn interview-gradient-btn">Back to setup</Link>
      </div>
    );
  }

  return (
    <div className="interview-shell p-3 p-md-4 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-600/25">
        <div>
          <Link to="/interview/domain" className="text-sm text-cyan-400 no-underline">
            ← Setup
          </Link>
          <h1 className="text-lg font-semibold mb-1 mt-1">Written mock interview</h1>
          <small className="interview-text-muted">Session #{sessionId}</small>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <Timer secondsRemaining={timeLeft} label="Optional timer" dangerThreshold={120} />
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition border border-red-400/50 text-red-400 hover:bg-red-500/10 cursor-pointer text-sm disabled:opacity-50"
            onClick={handleExit}
            disabled={phase === "ending" || phase === "evaluating"}
          >
            End interview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 order-2 lg:order-1">
          {error && phase !== "error" && (
            <div className="px-4 py-3 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-3">
              {error}
            </div>
          )}

          {(phase === "loading" || phase === "evaluating" || phase === "ending") && (
            <div className="interview-card p-6 text-center interview-text-muted">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto" role="status" />
              <p className="mt-3 mb-0">
                {phase === "evaluating" ? "Evaluating your answer…" : phase === "ending" ? "Saving report…" : "Preparing your question…"}
              </p>
            </div>
          )}

          {phase === "question" && (
            <div className="interview-card p-4">
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-cyan-400/40 text-cyan-400">
                  Question {questionIndex} / {totalPlanned}
                </span>
              </div>
              <p className="text-gray-100 leading-relaxed mb-4 whitespace-pre-wrap">{questionText}</p>
              <label className="block text-xs font-semibold uppercase interview-text-muted mb-2">Your answer</label>
              <textarea
                className="w-full min-h-[220px] rounded-lg border border-gray-600/40 bg-gray-900/80 text-gray-100 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y"
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                placeholder="Type a structured answer: clarify assumptions, outline your approach, note tradeoffs, then conclude."
                disabled={phase !== "question"}
              />
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" className="btn interview-gradient-btn px-4" onClick={handleSubmit}>
                  Submit answer
                </button>
                <button type="button" className="btn interview-gradient-btn-outline px-4" onClick={handleSkip}>
                  Skip question
                </button>
                <button type="button" className="btn interview-gradient-btn-outline px-4 border-red-400/40 text-red-300" onClick={handleExit}>
                  End interview
                </button>
              </div>
            </div>
          )}

          {phase === "feedback" && feedback && (
            <div className="space-y-4">
              <div className="interview-card p-4">
                <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3">Score</h2>
                <div className="text-4xl font-light text-cyan-400 mb-1">
                  {feedback.skipped ? "—" : `${feedback.score} / 10`}
                </div>
                <p className="text-sm interview-text-muted mb-0">{feedback.skipped ? "Skipped — no score" : "Per-question rubric"}</p>
              </div>

              <div className="interview-card p-4">
                <h2 className="text-xs font-semibold uppercase interview-text-muted mb-2">Feedback</h2>
                <p className="text-sm text-gray-200 whitespace-pre-wrap mb-0">{feedback.feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="interview-card p-4">
                  <h3 className="text-xs font-semibold uppercase text-emerald-400/90 mb-2">Strengths</h3>
                  <ul className="text-sm interview-text-muted pl-4 mb-0 space-y-1">
                    {(feedback.strengths || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                    {(!feedback.strengths || feedback.strengths.length === 0) && <li>—</li>}
                  </ul>
                </div>
                <div className="interview-card p-4">
                  <h3 className="text-xs font-semibold uppercase text-amber-400/90 mb-2">Weaknesses</h3>
                  <ul className="text-sm interview-text-muted pl-4 mb-0 space-y-1">
                    {(feedback.weaknesses || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                    {(!feedback.weaknesses || feedback.weaknesses.length === 0) && <li>—</li>}
                  </ul>
                </div>
              </div>

              {!feedback.skipped && feedback.idealAnswer && (
                <div className="interview-card p-4 interview-card-muted">
                  <h3 className="text-xs font-semibold uppercase interview-text-muted mb-2">Ideal answer</h3>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap mb-0">{feedback.idealAnswer}</p>
                </div>
              )}

              {feedback.followUpQuestion && (
                <div className="interview-card p-4 border border-cyan-500/25">
                  <h3 className="text-xs font-semibold uppercase text-cyan-400 mb-2">Follow-up (may be used next)</h3>
                  <p className="text-sm text-gray-200 mb-0 whitespace-pre-wrap">{feedback.followUpQuestion}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {atLastQuestion ? (
                  <button type="button" className="btn interview-gradient-btn px-4" onClick={() => handleEnd(false)}>
                    View final report
                  </button>
                ) : (
                  <button type="button" className="btn interview-gradient-btn px-4" onClick={handleContinue}>
                    Next question
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="interview-card p-3 sticky-lg-top" style={{ top: "1rem", zIndex: 1 }}>
            <h2 className="text-xs font-semibold mb-3">Progress</h2>
            <ProgressBar
              answeredCount={phase === "feedback" ? questionIndex : Math.max(0, questionIndex - 1)}
              total={totalPlanned}
              currentIndex={Math.max(0, questionIndex - 1)}
            />
            <p className="text-xs interview-text-muted mt-3 mb-0">
              Questions are generated dynamically for your domain and difficulty. The optional timer does not auto-submit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

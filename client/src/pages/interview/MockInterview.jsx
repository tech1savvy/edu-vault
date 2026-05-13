import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Timer from "../../components/interview/Timer";
import QuestionCard from "../../components/interview/QuestionCard";
import ProgressBar from "../../components/interview/ProgressBar";
import { fetchQuestions, submitInterview, SLUG_TO_LABEL } from "../../services/interviewApi";
import "./interview-pages.css";

const MOCK_DURATION_SECONDS = 15 * 60;

export default function MockInterview() {
  const { domainSlug } = useParams();
  const navigate = useNavigate();
  const slug = SLUG_TO_LABEL[domainSlug] ? domainSlug : null;

  const [questions, setQuestions] = useState([]);
  const [canonicalDomain, setCanonicalDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(MOCK_DURATION_SECONDS);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const startRef = useRef(null);
  const submittedRef = useRef(false);
  const tickRef = useRef(null);
  const questionsRef = useRef([]);
  const answersRef = useRef({});

  useEffect(() => {
    tickRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setFetchError("Invalid interview route.");
      setLoading(false);
      return undefined;
    }
    (async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const resp = await fetchQuestions(slug);
        if (cancelled) return;
        setQuestions(resp?.questions ?? []);
        setCanonicalDomain(resp?.domain ?? SLUG_TO_LABEL[slug] ?? "");
        startRef.current = Date.now();
        setTimeLeft(MOCK_DURATION_SECONDS);
        const init = {};
        (resp?.questions ?? []).forEach((q) => {
          init[q.id] = null;
        });
        setAnswers(init);
      } catch (e) {
        if (!cancelled) setFetchError(e?.response?.data?.error ?? e.message ?? "Failed to load questions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const runSubmitRef = useRef(async () => {});

  runSubmitRef.current = async () => {
    if (!slug || submittedRef.current || !questionsRef.current.length) return;
    submittedRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const elapsed = startRef.current
        ? Math.min(MOCK_DURATION_SECONDS, Math.floor((Date.now() - startRef.current) / 1000))
        : MOCK_DURATION_SECONDS - tickRef.current;

      const ans = answersRef.current;
      const payload = {
        selectedDomain: slug,
        durationSeconds: elapsed,
        answers: questionsRef.current.map((q) => ({
          questionId: q.id,
          selectedOption:
            ans[q.id] !== undefined && ans[q.id] !== null ? ans[q.id] : null,
        })),
      };

      const result = await submitInterview(payload);
      navigate(`/interview/result/${result.interviewId}`, { replace: true });
    } catch (e) {
      submittedRef.current = false;
      setSubmitError(e?.response?.data?.error ?? e.message ?? "Submit failed");
      setSubmitting(false);
    }
  };

  const runSubmit = useCallback(async () => {
    await runSubmitRef.current();
  }, []);

  useEffect(() => {
    if (loading || fetchError || !questions.length || submittedRef.current) return undefined;

    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          void runSubmitRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [loading, fetchError, questions.length]);

  const current = questions[idx];
  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined).length;

  const handleExit = () => {
    if (window.confirm("Exit interview? Progress on this sitting will not be scored until you submit.")) {
      navigate("/interview/domain");
    }
  };

  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(questions.length - 1, i + 1));

  if (!slug) {
    return (
      <div className="interview-shell p-4">
        <p className="text-yellow-400">Unknown domain slug.</p>
        <Link to="/interview/domain" className="text-cyan-400 no-underline">Return to domain selection</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="interview-shell p-5 text-center interview-text-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto" role="status" />
        <p className="mt-3 mb-0">Building your timed session...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="interview-shell p-4">
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30">{fetchError}</div>
        <Link to="/interview/domain" className="btn interview-gradient-btn mt-3">
          Domain selection
        </Link>
      </div>
    );
  }

  return (
    <div className="interview-shell p-3 p-md-4 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-600/25">
        <div>
          <Link to="/interview/domain" className="text-sm text-cyan-400 no-underline">
            ← Change domain
          </Link>
          <h1 className="text-lg font-semibold mb-1 mt-1">Mock Interview</h1>
          <small className="interview-text-muted">{canonicalDomain}</small>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <Timer secondsRemaining={timeLeft} label="Interview timer" dangerThreshold={90} />
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition border border-red-400/50 text-red-400 hover:bg-red-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={handleExit}
            disabled={submitting}
          >
            Exit interview
          </button>
          <button
            type="button"
            className="btn interview-gradient-btn px-3 py-1.5 text-sm"
            onClick={() => runSubmit()}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit now"}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="px-4 py-3 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-3">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 order-2 lg:order-1">
          {current ? (
            <QuestionCard
              question={current}
              questionNumber={idx + 1}
              total={questions.length}
              selectedOption={answers[current.id]}
              onSelect={(opt) => setAnswers((a) => ({ ...a, [current.id]: opt }))}
            />
          ) : (
            <p className="interview-text-muted">No question loaded.</p>
          )}
          <div className="flex justify-between flex-wrap gap-2 mt-4">
            <button
              type="button"
              className="btn interview-gradient-btn-outline px-4"
              onClick={goPrev}
              disabled={idx === 0 || submitting}
            >
              Previous
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-cyan-400/70 hover:text-cyan-400 no-underline bg-transparent border-none cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed px-2"
                disabled={submitting || !current}
                onClick={() => current && setAnswers((a) => ({ ...a, [current.id]: null }))}
              >
                Skip this question
              </button>
              <button
                type="button"
                className="btn interview-gradient-btn px-4"
                onClick={goNext}
                disabled={idx >= questions.length - 1 || submitting}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="interview-card p-3 sticky-lg-top" style={{ top: "1rem", zIndex: 1 }}>
            <h2 className="text-xs font-semibold mb-3">Questions</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {questions.map((q, i) => {
                const has =
                  answers[q.id] !== null &&
                  answers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      i === idx
                        ? "bg-cyan-500 text-gray-900"
                        : has
                          ? "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                          : "border border-gray-600 text-gray-400 hover:bg-gray-600/20"
                    }`}
                    disabled={submitting}
                    onClick={() => setIdx(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <ProgressBar answeredCount={answeredCount} total={questions.length} currentIndex={idx} />
            <hr className="border-gray-600/25 my-4" />
            <div className="text-xs mb-2">
              <span className="uppercase interview-text-muted" style={{ fontSize: "0.65rem" }}>
                Current topic
              </span>
              <div className="font-semibold">{current?.topic ?? "—"}</div>
            </div>
            <div className="interview-card-muted p-3 rounded-lg text-sm interview-text-muted">
              <strong className="text-gray-100 block mb-2">Instructions</strong>
              <ul className="pl-3 mb-0">
                <li className="mb-2">Select the best MCQ answer; skips count as unanswered.</li>
                <li className="mb-2">Timer auto-submits—keep an eye on the clock.</li>
                <li>Use the navigator to revise earlier answers freely.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

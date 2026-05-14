import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, TrendingDown, Lightbulb, FileText } from "lucide-react";
import RecommendationCard from "../../components/interview/RecommendationCard";
import { fetchInterviewReport } from "../../services/interviewApi";
import "./interview-pages.css";

function secsToMmss(totalSec) {
  const s = Math.max(0, Math.floor(Number(totalSec) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function InterviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!id) {
        setError("Missing interview id.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const payload = await fetchInterviewReport(id);
        if (!cancel) setReport(payload);
      } catch (e) {
        if (!cancel) setError(e?.response?.data?.error ?? e.message ?? "Could not load report");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  const scoredTurns = useMemo(() => {
    const turns = report?.turns || [];
    return turns.map((t, i) => ({ ...t, _i: i }));
  }, [report]);

  if (loading) {
    return (
      <div className="interview-shell p-5 text-center interview-text-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto" role="status" />
        <p className="mt-3 mb-0">Loading final report…</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="interview-shell p-4">
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30">{error ?? "Report unavailable"}</div>
        <button type="button" className="btn interview-gradient-btn mt-3" onClick={() => navigate("/interview/domain")}>
          Back to setup
        </button>
      </div>
    );
  }

  const abandoned = report.abandoned === true;
  const avg = Number(report.averageScore) || 0;
  const overall = Number(report.overallScore) || 0;

  return (
    <div className="interview-shell p-3 p-md-5 mb-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="flex items-center gap-2 mb-0 interview-text-muted text-sm flex-wrap">
          <li>
            <Link to="/" className="no-underline text-cyan-400">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-500">/</li>
          <li>
            <Link to="/interview/domain" className="no-underline text-cyan-400">
              Mock Interview
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-500">/</li>
          <li className="text-gray-100" aria-current="page">
            Report
          </li>
        </ol>
      </nav>

      <div className="flex justify-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Interview report</h1>
          <p className="interview-text-muted text-sm mb-0">
            {report.domain} • {report.difficulty} • Session #{report.sessionId ?? id}
            {abandoned && <span className="text-amber-400"> • Ended early</span>}
          </p>
        </div>
        <button type="button" className="btn interview-gradient-btn px-4 py-2" onClick={() => navigate("/interview/domain")}>
          New interview
        </button>
      </div>

      {report.overallSummary && (
        <div className="interview-card p-4 mb-4 interview-card-muted">
          <h2 className="text-xs font-semibold uppercase interview-text-muted mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" aria-hidden /> Summary
          </h2>
          <p className="text-sm text-gray-200 mb-0 whitespace-pre-wrap">{report.overallSummary}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="interview-card p-3 text-center interview-card-muted h-full">
          <small className="uppercase interview-text-muted block mb-2">Overall score</small>
          <div className="text-4xl font-light text-cyan-400">{overall.toFixed(1)}</div>
          <small className="interview-text-muted">out of 10</small>
        </div>
        <div className="interview-card p-3 text-center h-full">
          <small className="uppercase interview-text-muted block mb-2">Average score</small>
          <div className="text-3xl font-semibold mb-0">{avg.toFixed(1)}</div>
          <small className="interview-text-muted">out of 10</small>
        </div>
        <div className="interview-card p-3 text-center interview-card-muted h-full">
          <small className="uppercase interview-text-muted block mb-2">Questions</small>
          <div className="text-2xl font-semibold mb-0">{report.questionsCompleted ?? scoredTurns.length}</div>
          <small className="interview-text-muted">completed</small>
        </div>
        <div className="interview-card p-3 text-center h-full">
          <small className="uppercase interview-text-muted block mb-2">Time</small>
          <div className="text-2xl font-semibold mb-0">{secsToMmss(report.timeTakenSeconds)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <div className="lg:col-span-6">
          <RecommendationCard title="Final strengths" icon={CheckCircle} items={report.finalStrengths || []} />
        </div>
        <div className="lg:col-span-6">
          <RecommendationCard title="Final weaknesses" icon={TrendingDown} items={report.finalWeaknesses || []} />
        </div>
        <div className="lg:col-span-12">
          <RecommendationCard title="Improvement suggestions" icon={Lightbulb} items={report.improvementSuggestions || []} />
        </div>
      </div>

      <div className="interview-card p-4">
        <h2 className="text-xs font-semibold uppercase interview-text-muted mb-4">Questions, answers & feedback</h2>
        <div className="space-y-4">
          {scoredTurns.map((t) => (
            <div key={t._i} className="border border-gray-600/25 rounded-lg p-4 interview-card-muted">
              <div className="text-xs uppercase interview-text-muted mb-1">Question {t._i + 1}</div>
              <p className="text-sm text-gray-100 mb-3 whitespace-pre-wrap">{t.questionText}</p>
              <div className="text-xs uppercase interview-text-muted mb-1">Your answer</div>
              <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">
                {t.skipped ? <em className="text-amber-400/90">Skipped</em> : t.answerText || "—"}
              </p>
              {t.evaluation && !t.skipped && (
                <>
                  <div className="flex flex-wrap gap-3 mb-2 text-sm">
                    <span className="text-cyan-400 font-semibold">
                      Score: {typeof t.evaluation.score === "number" ? `${t.evaluation.score}/10` : "—"}
                    </span>
                  </div>
                  {t.evaluation.feedback && (
                    <p className="text-sm interview-text-muted mb-2 whitespace-pre-wrap">{t.evaluation.feedback}</p>
                  )}
                  {t.evaluation.idealAnswer && (
                    <div className="mt-2">
                      <div className="text-xs uppercase interview-text-muted mb-1">Ideal answer</div>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap mb-0">{t.evaluation.idealAnswer}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          {scoredTurns.length === 0 && (
            <p className="text-sm interview-text-muted mb-0">No questions in this session.</p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RecommendationCard from "../../components/interview/RecommendationCard";
import { ResultDonut } from "../../components/interview/AnalyticsChart";
import { fetchInterviewResult } from "../../services/interviewApi";
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
  const [result, setResult] = useState(null);

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
        const payload = await fetchInterviewResult(id);
        if (!cancel) setResult(payload);
      } catch (e) {
        if (!cancel) setError(e?.response?.data?.error ?? e.message ?? "Could not load result");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  const topicRows = useMemo(() => {
    const tb = result?.analytics?.topicBreakdown || {};
    return Object.entries(tb)
      .map(([topic, v]) => ({ topic, ...(v || {}) }))
      .sort((a, b) => (b.attempted || 0) - (a.attempted || 0));
  }, [result]);

  const enhancements = useMemo(() => {
    const base = [
      "Record short voice notes reviewing each mistake and restate the correct mental model.",
      "Pair textbook sections with EduVault portfolio updates so recruiters see evolving depth.",
    ];
    const fromApi = Array.isArray(result?.recommendations) ? [...result.recommendations] : [];
    return [...new Set([...fromApi.slice(0, 2), ...base])].slice(0, 6);
  }, [result]);

  if (loading) {
    return (
      <div className="interview-shell p-5 text-center interview-text-muted">
        <div className="spinner-border text-info" />
        <p className="mt-3 mb-0">Fetching your breakdown...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="interview-shell p-4">
        <div className="alert alert-danger">{error ?? "Result unavailable"}</div>
        <button type="button" className="btn interview-gradient-btn" onClick={() => navigate("/dashboard/interview")}>
          Back to domain selection
        </button>
      </div>
    );
  }

  const a = result.analytics || {};

  return (
    <div className="interview-shell p-3 p-md-5 mb-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small mb-0 interview-text-muted">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-info">
              Home
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/dashboard/interview" className="text-decoration-none text-info">
              Mock Interview
            </Link>
          </li>
          <li className="breadcrumb-item active text-light" aria-current="page">
            Results
          </li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h3 mb-1">Interview results</h1>
          <p className="interview-text-muted small mb-0">
            {result.selectedDomain} • Session #{result.id}
          </p>
        </div>
        <button type="button" className="btn interview-gradient-btn px-4 py-2" onClick={() => navigate("/dashboard/interview")}>
          Retake interview
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="interview-card p-3 text-center interview-card-muted h-100">
            <small className="text-uppercase interview-text-muted d-block mb-2">Overall score</small>
            <div className="display-6 text-info">{result.score}%</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="interview-card p-3 text-center h-100">
            <small className="text-uppercase interview-text-muted d-block mb-2">Attempted</small>
            <div className="h3 mb-0">{a.attemptedTotal ?? 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="interview-card p-3 text-center interview-card-muted h-100">
            <small className="text-uppercase interview-text-muted d-block mb-2">Time taken</small>
            <div className="h3 mb-0">{secsToMmss(result.timeTaken)}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="interview-card p-3 text-center h-100">
            <small className="text-uppercase interview-text-muted d-block mb-2">Percentile rank</small>
            <div className="h3 mb-0">{Math.round(Number(result.percentile) || 0)}</div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="interview-card p-4 mb-4">
            <h2 className="h6 text-uppercase interview-text-muted mb-3">Section-wise performance</h2>
            {topicRows.length === 0 && <p className="small interview-text-muted mb-0">No topical breakdown recorded.</p>}
            {topicRows.map((row) => {
              const acc = typeof row.accuracy === "number" ? row.accuracy : 0;
              const pct = Math.round(acc * 100);
              return (
                <div key={row.topic} className="mb-4">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-light">{row.topic}</span>
                    <span className="interview-text-muted">
                      {pct}% • {row.correct ?? 0}/{row.attempted ?? 0}
                    </span>
                  </div>
                  <div className="progress" style={{ height: "0.55rem", background: "rgba(148,163,184,0.15)" }}>
                    <div className="progress-bar" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#22d3ee)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <RecommendationCard title="Strengths" icon="bi-check-circle" items={result.strengths} />
            </div>
            <div className="col-md-6">
              <RecommendationCard title="Areas to improve" icon="bi-graph-down-arrow" items={result.weaknesses} />
            </div>
            <div className="col-12">
              <RecommendationCard title="Recommendations" icon="bi-compass" items={result.recommendations} />
            </div>
            <div className="col-12">
              <RecommendationCard title="Enhancement tips" icon="bi-lightning-charge" items={enhancements} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="interview-card p-4 text-center mb-4">
            <h2 className="h6 mb-4 text-start">Accuracy mix</h2>
            <ResultDonut correct={a.correct} incorrect={a.incorrect} skipped={a.skipped} />
            <div className="d-flex justify-content-around flex-wrap mt-4 small interview-text-muted text-start px-2">
              <div>
                <span className="rounded-circle bg-success me-2 d-inline-block" style={{ width: 10, height: 10 }} /> Correct:{" "}
                <strong className="text-light">{a.correct ?? 0}</strong>
              </div>
              <div className="ms-3">
                <span className="rounded-circle bg-danger me-2 d-inline-block" style={{ width: 10, height: 10 }} /> Incorrect:{" "}
                <strong className="text-light">{a.incorrect ?? 0}</strong>
              </div>
              <div className="ms-3">
                <span className="rounded-circle bg-secondary me-2 d-inline-block" style={{ width: 10, height: 10 }} /> Skipped:{" "}
                <strong className="text-light">{a.skipped ?? 0}</strong>
              </div>
            </div>
          </div>
          <button type="button" className="btn interview-gradient-btn-outline w-100 py-2" onClick={() => navigate("/dashboard/interview")}>
            Schedule another timed run →
          </button>
        </div>
      </div>
    </div>
  );
}

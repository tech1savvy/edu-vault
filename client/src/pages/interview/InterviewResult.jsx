import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, TrendingDown, Compass, Zap } from "lucide-react";
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto" role="status" />
        <p className="mt-3 mb-0">Fetching your breakdown...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="interview-shell p-4">
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30">{error ?? "Result unavailable"}</div>
        <button type="button" className="btn interview-gradient-btn mt-3" onClick={() => navigate("/interview/domain")}>
          Back to domain selection
        </button>
      </div>
    );
  }

  const a = result.analytics || {};

  return (
    <div className="interview-shell p-3 p-md-5 mb-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="flex items-center gap-2 mb-0 interview-text-muted text-sm">
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
            Results
          </li>
        </ol>
      </nav>

      <div className="flex justify-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Interview results</h1>
          <p className="interview-text-muted text-sm mb-0">
            {result.selectedDomain} • Session #{result.id}
          </p>
        </div>
        <button type="button" className="btn interview-gradient-btn px-4 py-2" onClick={() => navigate("/interview/domain")}>
          Retake interview
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="interview-card p-3 text-center interview-card-muted h-full">
          <small className="uppercase interview-text-muted block mb-2">Overall score</small>
          <div className="text-5xl font-light text-cyan-400">{result.score}%</div>
        </div>
        <div className="interview-card p-3 text-center h-full">
          <small className="uppercase interview-text-muted block mb-2">Attempted</small>
          <div className="text-2xl font-semibold mb-0">{a.attemptedTotal ?? 0}</div>
        </div>
        <div className="interview-card p-3 text-center interview-card-muted h-full">
          <small className="uppercase interview-text-muted block mb-2">Time taken</small>
          <div className="text-2xl font-semibold mb-0">{secsToMmss(result.timeTaken)}</div>
        </div>
        <div className="interview-card p-3 text-center h-full">
          <small className="uppercase interview-text-muted block mb-2">Percentile rank</small>
          <div className="text-2xl font-semibold mb-0">{Math.round(Number(result.percentile) || 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        <div className="lg:col-span-7">
          <div className="interview-card p-4 mb-4">
            <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3">Section-wise performance</h2>
            {topicRows.length === 0 && <p className="text-sm interview-text-muted mb-0">No topical breakdown recorded.</p>}
            {topicRows.map((row) => {
              const acc = typeof row.accuracy === "number" ? row.accuracy : 0;
              const pct = Math.round(acc * 100);
              return (
                <div key={row.topic} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-100">{row.topic}</span>
                    <span className="interview-text-muted">
                      {pct}% • {row.correct ?? 0}/{row.attempted ?? 0}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ height: "0.55rem", background: "rgba(148,163,184,0.15)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#22d3ee)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <RecommendationCard title="Strengths" icon={CheckCircle} items={result.strengths} />
            </div>
            <div className="md:col-span-1">
              <RecommendationCard title="Areas to improve" icon={TrendingDown} items={result.weaknesses} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <RecommendationCard title="Recommendations" icon={Compass} items={result.recommendations} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <RecommendationCard title="Enhancement tips" icon={Zap} items={enhancements} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="interview-card p-4 text-center mb-4">
            <h2 className="text-xs font-semibold mb-4 text-left">Accuracy mix</h2>
            <ResultDonut correct={a.correct} incorrect={a.incorrect} skipped={a.skipped} />
            <div className="flex justify-around flex-wrap mt-4 text-sm interview-text-muted text-left px-2">
              <div>
                <span className="rounded-full bg-green-500 mr-2 inline-block" style={{ width: 10, height: 10 }} /> Correct:{" "}
                <strong className="text-gray-100">{a.correct ?? 0}</strong>
              </div>
              <div className="ml-3">
                <span className="rounded-full bg-red-500 mr-2 inline-block" style={{ width: 10, height: 10 }} /> Incorrect:{" "}
                <strong className="text-gray-100">{a.incorrect ?? 0}</strong>
              </div>
              <div className="ml-3">
                <span className="rounded-full bg-gray-500 mr-2 inline-block" style={{ width: 10, height: 10 }} /> Skipped:{" "}
                <strong className="text-gray-100">{a.skipped ?? 0}</strong>
              </div>
            </div>
          </div>
          <button type="button" className="btn interview-gradient-btn-outline w-full py-2" onClick={() => navigate("/interview/domain")}>
            Schedule another timed run →
          </button>
        </div>
      </div>
    </div>
  );
}

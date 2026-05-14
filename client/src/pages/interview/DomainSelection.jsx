import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import {
  fetchDomainDetection,
  startWrittenInterview,
  WRITTEN_INTERVIEW_DOMAINS,
  INTERVIEW_DIFFICULTIES,
  INTERVIEW_QUESTION_COUNTS,
} from "../../services/interviewApi";
import { MatchConfidenceRadial } from "../../components/interview/AnalyticsChart";
import "./interview-pages.css";

function mapDetectionToDomain(primary, suggested) {
  const candidates = [primary, ...(Array.isArray(suggested) ? suggested.map((s) => s?.domain) : [])].filter(Boolean);
  for (const c of candidates) {
    if (WRITTEN_INTERVIEW_DOMAINS.includes(c)) return c;
    if (c === "DevOps Engineering" && WRITTEN_INTERVIEW_DOMAINS.includes("DevOps")) return "DevOps";
  }
  return WRITTEN_INTERVIEW_DOMAINS[0];
}

export default function DomainSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [domain, setDomain] = useState(WRITTEN_INTERVIEW_DOMAINS[0]);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = await fetchDomainDetection();
        if (!cancel) {
          setData(payload);
          const suggested = mapDetectionToDomain(payload?.primaryDomain, payload?.suggestedDomains);
          setDomain(suggested);
        }
      } catch (e) {
        if (!cancel) setError(e?.response?.data?.error ?? e.message ?? "Failed to load profile hints");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const handleStart = async () => {
    setStartError(null);
    setStarting(true);
    try {
      const res = await startWrittenInterview({
        domain,
        difficulty,
        questionCount,
      });
      navigate(`/interview/session/${res.sessionId}`);
    } catch (e) {
      const base = e?.response?.data?.error ?? e.message ?? "Could not start interview";
      const det = e?.response?.data?.details;
      setStartError(det ? `${base}: ${det}` : base);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="interview-shell p-4 p-md-5 mb-5">
      <div className="flex justify-between flex-wrap gap-2 mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 mb-2 interview-text-muted text-sm">
              <li>
                <Link to="/" className="no-underline text-cyan-400">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-500">/</li>
              <li className="text-gray-100" aria-current="page">
                Mock Interview
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-semibold mb-1">Interview setup</h1>
          <p className="interview-text-muted mb-0 text-sm">
            Choose your track and difficulty. Questions and grading are powered by Google Gemini on the server — your API key stays on the backend only.
          </p>
        </div>
      </div>

      {loading && (
        <div className="py-5 text-center interview-text-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto" role="status" />
          <p className="mt-3 mb-0">Loading profile suggestions…</p>
        </div>
      )}

      {!loading && error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-4" role="alert">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {data && (
            <div className="lg:col-span-5">
              <div className="interview-card p-4 mb-4 text-center interview-card-muted">
                <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3 text-left">Primary match confidence</h2>
                <MatchConfidenceRadial percentage={data.matchConfidence} />
              </div>
              <div className="interview-card p-4 mb-4 interview-card-muted">
                <h2 className="text-xs font-semibold mb-2 text-cyan-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" aria-hidden /> How it works
                </h2>
                <ul className="text-sm interview-text-muted pl-3 mb-0">
                  {(data.howItWorks ?? ["Configure your session", "Answer in writing", "Get AI feedback after each answer"]).map((step, idx) => (
                    <li key={idx} className="mb-2">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className={data ? "lg:col-span-7" : "lg:col-span-12"}>
            <div className="interview-card p-4 mb-4">
              <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3">Domain</h2>
              <select
                className="w-full rounded-lg border border-gray-600/40 bg-gray-900/80 text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {WRITTEN_INTERVIEW_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="interview-card p-4 mb-4">
              <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3">Difficulty</h2>
              <div className="flex flex-wrap gap-2">
                {INTERVIEW_DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${
                      difficulty === d
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                        : "border-gray-600/40 text-gray-300 hover:border-gray-500"
                    }`}
                    onClick={() => setDifficulty(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="interview-card p-4 mb-4">
              <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3">Number of questions</h2>
              <div className="flex flex-wrap gap-2">
                {INTERVIEW_QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${
                      questionCount === n
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                        : "border-gray-600/40 text-gray-300 hover:border-gray-500"
                    }`}
                    onClick={() => setQuestionCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {startError && (
              <div className="px-4 py-3 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-4">
                {startError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link to="/" className="btn interview-gradient-btn-outline order-2 sm:order-1 px-4 text-center">
                Back
              </Link>
              <button
                type="button"
                className="btn interview-gradient-btn order-1 sm:order-2 px-4 py-2"
                disabled={starting}
                onClick={handleStart}
              >
                {starting ? "Starting…" : "Start interview"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { fetchDomainDetection, slugForDomainLabel } from "../../services/interviewApi";
import { MatchConfidenceRadial } from "../../components/interview/AnalyticsChart";
import DomainCard from "../../components/interview/DomainCard";
import "./interview-pages.css";

export default function DomainSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = await fetchDomainDetection();
          if (!cancel) {
            setData(payload);
            setSelected(prev => payload?.primaryDomain || prev);
          }
      } catch (e) {
        if (!cancel) setError(e?.response?.data?.error ?? e.message ?? "Failed to load domains");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const handleContinue = () => {
    const slug = slugForDomainLabel(selected);
    if (!slug) return;
    navigate(`/interview/session/${slug}`);
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
          <h1 className="text-2xl font-semibold mb-1">Domain selection</h1>
          <p className="interview-text-muted mb-0 text-sm">
            AI-guided detection uses your EduVault resume signals to suggest the best-fit interview track.
          </p>
        </div>
      </div>

      {loading && (
        <div className="py-5 text-center interview-text-muted">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto" role="status" />
          <p className="mt-3 mb-0">Analyzing your profile...</p>
        </div>
      )}

      {!loading && error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <div className="interview-card p-4 mb-4 text-center interview-card-muted">
              <h2 className="text-xs font-semibold uppercase interview-text-muted mb-3 text-left">Primary match confidence</h2>
              <MatchConfidenceRadial percentage={data.matchConfidence} />
            </div>
            <div className="interview-card p-4 mb-4">
              <h2 className="text-xs font-semibold mb-3">Key skills analyzed</h2>
              <div className="flex flex-wrap gap-2">
                {(data.keySkillsAnalyzed ?? []).length ? (
                  data.keySkillsAnalyzed.map((s) => (
                    <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/20 text-gray-300">
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-sm interview-text-muted mb-0">Add skills & projects under Input to tighten detection.</p>
                )}
              </div>
            </div>
            <div className="interview-card p-4 interview-card-muted">
              <h2 className="text-xs font-semibold mb-2 text-cyan-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" aria-hidden /> How it works?
              </h2>
              <ul className="text-sm interview-text-muted pl-3 mb-0">
                {(data.howItWorks ?? []).map((step, idx) => (
                  <li key={idx} className="mb-2">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-xs font-semibold mb-3 text-cyan-400 uppercase">Suggested domains</h2>
            <div className="flex flex-col gap-3 mb-4">
              {(data.suggestedDomains ?? []).map((sd) => (
                <DomainCard
                  key={sd.domain}
                  domain={sd.domain}
                  stats={sd}
                  checked={selected === sd.domain}
                  onSelect={setSelected}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Link to="/" className="btn interview-gradient-btn-outline order-2 sm:order-1 px-4">
                Back
              </Link>
              <button
                type="button"
                className="btn interview-gradient-btn order-1 sm:order-2 px-4 py-2"
                disabled={!selected || !slugForDomainLabel(selected)}
                onClick={handleContinue}
              >
                Continue to interview →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

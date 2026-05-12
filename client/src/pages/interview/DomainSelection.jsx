import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
          if (payload?.primaryDomain && !selected) setSelected(payload.primaryDomain);
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
      <div className="d-flex justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 interview-text-muted small">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-info">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-light" aria-current="page">
                Mock Interview
              </li>
            </ol>
          </nav>
          <h1 className="h3 mb-1">Domain selection</h1>
          <p className="interview-text-muted mb-0 small">
            AI-guided detection uses your EduVault resume signals to suggest the best-fit interview track.
          </p>
        </div>
      </div>

      {loading && (
        <div className="py-5 text-center interview-text-muted">
          <div className="spinner-border text-info" role="status" />
          <p className="mt-3 mb-0">Analyzing your profile...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="interview-card p-4 mb-4 text-center interview-card-muted">
              <h2 className="h6 text-uppercase interview-text-muted mb-3 text-start">Primary match confidence</h2>
              <MatchConfidenceRadial percentage={data.matchConfidence} />
            </div>
            <div className="interview-card p-4 mb-4">
              <h2 className="h6 mb-3">Key skills analyzed</h2>
              <div className="d-flex flex-wrap gap-2">
                {(data.keySkillsAnalyzed ?? []).length ? (
                  data.keySkillsAnalyzed.map((s) => (
                    <span key={s} className="badge rounded-pill text-bg-secondary">
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="small interview-text-muted mb-0">Add skills & projects under Input to tighten detection.</p>
                )}
              </div>
            </div>
            <div className="interview-card p-4 interview-card-muted">
              <h2 className="h6 mb-2 text-info">
                <i className="bi bi-question-circle me-2" aria-hidden /> How it works?
              </h2>
              <ul className="small interview-text-muted ps-3 mb-0">
                {(data.howItWorks ?? []).map((step, idx) => (
                  <li key={idx} className="mb-2">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-7">
            <h2 className="h6 mb-3 text-info text-uppercase">Suggested domains</h2>
            <div className="d-flex flex-column gap-3 mb-4">
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
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end">
              <Link to="/" className="btn interview-gradient-btn-outline order-2 order-sm-1 px-4">
                Back
              </Link>
              <button
                type="button"
                className="btn interview-gradient-btn order-1 order-sm-2 px-4 py-2"
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

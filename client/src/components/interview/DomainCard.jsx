import { slugForDomainLabel } from "../../services/interviewApi";

export default function DomainCard({ domain, stats, checked, onSelect }) {
  if (!stats) return null;
  const { confidence, matchedSkills = [], description } = stats;

  const slugId = slugForDomainLabel(domain) ?? domain.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className={`interview-card p-3 h-100 ${
        checked ? "border border-info shadow-sm interview-accent-border" : "border-secondary border-opacity-25"
      }`}
    >
      <div className="form-check d-flex gap-3">
        <input
          id={`domain-radio-${slugId}`}
          type="radio"
          className="form-check-input mt-1 flex-shrink-0"
          checked={checked}
          onChange={() => onSelect(domain)}
        />
        <label className="form-check-label w-100 cursor-pointer" htmlFor={`domain-radio-${slugId}`}>
          <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
            <span className="fw-semibold text-light">{domain}</span>
            <span className="badge rounded-pill text-bg-dark border border-opacity-25 border-secondary">
              {Math.round(Number(confidence) || 0)}% match
            </span>
          </div>
          <p className="small interview-text-muted mb-2">{description}</p>
          {matchedSkills?.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {matchedSkills.slice(0, 8).map((s) => (
                <span key={s} className="badge text-bg-secondary text-wrap fw-normal opacity-85">
                  {s}
                </span>
              ))}
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

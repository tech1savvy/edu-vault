import { slugForDomainLabel } from "../../services/interviewApi";

export default function DomainCard({ domain, stats, checked, onSelect }) {
  if (!stats) return null;
  const { confidence, matchedSkills = [], description } = stats;

  const slugId = slugForDomainLabel(domain) ?? domain.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className={`interview-card p-3 h-full ${
        checked ? "border border-cyan-400/60 shadow-sm interview-accent-border" : "border-gray-600/25"
      }`}
    >
      <div className="flex gap-3">
        <input
          id={`domain-radio-${slugId}`}
          type="radio"
          className="mt-1 shrink-0 h-4 w-4 accent-cyan-500"
          checked={checked}
          onChange={() => onSelect(domain)}
        />
        <label className="w-full cursor-pointer" htmlFor={`domain-radio-${slugId}`}>
          <div className="flex justify-between flex-wrap gap-2 mb-2">
            <span className="font-semibold text-gray-100">{domain}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/50 text-gray-200 border border-gray-600/25">
              {Math.round(Number(confidence) || 0)}% match
            </span>
          </div>
          <p className="text-sm interview-text-muted mb-2">{description}</p>
          {matchedSkills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {matchedSkills.slice(0, 8).map((s) => (
                <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal bg-gray-600/20 text-gray-300 opacity-85">
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

export default function RecommendationCard({ title, items = [], icon = "bi-lightbulb" }) {
  if (!items?.length) return null;

  return (
    <div className="interview-card p-4 h-100">
      <div className="d-flex align-items-center gap-2 mb-3">
        <i className={`bi ${icon} text-info fs-5`} aria-hidden />
        <h3 className="h6 mb-0">{title}</h3>
      </div>
      <ul className="list-unstyled mb-0 interview-text-muted small lh-lg">
        {items.map((line, idx) => (
          <li key={idx} className="mb-2 d-flex gap-2">
            <span className="text-info flex-shrink-0">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

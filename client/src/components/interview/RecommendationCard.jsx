import { Lightbulb } from "lucide-react";

export default function RecommendationCard({ title, items = [], icon: IconComponent = Lightbulb }) {
  if (!items?.length) return null;

  return (
    <div className="interview-card p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <IconComponent className="text-cyan-400 w-5 h-5" aria-hidden />
        <h3 className="text-base font-semibold mb-0">{title}</h3>
      </div>
      <ul className="list-none mb-0 interview-text-muted text-sm leading-relaxed">
        {items.map((line, idx) => (
          <li key={idx} className="mb-2 flex gap-2">
            <span className="text-cyan-400 shrink-0">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

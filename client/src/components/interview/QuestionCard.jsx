export default function QuestionCard({ question, selectedOption, questionNumber, total, onSelect }) {
  if (!question) return null;

  return (
    <div className="interview-card p-4 h-full">
      <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-transparent interview-accent-border interview-topic-pill text-cyan-400">
          {question.topic}
        </span>
        <small className="interview-text-muted">
          Question {questionNumber} of {total}
        </small>
      </div>
      <h2 className="text-lg leading-relaxed mb-4">{question.question}</h2>
      <div className="flex flex-col gap-1">
        {(question.options || []).map((opt, idx) => {
          const active = selectedOption === idx;
          return (
            <label
              key={idx}
              className={`flex gap-3 items-center border rounded-3 mb-2 p-3 interview-card-muted cursor-pointer ${
                active ? "interview-accent-border shadow-sm text-gray-100" : "border-gray-600/25"
              }`}
              style={{ cursor: "pointer" }}
            >
              <input
                className="mt-0 shrink-0 h-4 w-4 accent-cyan-500"
                type="radio"
                name={`q-opt-${question.id}`}
                checked={active}
                onChange={() => onSelect(idx)}
              />
              <span className="flex-1">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

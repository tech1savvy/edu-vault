export default function QuestionCard({ question, selectedOption, questionNumber, total, onSelect }) {
  if (!question) return null;

  return (
    <div className="interview-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <span className="badge interview-accent-border bg-transparent interview-topic-pill text-info">{question.topic}</span>
        <small className="interview-text-muted">
          Question {questionNumber} of {total}
        </small>
      </div>
      <h2 className="h5 lh-base mb-4">{question.question}</h2>
      <div className="list-group list-group-radio">
        {(question.options || []).map((opt, idx) => {
          const active = selectedOption === idx;
          return (
            <label
              key={idx}
              className={`list-group-item border rounded-3 mb-2 d-flex gap-3 align-items-center interview-card-muted ${
                active ? "interview-accent-border shadow-sm text-light" : "border-secondary border-opacity-25"
              }`}
              style={{ cursor: "pointer" }}
            >
              <input
                className="form-check-input mt-0 flex-shrink-0"
                type="radio"
                name={`q-opt-${question.id}`}
                checked={active}
                onChange={() => onSelect(idx)}
              />
              <span className="flex-grow-1">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

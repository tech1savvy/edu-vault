import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Heading() {
  const { heading } = useContext(ResumeContext);

  if (!heading || Object.keys(heading).length === 0) {
    return (
      <p className="m-3 text-danger">
        No Heading Data Found. Please fill the form first.
      </p>
    );
  }

  return (
    <div className="container mt-4 p-3 border rounded shadow">
      <h2 className="fw-bold">{heading.fullName}</h2>
      <p>{heading.contact}</p>

      <div className="d-flex gap-3 mb-2">
        {heading.linkedin && (
          <a href={heading.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {heading.github && (
          <a href={heading.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {heading.portfolio && (
          <a href={heading.portfolio} target="_blank" rel="noreferrer">
            Portfolio
          </a>
        )}
      </div>

      <h5 className="text-muted">{heading.title}</h5>
      <p>{heading.description}</p>
    </div>
  );
}

export default Heading;

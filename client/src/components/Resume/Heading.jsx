import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Heading() {
  const { headingData } = useContext(ResumeContext);

  if (!headingData) {
    return (
      <p className="m-3 text-danger">
        No Heading Data Found. Please fill the form first.
      </p>
    );
  }

  return (
    <div className="container mt-4 p-3 border rounded shadow">
      <h2 className="fw-bold">{headingData.fullName}</h2>
      <p>{headingData.contact}</p>

      <div className="d-flex gap-3 mb-2">
        {headingData.linkedin && (
          <a href={headingData.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {headingData.github && (
          <a href={headingData.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {headingData.portfolio && (
          <a href={headingData.portfolio} target="_blank" rel="noreferrer">
            Portfolio
          </a>
        )}
      </div>

      <h5 className="text-muted">{headingData.title}</h5>
      <p>{headingData.description}</p>
    </div>
  );
}

export default Heading;

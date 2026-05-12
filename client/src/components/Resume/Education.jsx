import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Education() {
  const { educationData } = useContext(ResumeContext);

  if (!educationData || educationData.length === 0) {
    return (
      <p className="m-3 text-danger">
        No Education Data Found. Please fill the form first.
      </p>
    );
  }

  return (
    <div className="container mt-4 rounded border border-slate-200 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
      <h4 className="fw-bold">Education</h4>
      {educationData.map((edu, index) => (
        <div key={index} className="mb-3">
          <p className="fw-bold">{edu.degree}</p>
          <p>
            {edu.college}, {edu.location}
          </p>
          <p>
            {edu.startDate} - {edu.endDate || "Present"}
          </p>
          <p>Score: {edu.score}</p>
        </div>
      ))}
    </div>
  );
}

export default Education;

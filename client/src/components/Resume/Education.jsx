import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext.jsx";

function Education() {
  const { education } = useContext(ResumeContext);

  if (!education || education.length === 0) {
    return <p className="text-red-400 p-3">No Education Data Found. Please fill the form first.</p>;
  }

  return (
    <div className="theme-card p-3">
      <h4 className="font-bold text-gray-100 mb-3">Education</h4>
      {education.map((edu, index) => (
        <div key={index} className="mb-3 text-gray-200 text-sm">
          <p className="font-semibold">{edu.degree}</p>
          <p className="text-gray-400">{edu.college}, {edu.location}</p>
          <p className="text-gray-400">{edu.startDate} - {edu.endDate || "Present"}</p>
          <p>Score: {edu.score}</p>
        </div>
      ))}
    </div>
  );
}

export default Education;

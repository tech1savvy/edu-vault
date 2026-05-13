import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Heading() {
  const { heading } = useContext(ResumeContext);

  if (!heading || Object.keys(heading).length === 0) {
    return <p className="text-red-400 p-3">No Heading Data Found. Please fill the form first.</p>;
  }

  return (
    <div className="theme-card p-3">
      <h2 className="font-bold text-gray-100">{heading.name}</h2>
      <p className="text-gray-300">{heading.contact}</p>

      <div className="flex gap-3 mb-2">
        {heading.linkedin && <a href={heading.linkedin} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">LinkedIn</a>}
        {heading.github && <a href={heading.github} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">GitHub</a>}
        {heading.website && <a href={heading.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm">Portfolio</a>}
      </div>

      <h5 className="text-gray-400 text-sm">{heading.title}</h5>
      <p className="text-gray-200 text-sm">{heading.summary}</p>
    </div>
  );
}

export default Heading;

import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext";

function Certifications() {
  const { certifications } = useContext(ResumeContext);

  return (
    <div className="theme-card p-3">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">Certifications</h2>
      {certifications.length === 0 ? (
        <p className="text-gray-400 text-sm">No certifications added yet.</p>
      ) : (
        <ul className="list-none p-0 space-y-3">
          {certifications.map((certification, idx) => (
            <li key={idx} className="text-gray-200 text-sm">
              <strong className="block text-gray-100">{certification.name}</strong>
              {certification.issuer && <span className="text-gray-400">{certification.issuer}</span>}
              {certification.date && <span className="text-gray-400"> &bull; {certification.date}</span>}
              {certification.credentialId && <div><small className="text-gray-400">Credential ID: {certification.credentialId}</small></div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Certifications;

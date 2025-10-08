import { useContext } from "react";
import { ResumeContext } from "../../context/resumeContext.jsx";

function Certifications() {
  const { certifications } = useContext(ResumeContext);

  return (
    <div className="container">
      <h2 className="mb-3">Certifications</h2>
      {certifications.length === 0 ? (
        <p>No certifications added yet.</p>
      ) : (
        <ul className="list-unstyled">
          {certifications.map((certification, idx) => (
            <li key={idx} className="mb-3">
              <strong className="d-block">{certification.name}</strong>
              {certification.issuer && (
                <span className="text-muted">{certification.issuer}</span>
              )}
              {certification.date && (
                <span className="text-muted"> • {certification.date}</span>
              )}
              {certification.credentialId && (
                <div>
                  <small className="text-muted">Credential ID: {certification.credentialId}</small>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Certifications;
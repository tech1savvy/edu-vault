import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext.jsx";

function CertificationsForm() {
  const { certifications, setCertifications } = useContext(ResumeContext);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    date: "",
    credentialId: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (form.name.trim()) {
      setCertifications([...certifications, form]);
      setForm({
        name: "",
        issuer: "",
        date: "",
        credentialId: ""
      });
    }
  };

  const handleRemove = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };

  return (
    <div className="container">
      <h2 className="mb-3">Certifications Section</h2>
      <p className="text-muted">Add your professional certifications and courses</p>

      <div className="mb-3">
        <label className="form-label">Certification Name*</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g., Cloud Computing | NYTEL"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Issuing Organization</label>
        <input
          type="text"
          className="form-control"
          name="issuer"
          value={form.issuer}
          onChange={handleChange}
          placeholder="e.g., GeeksforGeeks, Udemy"
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Issue Date</label>
            <input
              type="text"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="e.g., 2024"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Credential ID (Optional)</label>
            <input
              type="text"
              className="form-control"
              name="credentialId"
              value={form.credentialId}
              onChange={handleChange}
              placeholder="Credential ID or URL"
            />
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleAdd}>
        Add Certification
      </button>

      <hr />

      <h4>Preview</h4>
      {certifications.length === 0 && <p>No certifications added yet.</p>}
      <ul className="list-group">
        {certifications.map((certification, idx) => (
          <li key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{certification.name}</strong>
                {certification.issuer && (
                  <span className="text-muted"> | {certification.issuer}</span>
                )}
                {certification.date && (
                  <div>
                    <small className="text-muted">{certification.date}</small>
                  </div>
                )}
                {certification.credentialId && (
                  <div>
                    <small className="text-muted">Credential ID: {certification.credentialId}</small>
                  </div>
                )}
              </div>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleRemove(idx)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CertificationsForm;
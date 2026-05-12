import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";
import { addCertification, updateCertification, deleteCertification } from "../../../services/api";

function CertificationsForm({ embedded = false }) {
  const { certifications, setCertifications } = useContext(ResumeContext);

  const [form, setForm] = useState({
    name: "",
    issuer: "",
    date: "",
    credentialId: ""
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (editingId) {
        const updated = await updateCertification(editingId, form);
        setCertifications(certifications.map((c) => (c.id === editingId ? updated : c)));
        setEditingId(null);
      } else {
        const created = await addCertification(form);
        setCertifications([...certifications, created]);
      }
      setForm({
        name: "",
        issuer: "",
        date: "",
        credentialId: ""
      });
    } catch (error) {
      console.error("Failed to save certification:", error);
    }
  };

  const handleEdit = (cert) => {
    setForm({
      name: cert.name,
      issuer: cert.issuer || "",
      date: cert.date || "",
      credentialId: cert.credentialId || ""
    });
    setEditingId(cert.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCertification(id);
      setCertifications(certifications.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete certification:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      name: "",
      issuer: "",
      date: "",
      credentialId: ""
    });
  };

  return (
    <div className={embedded ? "" : "container mt-3"}>
      {!embedded && (
        <>
          <h2 className="mb-3">Certifications Section</h2>
          <p className="text-muted">Add your professional certifications and courses</p>
        </>
      )}

      <div className="card p-3 mb-4">
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

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            {editingId ? "Update Certification" : "Add Certification"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {!embedded && <hr />}

      {!embedded && <h4>Saved Certifications</h4>}
      {embedded && <h4 className="mb-3 mt-4">Saved certifications</h4>}
      {certifications.length === 0 && <p className="text-muted">No certifications added yet.</p>}
      <div className="list-group">
        {certifications.map((certification) => (
          <div key={certification.id} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between align-items-start">
              <div className="w-75">
                <h5 className="mb-1">{certification.name}</h5>
                {certification.issuer && (
                  <p className="mb-1 text-muted">{certification.issuer}</p>
                )}
                <div className="d-flex gap-3">
                  {certification.date && (
                    <small className="text-secondary">Issued: {certification.date}</small>
                  )}
                  {certification.credentialId && (
                    <small className="text-secondary">ID: {certification.credentialId}</small>
                  )}
                </div>
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(certification)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(certification.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificationsForm;

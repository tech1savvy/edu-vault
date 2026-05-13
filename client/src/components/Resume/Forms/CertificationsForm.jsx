import { useState, useContext } from "react";
import { ResumeContext } from "../../../context/resumeContext";

function CertificationsForm() {
  const { certifications, setCertifications } = useContext(ResumeContext);

  const [editIndex, setEditIndex] = useState(null);

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
      if (editIndex !== null) {
        const updatedCertifications = [...certifications];
        updatedCertifications[editIndex] = form;
        setCertifications(updatedCertifications);
        setEditIndex(null);
      } else {
        setCertifications([...certifications, form]);
      }
      setForm({ name: "", issuer: "", date: "", credentialId: "" });
    }
  };

  const handleRemove = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const inputClass = "w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Certification Name*</label>
        <input type="text" className={inputClass} name="name" value={form.name} onChange={handleChange} placeholder="e.g., Cloud Computing | NYTEL" />
      </div>

      <div>
        <label className={labelClass}>Issuing Organization</label>
        <input type="text" className={inputClass} name="issuer" value={form.issuer} onChange={handleChange} placeholder="e.g., GeeksforGeeks, Udemy" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Issue Date</label>
          <input type="text" className={inputClass} name="date" value={form.date} onChange={handleChange} placeholder="e.g., 2024" />
        </div>
        <div>
          <label className={labelClass}>Credential ID (Optional)</label>
          <input type="text" className={inputClass} name="credentialId" value={form.credentialId} onChange={handleChange} placeholder="Credential ID or URL" />
        </div>
      </div>

      <div className="flex gap-2">
        <button className={editIndex !== null ? "theme-btn theme-btn-success" : "theme-btn theme-btn-primary"} onClick={handleAdd}>
          {editIndex !== null ? "Update Certification" : "Add Certification"}
        </button>
        {editIndex !== null && (
          <button className="theme-btn border border-gray-500 text-gray-300 hover:bg-gray-700" onClick={() => {
            setEditIndex(null);
            setForm({ name: "", issuer: "", date: "", credentialId: "" });
          }}>
            Cancel
          </button>
        )}
      </div>

      <hr className="border-gray-700/50 my-4" />

      <h4 className="text-base font-semibold text-gray-100">Preview</h4>
      {certifications.length === 0 && <p className="text-gray-400">No certifications added yet.</p>}
      <ul className="space-y-2">
        {certifications.map((certification, idx) => (
          <li key={idx} className="theme-card p-3">
            <div className="flex justify-between items-start">
              <div className="text-gray-200 text-sm">
                <strong>{certification.name}</strong>
                {certification.issuer && <span className="text-gray-400"> | {certification.issuer}</span>}
                {certification.date && <div><small className="text-gray-400">{certification.date}</small></div>}
                {certification.credentialId && <div><small className="text-gray-400">Credential ID: {certification.credentialId}</small></div>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs py-1 px-2"
                  onClick={() => { setForm(certification); setEditIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Edit
                </button>
                <button className="theme-btn border border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs py-1 px-2"
                  onClick={() => handleRemove(idx)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CertificationsForm;

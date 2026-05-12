import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";
import { ResumeContext } from "../context/resumeContext";
import { AuthContext } from "../context/AuthContext";
import { createOrUpdateHeading } from "../services/api";

const ProfilePage = () => {
  const { heading, setHeading, resumeLoading, resumeLoadedOnce } = useContext(ResumeContext);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    link: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const h = heading && typeof heading === "object" ? heading : {};
    setFormData({
      name: h.name ?? user?.name ?? "",
      role: h.role ?? "",
      email: h.email ?? user?.email ?? "",
      phone: h.phone ?? "",
      location: h.location ?? "",
      link: h.link ?? "",
      description: h.description ?? "",
    });
  }, [heading, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await createOrUpdateHeading(formData);
      setHeading(updated);
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const initial = (formData.name || user?.name || "?").trim().charAt(0).toUpperCase() || "?";

  if (resumeLoading && !resumeLoadedOnce) {
    return (
      <Card title="Profile" subtitle="Loading your saved data from the server…">
        <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-600 dark:text-slate-300">
          Loading…
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Profile"
      subtitle="Data comes from your saved heading after login. Edit and save to update your resume and portfolio."
    >
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-600">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-4xl font-bold text-white shadow-md"
            aria-hidden
          >
            {initial}
          </div>
          <p className="text-center text-xs text-slate-600 dark:text-slate-300">
            Avatar image is not stored yet; we show your initial from your name.
          </p>
        </div>
        <div className="space-y-4">
          <FormInput
            label="Full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            label="Professional role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Full stack developer"
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <FormInput
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, country"
          />
          <FormInput
            label="Portfolio or main link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://…"
          />
          <FormInput
            as="textarea"
            rows={5}
            label="Summary / about"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ProfilePage;

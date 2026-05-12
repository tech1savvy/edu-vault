import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";
import { AuthContext } from "../context/AuthContext";
import { ResumeContext } from "../context/resumeContext";
import { createOrUpdateHeading } from "../services/api";

const AboutPage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { heading, setHeading, resumeLoading, resumeLoadedOnce } = useContext(ResumeContext);
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const h = heading && typeof heading === "object" ? heading : {};
    setDescription(h.description ?? "");
    setRole(h.role ?? "");
  }, [heading]);

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || user?.role !== "student") {
      toast.error("Sign in as a student to save your about section.");
      return;
    }
    const h = heading && typeof heading === "object" ? heading : {};
    try {
      setSaving(true);
      const payload = {
        name: h.name || user?.name || "",
        role: role || h.role || "",
        email: h.email || user?.email || "",
        phone: h.phone || "",
        location: h.location || "",
        link: h.link || "",
        description,
      };
      const updated = await createOrUpdateHeading(payload);
      setHeading(updated);
      toast.success("About section saved");
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Card
        title="About EduVault"
        subtitle="A focused toolkit to present your academic and professional growth."
      >
        <p className="mb-4 text-slate-700 dark:text-slate-300">
          EduVault helps students and early professionals organize education history, projects, achievements, and
          certifications into a clear resume and portfolio workflow.
        </p>
        <p className="mb-8 text-slate-700 dark:text-slate-300">
          The platform is designed for speed, clarity, and modular growth so your profile can evolve as your career
          advances.
        </p>

        {isLoggedIn && user?.role === "student" && (
          <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Your public summary</h3>
            <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">
              Pulled from your resume heading after login. Edit and save—same data as Dashboard → Profile.
            </p>
            {resumeLoading && !resumeLoadedOnce ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">Loading your saved data…</p>
            ) : (
              <form onSubmit={handleSaveAbout} className="space-y-4">
                <FormInput
                  label="Professional role (headline)"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Computer Science student"
                />
                <FormInput
                  as="textarea"
                  rows={6}
                  label="About you"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short bio, goals, interests…"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save about section"}
                </button>
              </form>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AboutPage;

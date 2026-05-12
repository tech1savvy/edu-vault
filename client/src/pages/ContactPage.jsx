import { useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";
import { AuthContext } from "../context/AuthContext";
import { ResumeContext } from "../context/resumeContext";

const ContactPage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { heading, resumeLoading, resumeLoadedOnce } = useContext(ResumeContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const h = heading && typeof heading === "object" ? heading : {};
    setForm((prev) => ({
      ...prev,
      name: prev.name || user?.name || h.name || "",
      email: prev.email || user?.email || h.email || "",
      phone: prev.phone || h.phone || "",
    }));
  }, [heading, user, isLoggedIn, resumeLoadedOnce]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message drafted. Backend hookup can be added next.");
    setForm((prev) => ({ ...prev, message: "" }));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Card
        title="Contact Us"
        subtitle={
          isLoggedIn
            ? "Your name, email, and phone are filled from your account and resume heading when available."
            : "Share your question and we will get back soon."
        }
      >
        {isLoggedIn && resumeLoading && !resumeLoadedOnce && (
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">Loading your contact details…</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Name" name="name" value={form.name} onChange={handleChange} required />
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormInput
            label="Phone (from your profile when saved)"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Optional"
          />
          <FormInput
            as="textarea"
            label="Message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Send Message
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ContactPage;

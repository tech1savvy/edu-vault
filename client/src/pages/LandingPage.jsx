import { Link } from "react-router-dom";
import Card from "../components/ui/Card";

const features = [
  "Build ATS-friendly resumes quickly",
  "Showcase portfolio with multiple layouts",
  "Track achievements, projects, and certifications",
];

const LandingPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-lg sm:p-12">
        <h1 className="text-3xl font-bold sm:text-5xl">Build Your Career Story with EduVault</h1>
        <p className="mt-4 max-w-2xl text-white/95">
          Create polished resumes, portfolio pages, and professional profiles in one modern workspace.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/signup" className="rounded-xl bg-white px-5 py-2.5 font-semibold text-indigo-700 transition hover:-translate-y-0.5">
            Get Started
          </Link>
          <Link to="/login" className="rounded-xl border border-white/70 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
            Login
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature} className="h-full">
            <p className="text-slate-800 dark:text-slate-200">{feature}</p>
          </Card>
        ))}
      </section>

      <footer className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
        {new Date().getFullYear()} EduVault. Designed for ambitious learners.
      </footer>
    </div>
  );
};

export default LandingPage;

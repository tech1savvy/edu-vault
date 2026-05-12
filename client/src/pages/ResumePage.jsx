import { useContext, useCallback, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/ui/Card";
import { ResumeContext } from "../context/resumeContext";
import { GeneralResumeTemplate } from "../components/Resume/templates/GeneralResumeTemplate";
import { SpecialisedResumeTemplate } from "../components/Resume/templates/SpecialisedResumeTemplate";
import "../components/Resume/templates/resumePrint.css";

const TEMPLATE_STORAGE_KEY = "eduvault_resume_template";

const tabClass = (active) =>
  `rounded-xl px-4 py-2 text-sm font-medium transition ${
    active
      ? "bg-indigo-600 text-white"
      : "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
  }`;

const ResumePage = () => {
  const {
    heading,
    experiences,
    education,
    projects,
    skills,
    certifications,
    achievements,
  } = useContext(ResumeContext);

  const [template, setTemplate] = useState(() => {
    try {
      const v = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      return v === "specialised" ? "specialised" : "general";
    } catch {
      return "general";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
    } catch {
      /* ignore */
    }
  }, [template]);

  const handleDownloadPdf = useCallback(() => {
    document.body.classList.add("printing-resume");
    const onAfterPrint = () => {
      document.body.classList.remove("printing-resume");
      window.removeEventListener("afterprint", onAfterPrint);
    };
    window.addEventListener("afterprint", onAfterPrint);
    setTimeout(() => {
      window.print();
    }, 100);
    toast.success('Use your browser’s print dialog and choose "Save as PDF".', { duration: 4000 });
  }, []);

  const resumeProps = {
    heading,
    experiences,
    education,
    projects,
    skills,
    certifications,
    achievements,
  };

  return (
    <Card
      className="dashboard-resume-card"
      title="Resume (CV)"
      subtitle="Choose a template, then download as PDF. Same data as your portfolio."
    >
      <div className="resume-no-print mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Template:</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={tabClass(template === "general")} onClick={() => setTemplate("general")}>
            General resume
          </button>
          <button
            type="button"
            className={tabClass(template === "specialised")}
            onClick={() => setTemplate("specialised")}
          >
            Specialised resume
          </button>
        </div>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="ml-auto rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
        >
          Download PDF
        </button>
      </div>

      <p className="resume-no-print mb-4 text-xs text-slate-600 dark:text-slate-300">
        <strong>General</strong> — traditional single-column CV, good for most employers.{" "}
        <strong>Specialised</strong> — highlights skills, projects, and certifications (e.g. tech / research roles).
      </p>

      <div className="resume-print-shell max-w-4xl rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-white dark:text-slate-900">
        {template === "general" ? (
          <GeneralResumeTemplate {...resumeProps} />
        ) : (
          <SpecialisedResumeTemplate {...resumeProps} />
        )}
      </div>
    </Card>
  );
};

export default ResumePage;

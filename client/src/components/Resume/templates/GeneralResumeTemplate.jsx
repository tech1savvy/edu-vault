/**
 * General / ATS-friendly: single column, all sections in conventional order.
 */
export function GeneralResumeTemplate({
  heading,
  experiences,
  education,
  projects,
  skills,
  certifications,
  achievements,
}) {
  const h = heading && typeof heading === "object" ? heading : {};

  return (
    <div className="resume-print-root space-y-6 text-slate-900">
      <header className="border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{h.name || "Your name"}</h1>
        {h.role && <p className="mt-1 text-base font-medium text-indigo-700">{h.role}</p>}
        <p className="mt-2 text-sm text-slate-600">
          {[h.email, h.phone, h.location].filter(Boolean).join(" · ")}
        </p>
        {h.link && (
          <p className="mt-1 text-sm text-slate-600 break-all">{h.link}</p>
        )}
        {h.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{h.description}</p>
        )}
      </header>

      {experiences?.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Experience
          </h2>
          <ul className="space-y-3">
            {experiences.map((exp) => (
              <li key={exp.id} className="text-sm">
                <div className="flex flex-wrap justify-between gap-2 font-semibold text-slate-900">
                  <span>{exp.role}</span>
                  <span className="font-normal text-slate-600">{exp.duration}</span>
                </div>
                <p className="text-slate-700">{exp.company}</p>
                {exp.details && <p className="mt-1 text-slate-600 whitespace-pre-wrap">{exp.details}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {education?.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Education
          </h2>
          <ul className="space-y-2">
            {education.map((edu) => (
              <li key={edu.id} className="text-sm">
                <p className="font-semibold text-slate-900">
                  {edu.degree}
                  {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                </p>
                <p className="text-slate-700">{edu.institution}</p>
                {edu.duration && <p className="text-xs text-slate-600">{edu.duration}</p>}
                {edu.details && <p className="mt-1 text-slate-600 whitespace-pre-wrap">{edu.details}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects?.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Projects
          </h2>
          <ul className="space-y-2">
            {projects.map((p) => (
              <li key={p.id} className="text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-semibold text-slate-900">{p.title}</span>
                  {p.type && <span className="text-xs text-slate-600">{p.type}</span>}
                </div>
                {p.description && <p className="mt-1 text-slate-600 whitespace-pre-wrap">{p.description}</p>}
                {(p.techStack || p.timeline) && (
                  <p className="mt-1 text-xs text-slate-600">
                    {[p.techStack && `Tech: ${p.techStack}`, p.timeline].filter(Boolean).join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills?.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Skills
          </h2>
          <p className="text-sm text-slate-700">
            {skills.map((s) => `${s.name}${s.level ? ` (${s.level})` : ""}`).join(" · ")}
          </p>
        </section>
      )}

      {certifications?.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Certifications
          </h2>
          <ul className="space-y-1 text-sm text-slate-700">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className="font-medium text-slate-900">{c.name}</span>
                {c.issuer && ` — ${c.issuer}`}
                {c.date && ` (${c.date})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {achievements?.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            Achievements
          </h2>
          <ul className="space-y-1 text-sm text-slate-700">
            {achievements.map((a) => (
              <li key={a.id}>
                <span className="font-medium text-slate-900">{a.title}</span>
                {a.date && ` — ${a.date}`}
                {a.description && (
                  <span className="block text-slate-600 whitespace-pre-wrap">{a.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

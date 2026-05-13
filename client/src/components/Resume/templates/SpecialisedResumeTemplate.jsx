/**
 * Specialised / role-focused: highlights skills, projects, and credentials; compact experience.
 */
export function SpecialisedResumeTemplate({
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
    <div className="resume-print-root text-slate-900">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-2 border-indigo-600 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{h.name || "Your name"}</h1>
          {h.role && <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">{h.role}</p>}
        </div>
        <div className="text-right text-xs text-slate-600">
          {[h.email, h.phone].filter(Boolean).map((line) => (
            <div key={line}>{line}</div>
          ))}
          {h.location && <div>{h.location}</div>}
          {h.link && <div className="max-w-xs break-all">{h.link}</div>}
        </div>
      </header>

      {h.description && (
        <section className="mb-5 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap print:bg-transparent print:px-0">
          {h.description}
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-5 print:grid-cols-5">
        <div className="md:col-span-2 print:col-span-2">
          {skills?.length > 0 && (
            <section className="mb-5">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">Core skills</h2>
              <ul className="space-y-1.5 text-sm">
                {skills.map((s) => (
                  <li key={s.id} className="flex justify-between gap-2 border-b border-slate-100 pb-1">
                    <span className="font-medium text-slate-900">{s.name}</span>
                    {s.level && <span className="text-slate-600">{s.level}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {certifications?.length > 0 && (
            <section className="mb-5">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">Certifications</h2>
              <ul className="space-y-2 text-xs text-slate-700">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p>{[c.issuer, c.date].filter(Boolean).join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {education?.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">Education</h2>
              <ul className="space-y-2 text-xs">
                {education.map((edu) => (
                  <li key={edu.id}>
                    <p className="font-semibold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.institution}</p>
                    {edu.fieldOfStudy && <p className="text-slate-600">{edu.fieldOfStudy}</p>}
                    {edu.duration && <p className="text-slate-600">{edu.duration}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="md:col-span-3 print:col-span-3">
          {projects?.length > 0 && (
            <section className="mb-5">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">Key projects</h2>
              <ul className="space-y-3 text-sm">
                {projects.map((p) => (
                  <li key={p.id} className="border-l-2 border-indigo-200 pl-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-slate-900">{p.title}</span>
                      {p.type && <span className="text-xs text-slate-600">{p.type}</span>}
                    </div>
                    {p.techStack && (
                      <p className="mt-0.5 text-xs font-medium text-indigo-800">{p.techStack}</p>
                    )}
                    {p.description && (
                      <p className="mt-1 text-slate-600 whitespace-pre-wrap">{p.description}</p>
                    )}
                    {p.timeline && <p className="mt-1 text-xs text-slate-600">{p.timeline}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {experiences?.length > 0 && (
            <section className="mb-5">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">Experience</h2>
              <ul className="space-y-2 text-sm">
                {experiences.map((exp) => (
                  <li key={exp.id}>
                    <div className="flex flex-wrap justify-between gap-1 font-semibold text-slate-900">
                      <span>
                        {exp.role} — {exp.company}
                      </span>
                      <span className="font-normal text-xs text-slate-600">{exp.duration}</span>
                    </div>
                    {exp.details && (
                      <p className="mt-0.5 text-xs text-slate-600 whitespace-pre-wrap">{exp.details}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {achievements?.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">Achievements</h2>
              <ul className="space-y-1 text-xs text-slate-700">
                {achievements.map((a) => (
                  <li key={a.id}>
                    <span className="font-semibold text-slate-900">{a.title}</span>
                    {a.date && ` (${a.date})`}
                    {a.description && ` — ${a.description}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

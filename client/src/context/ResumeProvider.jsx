import { useState, useEffect } from "react";
import { ResumeContext } from "./resumeContext";

// Helper to keep state synced with localStorage
function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function ResumeProvider({ children }) {
  const [heading, setHeading] = useStickyState({}, "resume_heading");
  const [education, setEducation] = useStickyState([], "resume_education");
  const [experiences, setExperiences] = useStickyState([], "resume_experiences");
  const [projects, setProjects] = useStickyState([], "resume_projects");
  const [skills, setSkills] = useStickyState([], "resume_skills");
  const [achievements, setAchievements] = useStickyState([], "resume_achievements");
  const [certifications, setCertifications] = useStickyState([], "resume_certifications");

  return (
    <ResumeContext.Provider
      value={{
        heading,
        setHeading,
        education,
        setEducation,
        experiences,
        setExperiences,
        projects,
        setProjects,
        skills,
        setSkills,
        achievements,
        setAchievements,
        certifications,
        setCertifications,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

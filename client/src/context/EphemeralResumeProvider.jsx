import { useMemo } from "react";
import { ResumeContext } from "./resumeContext";

const noop = () => {};
const asyncNoop = async () => {};

/**
 * Supplies resume data for public portfolio views (no auth) without touching global provider state.
 */
export function EphemeralResumeProvider({ data, children }) {
  const value = useMemo(() => {
    const d = data || {};
    return {
      heading: d.heading && typeof d.heading === "object" ? d.heading : {},
      education: Array.isArray(d.education) ? d.education : [],
      experiences: Array.isArray(d.experiences) ? d.experiences : [],
      projects: Array.isArray(d.projects) ? d.projects : [],
      skills: Array.isArray(d.skills) ? d.skills : [],
      achievements: Array.isArray(d.achievements) ? d.achievements : [],
      certifications: Array.isArray(d.certifications) ? d.certifications : [],
      setHeading: noop,
      setEducation: noop,
      setExperiences: noop,
      setProjects: noop,
      setSkills: noop,
      setAchievements: noop,
      setCertifications: noop,
      refreshResume: asyncNoop,
      clearResume: noop,
      resumeLoading: false,
      resumeLoadedOnce: true,
    };
  }, [data]);

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

import { useState, useEffect, useCallback, useContext } from "react";
import { ResumeContext } from "./resumeContext";
import { AuthContext } from "./AuthContext";
import * as api from "../services/api";

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
  const { token } = useContext(AuthContext);

  const [heading, setHeading] = useStickyState({}, "resume_heading");
  const [education, setEducation] = useStickyState([], "resume_education");
  const [experiences, setExperiences] = useStickyState([], "resume_experiences");
  const [projects, setProjects] = useStickyState([], "resume_projects");
  const [skills, setSkills] = useStickyState([], "resume_skills");
  const [achievements, setAchievements] = useStickyState([], "resume_achievements");
  const [certifications, setCertifications] = useStickyState([], "resume_certifications");

  const [resumeLoading, setResumeLoading] = useState(true);
  const [resumeLoadedOnce, setResumeLoadedOnce] = useState(false);

  // Load from DB on mount or when token changes
  useEffect(() => {
    const loadFromDb = async () => {
      if (!token) {
        setResumeLoading(false);
        setResumeLoadedOnce(true);
        return;
      }
      try {
        setResumeLoading(true);
        const data = await api.getResumeAll();
        if (data) {
          if (data.heading && Object.keys(data.heading).length > 0) setHeading(data.heading);
          if (data.skills && data.skills.length > 0) setSkills(data.skills);
          if (data.projects && data.projects.length > 0) setProjects(data.projects);
          if (data.education && data.education.length > 0) setEducation(data.education);
          if (data.experiences && data.experiences.length > 0) setExperiences(data.experiences);
          if (data.certifications && data.certifications.length > 0) setCertifications(data.certifications);
          if (data.achievements && data.achievements.length > 0) setAchievements(data.achievements);
        }
      } catch (err) {
        console.error("Failed to load resume from DB:", err);
      } finally {
        setResumeLoadedOnce(true);
        setResumeLoading(false);
      }
    };
    loadFromDb();
  }, [token]);

  const refreshResume = useCallback(async () => {
    if (!token) return;
    setResumeLoading(true);
    try {
      const data = await api.getResumeAll();
      if (data) {
        if (data.heading && Object.keys(data.heading).length > 0) setHeading(data.heading);
        if (data.skills && data.skills.length > 0) setSkills(data.skills);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.education && data.education.length > 0) setEducation(data.education);
        if (data.experiences && data.experiences.length > 0) setExperiences(data.experiences);
        if (data.certifications && data.certifications.length > 0) setCertifications(data.certifications);
        if (data.achievements && data.achievements.length > 0) setAchievements(data.achievements);
      }
    } catch (err) {
      console.error("Failed to refresh resume:", err);
    } finally {
      setResumeLoading(false);
    }
  }, [token]);

  const clearResume = useCallback(() => {
    setHeading({});
    setEducation([]);
    setExperiences([]);
    setProjects([]);
    setSkills([]);
    setAchievements([]);
    setCertifications([]);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('resume_')) {
        localStorage.removeItem(key);
      }
    }
  }, [setHeading, setEducation, setExperiences, setProjects, setSkills, setAchievements, setCertifications]);

  const value = {
    heading, setHeading,
    education, setEducation,
    experiences, setExperiences,
    projects, setProjects,
    skills, setSkills,
    achievements, setAchievements,
    certifications, setCertifications,
    resumeLoading,
    resumeLoadedOnce,
    refreshResume,
    clearResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

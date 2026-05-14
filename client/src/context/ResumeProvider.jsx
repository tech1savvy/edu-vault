import { useState, useEffect, useCallback } from "react";
import { ResumeContext } from "./resumeContext";
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
  const [heading, setHeading] = useStickyState({}, "resume_heading");
  const [education, setEducation] = useStickyState([], "resume_education");
  const [experiences, setExperiences] = useStickyState([], "resume_experiences");
  const [projects, setProjects] = useStickyState([], "resume_projects");
  const [skills, setSkills] = useStickyState([], "resume_skills");
  const [achievements, setAchievements] = useStickyState([], "resume_achievements");
  const [certifications, setCertifications] = useStickyState([], "resume_certifications");

  const [resumeLoading, setResumeLoading] = useState(true);
  const [resumeLoadedOnce, setResumeLoadedOnce] = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced"); // 'synced', 'saving', 'error'

  // Load from DB on mount
  useEffect(() => {
    const loadFromDb = async () => {
      if (resumeLoadedOnce) return;
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
  }, [resumeLoadedOnce, setHeading, setSkills, setProjects, setEducation, setExperiences, setCertifications, setAchievements]);

  const syncToDB = useCallback(async () => {
    if (!resumeLoadedOnce) return;
    try {
      setSyncStatus("saving");
      
      if (heading && Object.keys(heading).length > 0) {
        await api.createOrUpdateHeading(heading);
      }

      await api.syncResumeProfile({
        skills,
        projects,
        certifications,
        experiences,
        education,
        achievements
      });
      
      setSyncStatus("synced");
    } catch (err) {
      console.error("Auto-sync failed:", err);
      setSyncStatus("error");
    }
  }, [heading, skills, projects, certifications, experiences, education, achievements, resumeLoadedOnce]);

  useEffect(() => {
    if (!resumeLoadedOnce) return;
    
    const hasData = Object.keys(heading).length > 0 || 
                    skills.length > 0 || 
                    projects.length > 0 || 
                    education.length > 0 || 
                    experiences.length > 0 || 
                    certifications.length > 0 || 
                    achievements.length > 0;
    
    if (!hasData) return;

    const timeoutId = setTimeout(() => {
      syncToDB();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [skills, projects, certifications, experiences, education, achievements, heading, resumeLoadedOnce, syncToDB]);

  const clearResume = useCallback(() => {
    setHeading({});
    setEducation([]);
    setExperiences([]);
    setProjects([]);
    setSkills([]);
    setAchievements([]);
    setCertifications([]);
    window.localStorage.clear();
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
    syncStatus,
    clearResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
      {/* Global Sync Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        background: syncStatus === 'synced' ? 'rgba(74, 222, 128, 0.2)' : 
                    syncStatus === 'saving' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(248, 113, 113, 0.2)',
        color: syncStatus === 'synced' ? '#4ade80' : 
               syncStatus === 'saving' ? '#facc15' : '#f87171',
        border: `1px solid ${syncStatus === 'synced' ? '#4ade80' : syncStatus === 'saving' ? '#facc15' : '#f87171'}`,
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: syncStatus === 'synced' ? '#4ade80' : syncStatus === 'saving' ? '#facc15' : '#f87171',
          animation: syncStatus === 'saving' ? 'pulse 1.5s infinite' : 'none'
        }} />
        {syncStatus === 'synced' ? 'All changes saved' : 
         syncStatus === 'saving' ? 'Saving changes...' : 'Sync failed'}
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </ResumeContext.Provider>
  );
}

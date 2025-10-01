import { createContext, useState } from "react";

export const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [heading, setHeading] = useState({});
  const [education, setEducation] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);

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

import { createContext, useState, useEffect } from "react";

export const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [heading, setHeading] = useState({});
  const [education, setEducation] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/resume/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        const data = await response.json();
        setHeading(data.headingData || {});
        setEducation(data.educationData || []);
        setExperiences(data.experiencesData || []);
        setProjects(data.projectsData || []);
        setSkills(data.skillsData || []);
        setAchievements(data.achievementsData || []);
        setCertifications(data.certificationsData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

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
        loading,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

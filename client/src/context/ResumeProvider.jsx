import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { ResumeContext } from "./resumeContext";
import axiosInstance from "../services/axiosInstance";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const mergeHeadingWithUser = (headingPayload, user) => {
  const h =
    headingPayload && typeof headingPayload === "object" && !Array.isArray(headingPayload)
      ? { ...headingPayload }
      : {};
  if (!user) return h;
  return {
    ...h,
    name: h.name || user.name || "",
    email: h.email || user.email || "",
  };
};

const asArray = (v) => (Array.isArray(v) ? v : []);

export function ResumeProvider({ children }) {
  const [heading, setHeading] = useState(null);
  const [education, setEducation] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeLoadedOnce, setResumeLoadedOnce] = useState(false);

  const refreshResume = useCallback(async (manualToken = null) => {
    setResumeLoading(true);
    try {
      const config = manualToken
        ? { headers: { Authorization: `Bearer ${manualToken}` } }
        : {};

      const response = await axiosInstance.get("/resume/all", config);
      const data = response.data || {};
      const user = readStoredUser();

      setHeading(mergeHeadingWithUser(data.heading, user));
      setEducation(asArray(data.education));
      setExperiences(asArray(data.experiences));
      setProjects(asArray(data.projects));
      setSkills(asArray(data.skills));
      setAchievements(asArray(data.achievements));
      setCertifications(asArray(data.certifications));
      setResumeLoadedOnce(true);
    } catch (error) {
      console.error("Failed to refresh resume data:", error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Could not load your saved profile. Check that the API is running and you are logged in.";
      toast.error(msg);
      const user = readStoredUser();
      setHeading(mergeHeadingWithUser({}, user));
      setEducation([]);
      setExperiences([]);
      setProjects([]);
      setSkills([]);
      setAchievements([]);
      setCertifications([]);
      setResumeLoadedOnce(true);
    } finally {
      setResumeLoading(false);
    }
  }, []);

  const clearResume = useCallback(() => {
    setHeading(null);
    setEducation([]);
    setExperiences([]);
    setProjects([]);
    setSkills([]);
    setAchievements([]);
    setCertifications([]);
    setResumeLoadedOnce(false);
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
        refreshResume,
        clearResume,
        resumeLoading,
        resumeLoadedOnce,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

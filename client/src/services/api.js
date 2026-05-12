import axiosInstance from './axiosInstance';

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await axiosInstance.post('/auth/signup', { name, email, password });
  return response.data;
};

export const getResumeAll = async () => {
  const response = await axiosInstance.get('/resume/all');
  return response.data;
};

/** Public portfolio JSON (no auth). Only works for student user ids. */
export const getPublicResume = async (userId) => {
  const response = await axiosInstance.get(`/public/students/${userId}/resume`);
  return response.data;
};

export const getHeading = async () => {
  const response = await axiosInstance.get('/resume/heading');
  return response.data;
};

export const createOrUpdateHeading = async (data) => {
  const response = await axiosInstance.post('/resume/heading', data);
  return response.data;
};

// Skills
export const getSkills = async () => {
  const response = await axiosInstance.get('/resume/skills');
  return response.data;
};

export const addSkill = async (data) => {
  const response = await axiosInstance.post('/resume/skills', data);
  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await axiosInstance.put(`/resume/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await axiosInstance.delete(`/resume/skills/${id}`);
  return response.data;
};

// Projects
export const getProjects = async () => {
  const response = await axiosInstance.get('/resume/projects');
  return response.data;
};

export const addProject = async (data) => {
  const response = await axiosInstance.post('/resume/projects', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axiosInstance.put(`/resume/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/resume/projects/${id}`);
  return response.data;
};

// Experiences
export const getExperience = async () => {
  const response = await axiosInstance.get('/resume/experiences');
  return response.data;
};

export const addExperience = async (data) => {
  const response = await axiosInstance.post('/resume/experiences', data);
  return response.data;
};

export const updateExperience = async (id, data) => {
  const response = await axiosInstance.put(`/resume/experiences/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await axiosInstance.delete(`/resume/experiences/${id}`);
  return response.data;
};

// Education
export const getEducation = async () => {
  const response = await axiosInstance.get('/resume/education');
  return response.data;
};

export const addEducation = async (data) => {
  const response = await axiosInstance.post('/resume/education', data);
  return response.data;
};

export const updateEducation = async (id, data) => {
  const response = await axiosInstance.put(`/resume/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id) => {
  const response = await axiosInstance.delete(`/resume/education/${id}`);
  return response.data;
};

// Achievements
export const getAchievements = async () => {
  const response = await axiosInstance.get('/resume/achievements');
  return response.data;
};

export const addAchievement = async (data) => {
  const response = await axiosInstance.post('/resume/achievements', data);
  return response.data;
};

export const updateAchievement = async (id, data) => {
  const response = await axiosInstance.put(`/resume/achievements/${id}`, data);
  return response.data;
};

export const deleteAchievement = async (id) => {
  const response = await axiosInstance.delete(`/resume/achievements/${id}`);
  return response.data;
};

// Certifications
export const getCertifications = async () => {
  const response = await axiosInstance.get('/resume/certifications');
  return response.data;
};

export const addCertification = async (data) => {
  const response = await axiosInstance.post('/resume/certifications', data);
  return response.data;
};

export const updateCertification = async (id, data) => {
  const response = await axiosInstance.put(`/resume/certifications/${id}`, data);
  return response.data;
};

export const deleteCertification = async (id) => {
  const response = await axiosInstance.delete(`/resume/certifications/${id}`);
  return response.data;
};

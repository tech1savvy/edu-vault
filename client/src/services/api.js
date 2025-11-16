const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const signup = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getHeading = async () => {
  const response = await fetch(`${API_URL}/resume/heading`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/resume/projects`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getSkills = async () => {
  const response = await fetch(`${API_URL}/resume/skills`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getExperience = async () => {
  const response = await fetch(`${API_URL}/resume/experiences`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getEducation = async () => {
  const response = await fetch(`${API_URL}/resume/education`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getAchievements = async () => {
  const response = await fetch(`${API_URL}/resume/achievements`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getCertifications = async () => {
  const response = await fetch(`${API_URL}/resume/certifications`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

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
    throw new Error(data.error || data.message || 'Something went wrong');
  }
};

export const signup = async (name, email, password, confirmPassword, role = 'student') => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, confirmPassword, role }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || data.message || 'Something went wrong');
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

export const syncResumeProfile = async (payload) => {
  const response = await fetch(`${API_URL}/resume/sync`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to sync profile');
  }
  return data;
};

// Mentor API Endpoints
export const getMentorStudents = async () => {
  const response = await fetch(`${API_URL}/mentor/students`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const getStudentDashboardData = async (studentId, targetRole = '') => {
  const url = targetRole 
     ? `${API_URL}/mentor/students/${studentId}?targetRole=${encodeURIComponent(targetRole)}`
     : `${API_URL}/mentor/students/${studentId}`;
     
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

export const addMentoringAction = async (studentId, taskName, deadline) => {
  const response = await fetch(`${API_URL}/mentor/actions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, taskName, deadline }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || data.message || 'Something went wrong');
  }
};

export const getMentoringTimeline = async (studentId) => {
  const response = await fetch(`${API_URL}/mentor/timeline/${studentId}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Something went wrong');
  }
};

// Student Dashboard APIs
export const getMyStudentDashboard = async () => {
    const response = await fetch(`${API_URL}/student-dashboard/me`, {
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Something went wrong');
    }
};

export const updateMentorActionStatus = async (actionId, status) => {
    const response = await fetch(`${API_URL}/student-dashboard/actions/${actionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.error || data.message || 'Something went wrong');
    }
};

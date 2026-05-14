const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = (rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase) + '/api';

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

export const addMentoringAction = async (studentId, taskName, deadline, priority) => {
  const response = await fetch(`${API_URL}/mentor/actions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, taskName, deadline, priority }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error || data.message || 'Something went wrong');
  }
};

export const updateMentoringAction = async (actionId, updateData) => {
  const response = await fetch(`${API_URL}/mentor/actions/${actionId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
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

export const createOrUpdateHeading = async (data) => {
  const response = await fetch(`${API_URL}/resume/heading`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (response.ok) return result;
  throw new Error(result.message || 'Failed to save heading');
};

export const getResumeAll = async () => {
  const response = await fetch(`${API_URL}/resume/all`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.message || 'Failed to fetch resume');
};

export const getPublicResume = async (userId) => {
  const response = await fetch(`${API_URL}/public/students/${userId}/resume`);
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.message || 'Failed to fetch public resume');
};

export const addSkill = async (data) => {
  const response = await fetch(`${API_URL}/resume/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (response.ok) return result;
  throw new Error(result.message || 'Failed to add skill');
};

export const deleteSkill = async (id) => {
  const response = await fetch(`${API_URL}/resume/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (response.ok) return;
  const result = await response.json();
  throw new Error(result.message || 'Failed to delete skill');
};

// Jobs & Drives (Student)
export const getDrives = async () => {
  const response = await fetch(`${API_URL}/drives`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to fetch drives');
};

export const getDriveById = async (id) => {
  const response = await fetch(`${API_URL}/drives/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to fetch drive');
};

export const getDriveStats = async (id) => {
  const response = await fetch(`${API_URL}/drives/${id}/stats`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to fetch stats');
};

export const applyToJob = async (jobId) => {
  const response = await fetch(`${API_URL}/applications/job/${jobId}/apply`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to apply');
};

export const getMyApplications = async () => {
  const response = await fetch(`${API_URL}/applications/stages/student`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to fetch applications');
};

// Notifications
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to fetch notifications');
};

export const getUnreadNotificationCount = async () => {
  const response = await fetch(`${API_URL}/notifications/unread-count`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to fetch count');
};

export const markNotificationRead = async (id) => {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (response.ok) return data;
  throw new Error(data.error || 'Failed to mark as read');
};

export const deleteNotification = async (id) => {
  const response = await fetch(`${API_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (response.ok) return;
  throw new Error('Failed to delete notification');
};

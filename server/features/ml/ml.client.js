const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";

const syncResume = async (userId, text) => {
  await axios.post(`${ML_SERVICE_URL}/sync/resume`, {
    user_id: userId,
    text,
  });
};

const syncJob = async (jobId, text) => {
  await axios.post(`${ML_SERVICE_URL}/sync/job`, {
    job_id: jobId,
    text,
  });
};

const syncBatch = async (resumes, jobs) => {
  const response = await axios.post(`${ML_SERVICE_URL}/sync/batch`, {
    resumes,
    jobs,
  });
  return response.data;
};

const match = async (jobId, text, limit = 10) => {
  const response = await axios.post(`${ML_SERVICE_URL}/match`, {
    job_id: jobId,
    text,
    limit,
  });
  return response.data;
};

module.exports = {
  syncResume,
  syncJob,
  syncBatch,
  match,
};

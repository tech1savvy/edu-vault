import React, { useState, useContext } from "react";
import { syncResumeProfile } from "../../services/api";
import { ResumeContext } from "../../context/resumeContext";

export default function SyncProfileButton() {
  const [syncing, setSyncing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const contextData = useContext(ResumeContext);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      setSuccess(false);

      // Extract the current state from context
      const payload = {
        heading: contextData.heading || {},
        experiences: contextData.experiences || [],
        education: contextData.education || [],
        projects: contextData.projects || [],
        skills: contextData.skills || [],
        achievements: contextData.achievements || [],
        certifications: contextData.certifications || [],
      };

      await syncResumeProfile(payload);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to sync profile");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <button 
        className={`btn ${success ? 'btn-success' : 'btn-outline-primary'}`} 
        onClick={handleSync} 
        disabled={syncing}
      >
        {syncing ? "Syncing..." : success ? "Synced Successfully!" : "Sync Profile to Database"}
      </button>
      {error && <small className="text-danger mt-1">{error}</small>}
    </div>
  );
}

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
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to sync profile");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={success ? "theme-btn theme-btn-success" : "theme-btn border border-blue-500/50 text-blue-400 hover:bg-blue-500/20"}
        onClick={handleSync}
        disabled={syncing}
      >
        {syncing ? "Syncing..." : success ? "Synced Successfully!" : "Sync Profile to Database"}
      </button>
      {error && <small className="text-red-400 mt-1">{error}</small>}
    </div>
  );
}

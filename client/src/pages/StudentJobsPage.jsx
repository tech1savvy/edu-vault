import { useState, useEffect } from 'react';
import {
  Briefcase, Building2, MapPin, CalendarDays, ChevronDown, ChevronUp,
  Clock, CheckCircle2, XCircle, Send, Loader2, Users, GraduationCap, Sparkles
} from 'lucide-react';
import { getDrives, getDriveStats, applyToJob } from '../services/api';
import './StudentJobsPage.css';

const driveStatusColors = {
  upcoming: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  active: 'bg-green-500/20 text-green-400 border border-green-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const stageTypeLabels = {
  OA: 'Online Assessment',
  Technical: 'Technical Interview',
  HR: 'HR Interview',
  Final: 'Final Round',
};

export default function StudentJobsPage() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDrive, setExpandedDrive] = useState(null);
  const [applying, setApplying] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [driveStats, setDriveStats] = useState({});
  const [statsLoading, setStatsLoading] = useState({});
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const res = await getDrives();
        setDrives(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  const handleExpand = async (driveId) => {
    if (expandedDrive === driveId) {
      setExpandedDrive(null);
      return;
    }
    setExpandedDrive(driveId);
    if (!driveStats[driveId]) {
      setStatsLoading(prev => ({ ...prev, [driveId]: true }));
      try {
        const res = await getDriveStats(driveId);
        setDriveStats(prev => ({ ...prev, [driveId]: res.data }));
      } catch { }
      setStatsLoading(prev => ({ ...prev, [driveId]: false }));
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyToJob(jobId);
      setAppliedIds(prev => new Set([...prev, jobId]));
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-cyan-400" />
          Drives & Applications
        </h1>
        <div className="flex gap-1 mt-4 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'browse' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Browse Drives
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'applications' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            My Applications
          </button>
        </div>
      </header>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-4">{error}</div>
      )}

      {activeTab === 'browse' && (
        drives.length === 0 ? (
          <div className="theme-card p-8 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400">No active drives available for you right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drives.map(drive => {
              const isExpanded = expandedDrive === drive.id;
              const stats = driveStats[drive.id];
              return (
                <div key={drive.id} className="theme-card overflow-hidden">
                  <div
                    className="p-5 cursor-pointer hover:bg-gray-800/50 transition"
                    onClick={() => handleExpand(drive.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{drive.companyName}</h3>
                            <p className="text-gray-400 text-sm">{drive.title}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                          {drive.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.location}</span>
                          )}
                          {drive.driveType && (
                            <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{drive.driveType}</span>
                          )}
                          {drive.startDate && (
                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(drive.startDate).toLocaleDateString()}{drive.endDate ? ` - ${new Date(drive.endDate).toLocaleDateString()}` : ''}</span>
                          )}
                        </div>
                        {drive.description && (
                          <p className="text-gray-400 text-sm mt-2 line-clamp-2">{drive.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${driveStatusColors[drive.status] || 'bg-gray-500/20 text-gray-400'}`}>
                          {drive.status}
                        </span>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </div>

                    {drive.stages && drive.stages.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                        {drive.stages.map((stage, idx) => (
                          <div key={stage.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 whitespace-nowrap">
                              <Clock className="w-3 h-3" />
                              {stageTypeLabels[stage.stageType] || stage.name}
                              {stage.scheduledDate && <span className="text-gray-500">({new Date(stage.scheduledDate).toLocaleDateString()})</span>}
                            </div>
                            {idx < drive.stages.length - 1 && <div className="w-4 h-px bg-gray-600" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-700/50 px-5 py-4">
                      {statsLoading[drive.id] ? (
                        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-cyan-500" /></div>
                      ) : stats && (
                        <div className="flex flex-wrap gap-3 mb-4 text-sm">
                          <div className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300">
                            <span className="text-gray-500">Applied: </span>{stats.totalApplied}
                          </div>
                          {stats.stages.map(s => (
                            <div key={s.stageId} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300">
                              <span className="text-gray-500">{s.stageName}: </span>{s.count}
                            </div>
                          ))}
                          <div className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400">
                            Selected: {stats.selected}
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400">
                            Eliminated: {stats.eliminated}
                          </div>
                        </div>
                      )}

                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Job Roles</h4>
                      <div className="space-y-3">
                        {drive.jobDescriptions && drive.jobDescriptions.map(job => {
                          const isApplied = appliedIds.has(job.id);
                          return (
                            <div key={job.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-100">{job.title}</h5>
                                  {job.eligibilityNotes && (
                                    <p className="text-xs text-amber-400 mt-1">{job.eligibilityNotes}</p>
                                  )}
                                  {job.description && (
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{job.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {job.minCgpa && <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">Min CGPA: {job.minCgpa}</span>}
                                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                                      <span className="text-xs flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                                        <Sparkles className="w-3 h-3" />{job.requiredSkills.join(', ')}
                                      </span>
                                    )}
                                    {job.eligibleBranches && job.eligibleBranches.length > 0 && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">{job.eligibleBranches.join(', ')}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-3">
                                  {isApplied ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                      <CheckCircle2 className="w-4 h-4" /> Applied
                                    </span>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                                      disabled={applying === job.id}
                                      className="theme-btn theme-btn-cyan text-sm"
                                    >
                                      {applying === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                      Apply
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {activeTab === 'applications' && <StudentApplicationsView />}
    </div>
  );
}

function StudentApplicationsView() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../services/api').then(({ getMyApplications }) => {
      getMyApplications()
        .then(res => setApplications(res.data || []))
        .catch(() => { })
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>;
  }

  if (applications.length === 0) {
    return (
      <div className="theme-card p-8 text-center">
        <Send className="w-12 h-12 mx-auto mb-3 text-gray-500" />
        <p className="text-gray-400">You haven't applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(app => {
        const stages = app.drive?.stages || [];
        const currentStageIdx = app.currentStage ? stages.findIndex(s => s.id === app.currentStage.id) : -1;
        return (
          <div key={app.id} className="theme-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{app.jobTitle}</h3>
                {app.drive && (
                  <p className="text-sm text-gray-400">{app.drive.companyName} - {app.drive.title}</p>
                )}
                <span className="text-xs text-gray-500">Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
              </div>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                app.status === 'shortlisted' ? 'bg-green-500/20 text-green-400' :
                app.status === 'reviewed' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {app.status}
              </span>
            </div>

            {stages.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {stages.map((stage, idx) => {
                    const log = app.stageLog?.find(l => l.stageId === stage.id);
                    const isCurrent = app.currentStage?.id === stage.id;
                    const isDone = log?.status === 'shortlisted';
                    const isFailed = log?.status === 'eliminated';
                    const isPending = log && !isDone && !isFailed;

                    return (
                      <div key={stage.id} className="flex items-center gap-2">
                        <div className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[100px] text-center ${
                          isFailed ? 'bg-red-500/10 border border-red-500/30' :
                          isDone ? 'bg-green-500/10 border border-green-500/30' :
                          isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30' :
                          isPending ? 'bg-yellow-500/10 border border-yellow-500/30' :
                          'bg-gray-800 border border-gray-700/50'
                        }`}>
                          <span className="text-xs font-medium">{stageTypeLabels[stage.stageType] || stage.name}</span>
                          {stage.scheduledDate && <span className="text-[10px] text-gray-500 mt-0.5">{new Date(stage.scheduledDate).toLocaleDateString()}</span>}
                          {isDone && <CheckCircle2 className="w-3 h-3 text-green-400 mt-1" />}
                          {isFailed && <XCircle className="w-3 h-3 text-red-400 mt-1" />}
                          {isCurrent && !isDone && !isFailed && <Clock className="w-3 h-3 text-cyan-400 mt-1" />}
                        </div>
                        {idx < stages.length - 1 && <div className="w-3 h-px bg-gray-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {app.stageLog && app.stageLog.filter(l => l.notes).length > 0 && (
              <div className="mt-3 space-y-1">
                {app.stageLog.filter(l => l.notes).map((log, idx) => (
                  <p key={idx} className="text-xs text-gray-400">- {log.notes}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';
import {
  Building2, Users, CalendarDays, MapPin, GraduationCap, ArrowLeft,
  Loader2, CheckCircle2, XCircle, Send, Plus, Trash2, Edit3,
  Crosshair, Eye, Briefcase, Sparkles, X
} from 'lucide-react';

const DRIVE_STAGES = [
  { value: 'OA', label: 'Online Assessment' },
  { value: 'Technical', label: 'Technical Interview' },
  { value: 'HR', label: 'HR Interview' },
  { value: 'Final', label: 'Final Round' },
];

const stageActionColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  shortlisted: 'bg-green-500/20 text-green-400',
  eliminated: 'bg-red-500/20 text-red-400',
};

const PLACEHOLDER_BRANCHES = [
  'Computer Science', 'Information Technology', 'Computer Engineering',
  'Electronics', 'Mechanical', 'Civil', 'Business Administration'
];

export default function AdminDriveDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showStageForm, setShowStageForm] = useState(false);
  const [newStage, setNewStage] = useState({ stageType: 'OA', name: '', scheduledDate: '', description: '' });
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [savingJob, setSavingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '', description: '', requirements: '', status: 'active',
    minCgpa: '', requiredSkills: '', eligibleBranches: '', eligibilityNotes: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driveRes, appsRes] = await Promise.all([
        adminService.getDriveById(id),
        adminService.getDriveApplications(id)
      ]);
      setDrive(driveRes.data?.data);
      setApplications(appsRes.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: '', description: '', requirements: '', status: 'active',
      minCgpa: '', requiredSkills: '', eligibleBranches: '', eligibilityNotes: ''
    });
    setEditingJob(null);
    setShowJobForm(false);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      status: job.status || 'active',
      minCgpa: job.minCgpa || '',
      requiredSkills: (job.requiredSkills || []).join(', '),
      eligibleBranches: (job.eligibleBranches || []).join(', '),
      eligibilityNotes: job.eligibilityNotes || ''
    });
    setShowJobForm(true);
  };

  const handleSaveJob = async () => {
    setSavingJob(true);
    try {
      const payload = {
        title: jobForm.title,
        description: jobForm.description,
        requirements: jobForm.requirements,
        status: jobForm.status || 'active',
        driveId: parseInt(id),
        minCgpa: jobForm.minCgpa ? parseFloat(jobForm.minCgpa) : null,
        requiredSkills: jobForm.requiredSkills ? jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
        eligibleBranches: jobForm.eligibleBranches ? jobForm.eligibleBranches.split(',').map(s => s.trim()).filter(Boolean) : [],
        eligibilityNotes: jobForm.eligibilityNotes || null
      };
      if (editingJob) {
        await adminService.updateJobDescription(editingJob.id, payload);
      } else {
        await adminService.createJobDescription(payload);
      }
      resetJobForm();
      const driveRes = await adminService.getDriveById(id);
      setDrive(driveRes.data?.data);
    } catch (err) {
      alert(err.message || 'Failed to save job role');
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job role? This cannot be undone.')) return;
    try {
      await adminService.deleteJobDescription(jobId);
      const driveRes = await adminService.getDriveById(id);
      setDrive(driveRes.data?.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMoveToStage = async (applicationId, stageId) => {
    setActionLoading(`move-${applicationId}`);
    try {
      await adminService.moveToStage(applicationId, stageId);
      const appsRes = await adminService.getDriveApplications(id);
      setApplications(appsRes.data?.data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStageAction = async (applicationId, stageId, status) => {
    setActionLoading(`${status}-${applicationId}`);
    try {
      await adminService.updateStageStatus(applicationId, stageId, status, null);
      const appsRes = await adminService.getDriveApplications(id);
      setApplications(appsRes.data?.data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const addStageToDrive = async () => {
    if (!drive) return;
    const updatedStages = [
      ...(drive.stages || []).map((s) => ({
        name: s.stageType === 'custom' ? s.name : DRIVE_STAGES.find(ds => ds.value === s.stageType)?.label || s.name,
        stageType: s.stageType, scheduledDate: s.scheduledDate || '', description: s.description || ''
      })),
      {
        name: newStage.stageType === 'custom' ? newStage.name : DRIVE_STAGES.find(s => s.value === newStage.stageType)?.label || newStage.name,
        stageType: newStage.stageType, scheduledDate: newStage.scheduledDate || '', description: newStage.description || ''
      }
    ];
    try {
      await adminService.updateDrive(id, { companyName: drive.companyName, title: drive.title, stages: updatedStages });
      const driveRes = await adminService.getDriveById(id);
      setDrive(driveRes.data?.data);
      setNewStage({ stageType: 'OA', name: '', scheduledDate: '', description: '' });
      setShowStageForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeStageFromDrive = async (stageIdx) => {
    const updatedStages = drive.stages.filter((_, i) => i !== stageIdx).map(s => ({
      name: s.stageType === 'custom' ? s.name : DRIVE_STAGES.find(ds => ds.value === s.stageType)?.label || s.name,
      stageType: s.stageType, scheduledDate: s.scheduledDate || '', description: s.description || ''
    }));
    try {
      await adminService.updateDrive(id, { companyName: drive.companyName, title: drive.title, stages: updatedStages });
      const driveRes = await adminService.getDriveById(id);
      setDrive(driveRes.data?.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const onDragStart = (e, applicationId) => {
    e.dataTransfer.setData('applicationId', applicationId);
  };

  const onDrop = async (e, stageId) => {
    e.preventDefault();
    const applicationId = e.dataTransfer.getData('applicationId');
    if (applicationId) await handleMoveToStage(parseInt(applicationId), stageId);
  };

  const onDragOver = (e) => e.preventDefault();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
        <button onClick={() => navigate('/admin/drives')}
          className="text-gray-100 hover:text-cyan-400 mb-3 bg-transparent border-none cursor-pointer flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Drives
        </button>
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30">{error || 'Drive not found'}</div>
      </div>
    );
  }

  const stages = drive.stages || [];
  const jobs = drive.jobDescriptions || [];
  const noStageApps = applications.filter(app => !app.currentStage);
  const appsByStage = {};
  stages.forEach(s => { appsByStage[s.id] = []; });
  applications.forEach(app => {
    if (app.currentStage && appsByStage[app.currentStage.id]) {
      appsByStage[app.currentStage.id].push(app);
    }
  });

  return (
    <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <button onClick={() => navigate('/admin/drives')}
        className="text-gray-100 hover:text-cyan-400 mb-4 bg-transparent border-none cursor-pointer flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Drives
      </button>

      {/* Drive Info Header */}
      <div className="theme-card p-5 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{drive.companyName}</h1>
                <p className="text-gray-400">{drive.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              {drive.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.location}</span>}
              {drive.driveType && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{drive.driveType}</span>}
              {drive.startDate && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(drive.startDate).toLocaleDateString()}</span>}
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{applications.length} applicants</span>
              <span className="flex items-center gap-1">{stages.length} stages</span>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            drive.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            drive.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>{drive.status}</span>
        </div>
      </div>

      {/* Job Roles Section */}
      <div className="theme-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Job Roles
          </h2>
          <button onClick={() => { resetJobForm(); setShowJobForm(true); }}
            className="theme-btn theme-btn-cyan text-xs flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Role
          </button>
        </div>

        {showJobForm && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{editingJob ? 'Edit Job Role' : 'New Job Role'}</h3>
              <button onClick={resetJobForm} className="text-gray-400 hover:text-gray-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Title *</label>
                <input value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Description</label>
                <textarea value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" rows={2} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Requirements</label>
                <textarea value={jobForm.requirements} onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" rows={2} />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Min CGPA</label>
                <input type="number" step="0.1" min="0" max="10" value={jobForm.minCgpa}
                  onChange={e => setJobForm({ ...jobForm, minCgpa: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Required Skills (comma-separated)</label>
                <input value={jobForm.requiredSkills} onChange={e => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  placeholder="Python, SQL, JavaScript"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Eligible Branches (comma-separated)</label>
                <input value={jobForm.eligibleBranches} onChange={e => setJobForm({ ...jobForm, eligibleBranches: e.target.value })}
                  placeholder="Computer Science, Information Technology"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Eligibility Notes</label>
                <input value={jobForm.eligibilityNotes} onChange={e => setJobForm({ ...jobForm, eligibilityNotes: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveJob} disabled={savingJob || !jobForm.title}
                className="theme-btn theme-btn-cyan text-sm">
                {savingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editingJob ? 'Update' : 'Create'}
              </button>
              <button onClick={resetJobForm} className="theme-btn theme-btn-ghost text-sm">Cancel</button>
            </div>
          </div>
        )}

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No job roles defined. Add one to start receiving applications.</p>
        ) : (
          <div className="space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{job.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        job.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'
                      }`}>{job.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      {job.minCgpa && <span>Min CGPA: {job.minCgpa}</span>}
                      {job.requiredSkills?.length > 0 && (
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{job.requiredSkills.join(', ')}</span>
                      )}
                      {job.eligibleBranches?.length > 0 && <span>{job.eligibleBranches.join(', ')}</span>}
                    </div>
                    {job.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{job.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                    <button onClick={() => navigate(`/admin/job-descriptions/${job.id}/matches`)}
                      className="p-1.5 rounded text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition" title="Match Resumes">
                      <Crosshair className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => navigate(`/admin/job-descriptions/${job.id}/applications`)}
                      className="p-1.5 rounded text-xs bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition" title="Applications">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleEditJob(job)}
                      className="p-1.5 rounded text-xs bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stages + Kanban Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Applicant Pipeline
        </h2>
        <button onClick={() => setShowStageForm(!showStageForm)}
          className="theme-btn theme-btn-cyan text-xs flex items-center gap-1">
          <Plus className="w-3 h-3" /> {showStageForm ? 'Cancel' : 'Add Stage'}
        </button>
      </div>

      {showStageForm && (
        <div className="theme-card p-4 mb-4 flex items-center gap-2 flex-wrap">
          <select value={newStage.stageType} onChange={e => setNewStage({ ...newStage, stageType: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500">
            {DRIVE_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            <option value="custom">Custom...</option>
          </select>
          {newStage.stageType === 'custom' && (
            <input placeholder="Stage name" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 w-36 focus:outline-none focus:border-cyan-500" />
          )}
          <input type="date" value={newStage.scheduledDate} onChange={e => setNewStage({ ...newStage, scheduledDate: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
          <input placeholder="Notes" value={newStage.description} onChange={e => setNewStage({ ...newStage, description: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 w-48 focus:outline-none focus:border-cyan-500" />
          <button onClick={addStageToDrive} className="theme-btn theme-btn-success text-xs">Add</button>
          <button onClick={() => setShowStageForm(false)} className="theme-btn theme-btn-ghost text-xs">Cancel</button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
        <div className="flex-shrink-0 w-64">
          <div className="bg-gray-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Unassigned</h3>
              <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">{noStageApps.length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]" onDragOver={onDragOver}>
              {noStageApps.map(app => (
                <StudentCard key={app.id} app={app} stageId={null}
                  onDragStart={onDragStart} actionLoading={actionLoading}
                  handleStageAction={handleStageAction} handleMoveToStage={handleMoveToStage}
                  stages={stages} getStudentName={getStudentName}
                  getJobTitle={getJobTitle} />
              ))}
            </div>
          </div>
        </div>

        {stages.map((stage, idx) => (
          <div key={stage.id} className="flex-shrink-0 w-64" onDragOver={onDragOver} onDrop={(e) => onDrop(e, stage.id)}>
            <div className="bg-gray-800/80 rounded-lg p-3 h-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">{DRIVE_STAGES.find(s => s.value === stage.stageType)?.label || stage.name}</h3>
                  {stage.scheduledDate && <p className="text-[10px] text-gray-500">{new Date(stage.scheduledDate).toLocaleDateString()}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">{(appsByStage[stage.id] || []).length}</span>
                  {stages.length > 1 && (
                    <button onClick={() => removeStageFromDrive(idx)} className="text-red-400 hover:text-red-300 p-0.5"><Trash2 className="w-3 h-3" /></button>
                  )}
                </div>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {(appsByStage[stage.id] || []).map(app => (
                  <StudentCard key={app.id} app={app} stageId={stage.id}
                    onDragStart={onDragStart} actionLoading={actionLoading}
                    handleStageAction={handleStageAction} handleMoveToStage={handleMoveToStage}
                    stages={stages} getStudentName={getStudentName}
                    getJobTitle={getJobTitle} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStudentName(app) { return app.user?.name || 'Unknown'; }
function getJobTitle(app) { return app.job?.title || 'Unknown'; }

function StudentCard({ app, stageId, onDragStart, actionLoading, stages, getStudentName, getJobTitle, handleMoveToStage, handleStageAction }) {
  const latestLog = app.stageLog?.slice().reverse().find(l => l.stageId === stageId);
  const logStatus = latestLog?.status || 'pending';
  const isAssigned = !!stageId;
  const isEliminated = logStatus === 'eliminated';
  const nextStage = stageId ? stages[stages.findIndex(s => s.id === stageId) + 1] : stages[0];

  return (
    <div draggable onDragStart={(e) => onDragStart(e, app.id)}
      className={`bg-gray-900/80 rounded-lg p-3 border cursor-grab active:cursor-grabbing transition ${
        isEliminated ? 'border-red-500/30 opacity-60' : 'border-gray-700/50 hover:border-gray-600'
      }`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
          {getStudentName(app).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{getStudentName(app)}</p>
          <p className="text-[10px] text-gray-500 truncate">{getJobTitle(app)}</p>
        </div>
      </div>
      {isAssigned && (
        <div className="mt-2">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${stageActionColors[logStatus] || 'bg-yellow-500/20 text-yellow-400'}`}>{logStatus}</span>
        </div>
      )}
      <div className="mt-2 flex gap-1">
        {isAssigned && !isEliminated && (
          <>
            <button onClick={() => handleStageAction(app.id, stageId, 'shortlisted')}
              disabled={actionLoading === `shortlisted-${app.id}`}
              className="flex-1 text-[10px] px-1.5 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition disabled:opacity-50">
              <CheckCircle2 className="w-3 h-3 mx-auto" />
            </button>
            <button onClick={() => handleStageAction(app.id, stageId, 'eliminated')}
              disabled={actionLoading === `eliminated-${app.id}`}
              className="flex-1 text-[10px] px-1.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition disabled:opacity-50">
              <XCircle className="w-3 h-3 mx-auto" />
            </button>
          </>
        )}
        {!isAssigned && nextStage && (
          <button onClick={() => handleMoveToStage(app.id, nextStage.id)}
            disabled={actionLoading === `move-${app.id}`}
            className="flex-1 text-[10px] px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition disabled:opacity-50">
            <Send className="w-3 h-3 mx-auto" />
          </button>
        )}
      </div>
    </div>
  );
}

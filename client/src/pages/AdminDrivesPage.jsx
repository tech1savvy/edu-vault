import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';
import {
  Building2, Plus, Edit3, Trash2, CalendarDays, Users,
  MapPin, GraduationCap, Loader2, Eye, Play, XCircle
} from 'lucide-react';

const statusConfig = {
  upcoming: { label: 'Upcoming', bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  active: { label: 'Active', bg: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  closed: { label: 'Closed', bg: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
};

const DRIVE_STAGES = [
  { value: 'OA', label: 'Online Assessment' },
  { value: 'Technical', label: 'Technical Interview' },
  { value: 'HR', label: 'HR Interview' },
  { value: 'Final', label: 'Final Round' },
];

export default function AdminDrivesPage() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: '', title: '', description: '', status: 'upcoming',
    startDate: '', endDate: '', location: '', driveType: 'on-campus',
    stages: [{ name: '', stageType: 'OA', scheduledDate: '', description: '' }]
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDrives();
      setDrives(res.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      companyName: '', title: '', description: '', status: 'upcoming',
      startDate: '', endDate: '', location: '', driveType: 'on-campus',
      stages: [{ name: '', stageType: 'OA', scheduledDate: '', description: '' }]
    });
    setEditingDrive(null);
    setShowForm(false);
  };

  const handleEdit = (drive) => {
    setEditingDrive(drive);
    setForm({
      companyName: drive.companyName || '',
      title: drive.title || '',
      description: drive.description || '',
      status: drive.status || 'upcoming',
      startDate: drive.startDate || '',
      endDate: drive.endDate || '',
      location: drive.location || '',
      driveType: drive.driveType || 'on-campus',
      stages: (drive.stages || []).map(s => ({
        name: s.name || '',
        stageType: s.stageType || 'custom',
        scheduledDate: s.scheduledDate || '',
        description: s.description || ''
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this drive and all associated stages?')) return;
    try {
      await adminService.deleteDrive(id);
      fetchDrives();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusToggle = async (drive) => {
    const newStatus = drive.status === 'active' ? 'closed' : drive.status === 'upcoming' ? 'active' : 'upcoming';
    try {
      await adminService.updateDriveStatus(drive.id, newStatus);
      fetchDrives();
    } catch (err) {
      alert(err.message);
    }
  };

  const addStage = () => {
    setForm(prev => ({
      ...prev,
      stages: [...prev.stages, { name: '', stageType: 'OA', scheduledDate: '', description: '' }]
    }));
  };

  const removeStage = (idx) => {
    setForm(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== idx)
    }));
  };

  const updateStage = (idx, field, value) => {
    setForm(prev => {
      const stages = [...prev.stages];
      stages[idx] = { ...stages[idx], [field]: value };
      if (field === 'stageType' && value !== 'custom') {
        const found = DRIVE_STAGES.find(s => s.value === value);
        stages[idx].name = found ? found.label : value;
      }
      return { ...prev, stages };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingDrive) {
        await adminService.updateDrive(editingDrive.id, form);
      } else {
        await adminService.createDrive(form);
      }
      resetForm();
      fetchDrives();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Recruitment Drives
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage campus drives, stages, and applications</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="theme-btn theme-btn-cyan text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'New Drive'}
        </button>
      </header>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-4">{error}</div>
      )}

      {showForm && (
        <div className="theme-card p-5 mb-6">
          <h2 className="font-semibold text-lg mb-4">{editingDrive ? 'Edit Drive' : 'Create New Drive'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Company Name *</label>
              <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Drive Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" rows={3} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Drive Type</label>
              <select value={form.driveType} onChange={e => setForm({ ...form, driveType: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500">
                <option value="on-campus">On Campus</option>
                <option value="off-campus">Off Campus</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500">
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Stages / Rounds</h3>
              <button type="button" onClick={addStage} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Stage</button>
            </div>
            <div className="space-y-2">
              {form.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 w-6">{idx + 1}.</span>
                  <select value={stage.stageType} onChange={e => updateStage(idx, 'stageType', e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 w-44">
                    {DRIVE_STAGES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                    <option value="custom">Custom...</option>
                  </select>
                  {stage.stageType === 'custom' && (
                    <input value={stage.name} onChange={e => updateStage(idx, 'name', e.target.value)}
                      placeholder="Stage name"
                      className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 w-40" />
                  )}
                  <input type="date" value={stage.scheduledDate} onChange={e => updateStage(idx, 'scheduledDate', e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 w-36" />
                  <input value={stage.description} onChange={e => updateStage(idx, 'description', e.target.value)}
                    placeholder="Notes"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-cyan-500 flex-1" />
                  {form.stages.length > 1 && (
                    <button onClick={() => removeStage(idx)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={handleSave} disabled={saving || !form.companyName || !form.title}
              className="theme-btn theme-btn-cyan text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editingDrive ? 'Update Drive' : 'Create Drive'}
            </button>
            <button onClick={resetForm} className="theme-btn theme-btn-ghost text-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
      ) : drives.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No drives yet. Click "New Drive" to create one.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {drives.map(drive => (
            <div key={drive.id} className="theme-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{drive.companyName}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusConfig[drive.status]?.bg || 'bg-gray-500/20 text-gray-400'}`}>
                      {statusConfig[drive.status]?.label || drive.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{drive.title}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    {drive.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.location}</span>}
                    {drive.driveType && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{drive.driveType}</span>}
                    {drive.startDate && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(drive.startDate).toLocaleDateString()}</span>}
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{drive.jobDescriptions?.length || 0} roles</span>
                    <span className="flex items-center gap-1">{drive.stages?.length || 0} stages</span>
                  </div>
                  {drive.stages?.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {drive.stages.map((s, i) => (
                        <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400">
                          {i + 1}. {s.stageType === 'custom' ? s.name : s.stageType}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => navigate(`/admin/drives/${drive.id}`)}
                    className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition" title="View details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleStatusToggle(drive)}
                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition"
                    title={drive.status === 'active' ? 'Close drive' : 'Activate drive'}>
                    {drive.status === 'active' ? <XCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(drive)}
                    className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(drive.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

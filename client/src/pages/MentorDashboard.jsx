import React, { useState, useEffect } from "react";
import {
  getMentorStudents,
  getStudentDashboardData,
  addMentoringAction,
  getMentoringTimeline,
  updateMentoringAction
} from "../services/api";
import { 
  AlertCircle, Clock, CheckCircle, Search, TrendingUp, 
  Sparkles, CheckCircle2, UserCircle, Briefcase, 
  CalendarDays, MessageSquare, Flag, ArrowUpRight 
} from "lucide-react";

export default function MentorDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  
  const [targetRole, setTargetRole] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getMentorStudents();
      setStudents(res.data);
      setLoading(false);
    } catch {
      setError("Failed to fetch students.");
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setDashboardData(null);
    setTimeline([]);
    try {
      setTargetRole("");
      const [dsRes, tlRes] = await Promise.all([
        getStudentDashboardData(student.id),
        getMentoringTimeline(student.id),
      ]);
      setDashboardData(dsRes.data);
      setTimeline(tlRes.data);
    } catch {
      alert("Error loading student data");
    }
  };

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    setTargetRole(newRole);
    setDashboardData(null);
    try {
      const dsRes = await getStudentDashboardData(selectedStudent.id, newRole);
      setDashboardData(dsRes.data);
    } catch {
      alert("Error updating target role analysis");
    }
  };

  const handleAddAction = async (e) => {
    e.preventDefault();
    if (!taskName) return;
    try {
      await addMentoringAction(selectedStudent.id, taskName, deadline, priority);
      const tlRes = await getMentoringTimeline(selectedStudent.id);
      setTimeline(tlRes.data);
      setTaskName("");
      setDeadline("");
      setPriority("MEDIUM");
    } catch {
      alert("Failed to add action.");
    }
  };

  const handleUpdateFeedback = async (actionId, newStatus, newMentorFeedback) => {
    try {
        const payload = {};
        if (newStatus !== undefined) payload.status = newStatus;
        if (newMentorFeedback !== undefined) payload.mentorFeedback = newMentorFeedback;
        
        await updateMentoringAction(actionId, payload);
        const tlRes = await getMentoringTimeline(selectedStudent.id);
        setTimeline(tlRes.data);
    } catch {
        alert("Failed to update feedback.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center pt-12 theme-bg">
        <div className="theme-spinner" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center pt-12 text-red-400 theme-bg">{error}</div>;
  }

  return (
    <div className="theme-bg" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="theme-blob theme-blob-tr" />
      <div className="theme-blob theme-blob-bl" />
      <div className="theme-content px-4 py-5">
      <h2 className="mb-6 text-center font-bold text-2xl flex items-center justify-center gap-2">
        <Sparkles className="text-blue-500" size={28}/> Mentor Analytics Interface
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ minHeight: 'calc(100vh - 12rem)' }}>
        {/* Left Panel: Student List */}
        <div className="lg:col-span-1">
          <div className="theme-card flex flex-col h-full">
            <div className="theme-card-header px-4 py-3 flex items-center gap-2">
              <Search className="text-cyan-400" size={20}/>
              <h5 className="mb-0 font-semibold">Mentees Roster</h5>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              {students.length === 0 && (
                <div className="p-3 text-gray-500 text-center">No students available.</div>
              )}
              {students.map((student) => (
                <button
                  key={student.id}
                  className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-gray-700/50 ${
                    selectedStudent?.id === student.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-700/30 hover:text-gray-200"
                  }`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-sm">{student.name}</strong>
                    <small className="text-xs opacity-70">ID: {student.id}</small>
                  </div>
                  <small className="text-xs opacity-60">{student.email}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-3">
          {!selectedStudent ? (
            <div className="theme-card p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                    <TrendingUp className="text-blue-500" size={32}/>
                    <h3 className="font-bold text-xl mb-0">Aggregate Cohort Overview</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="theme-card p-4 text-center">
                        <p className="text-gray-400 mb-2 font-bold text-xs uppercase tracking-wider">Total Mentees</p>
                        <h1 className="text-white text-5xl font-bold m-0">{students.length}</h1>
                    </div>
                    <div className="theme-card p-4 text-center">
                        <p className="text-gray-400 mb-2 font-bold text-xs uppercase tracking-wider">Avg. Readiness</p>
                        <h1 className="m-0 text-5xl font-bold" style={{ color: '#4ade80' }}>72%</h1>
                        <small className="mt-1" style={{ color: '#4ade80' }}><ArrowUpRight size={14} className="inline"/> +5% this month</small>
                    </div>
                    <div className="theme-card p-4 text-center">
                        <p className="text-gray-400 mb-2 font-bold text-xs uppercase tracking-wider">Interventions</p>
                        <h1 className="text-yellow-500 m-0 text-5xl font-bold">14</h1>
                        <small className="text-gray-500 mt-1">Pending tasks</small>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="theme-card p-4">
                         <h5 className="text-white mb-4 flex items-center gap-2 font-semibold">
                             <AlertCircle className="text-red-500" size={20}/> At-Risk Mentees
                         </h5>
                          <ul className="list-none m-0 p-0 space-y-3">
                            {students.length === 0 ? (
                              <li className="text-gray-600 text-sm text-center py-2">No students yet.</li>
                            ) : students.map((s) => (
                              <li key={s.id} className="flex justify-between items-center pb-2 border-b border-gray-700/50">
                                <span className="text-gray-400">{s.name}</span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-gray-900">Needs Review</span>
                              </li>
                            ))}
                         </ul>
                    </div>
                    <div className="theme-card p-4">
                         <h5 className="text-white mb-4 flex items-center gap-2 font-semibold">
                             <TrendingUp className="text-cyan-400" size={20}/> Top Skill Gaps (Global)
                         </h5>
                         <div className="mb-3">
                             <div className="flex justify-between text-gray-400 text-xs mb-1"><span>System Design</span><span>65% missing</span></div>
                             <div className="w-full bg-gray-700/50 rounded-full h-1.5"><div className="bg-red-500 rounded-full h-1.5" style={{width: '65%'}}></div></div>
                         </div>
                         <div className="mb-3">
                             <div className="flex justify-between text-gray-400 text-xs mb-1"><span>AWS / Cloud</span><span>42% missing</span></div>
                             <div className="w-full bg-gray-700/50 rounded-full h-1.5"><div className="bg-yellow-500 rounded-full h-1.5" style={{width: '42%'}}></div></div>
                         </div>
                         <div className="mb-0">
                             <div className="flex justify-between text-gray-400 text-xs mb-1"><span>Data Structures</span><span>28% missing</span></div>
                             <div className="w-full bg-gray-700/50 rounded-full h-1.5"><div className="bg-cyan-500 rounded-full h-1.5" style={{width: '28%'}}></div></div>
                         </div>
                    </div>
                </div>
            </div>
          ) : !dashboardData ? (
            <div className="text-center mt-12 text-gray-500 theme-card p-8">
              <div className="theme-spinner mx-auto mb-4"></div>
              <p className="text-lg">Analyzing profile against industry benchmarks...</p>
            </div>
          ) : (
            <>
              {/* Top Section: Profile & Gap Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                
                {/* Center Column: Profile & Progress */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Deep Profile Card */}
                  <div className="theme-card overflow-hidden">
                    <div className="theme-card-header px-4 py-3 flex justify-between items-center">
                        <h5 className="mb-0 font-semibold flex items-center gap-2"><UserCircle className="text-blue-500"/> Student Deep Profile</h5>
                        {dashboardData.readinessScore > 75 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium shadow-sm" style={{ backgroundColor: '#22c55e', color: 'white' }}>⭐ High Potential</span>
                        ) : dashboardData.readinessScore < 50 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">⚠️ At Risk</span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-gray-900">Tracking</span>
                        )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                           <h3 className="font-bold text-white text-xl mb-1">{dashboardData.student.name}</h3>
                           <p className="text-gray-400 text-sm mb-0">{dashboardData.student.email} • {dashboardData.student.branch || "Information Technology"}</p>
                         </div>
                         <div className="text-right">
                            <h4 className="text-white mb-0 text-xl">8.5 <span className="text-gray-500 text-sm">GPA</span></h4>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                         <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                            <small className="text-gray-400 block mb-1">Portfolio Stats</small>
                            <div className="flex gap-3">
                                <span className="text-white font-semibold text-sm flex items-center gap-1"><Briefcase size={14} className="text-blue-500"/> {dashboardData.student.projectCount} Projects</span>
                                <span className="text-white font-semibold text-sm flex items-center gap-1"><CheckCircle size={14} style={{ color: '#4ade80' }}/> {dashboardData.student.certCount} Certs</span>
                            </div>
                         </div>
                         <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                            <small className="text-gray-400 block mb-1">System Status</small>
                            <div className="flex flex-col gap-1">
                                <span className="text-white text-xs">Resume: <span style={{ color: '#4ade80' }}>Generated ✓</span></span>
                                <span className="text-white text-xs">Last Active: <span className="text-cyan-400">2 days ago</span></span>
                            </div>
                         </div>
                      </div>

                      <div>
                        <small className="text-gray-500 block mb-2 font-bold text-xs uppercase tracking-wider">Core Tech Stack</small>
                        <div className="flex flex-wrap gap-2">
                          {(dashboardData.student.topSkills || [])
                            .flatMap(skill => typeof skill === 'string' ? skill.split(',').map(s => s.trim()) : [skill])
                            .filter(Boolean)
                            .map((skill, sdx) => (
                              <span key={sdx} className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900 border border-gray-600 text-cyan-400 shadow-sm">
                                {skill}
                              </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score & Progress Tracking Card */}
                  <div className="theme-card">
                    <div className="p-4 text-center">
                      <h5 className="text-gray-400 mb-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                          <TrendingUp className="text-yellow-500" size={18}/> Placement Readiness Progress
                      </h5>
                      
                      {(() => {
                          const score = dashboardData.readinessScore;
                          const isAtRisk = score < 50;
                          const isModerate = score >= 50 && score < 75;
                          const scoreClass = isAtRisk ? 'text-red-500' : isModerate ? 'text-yellow-500' : '';
                          const scoreStyle = (!isAtRisk && !isModerate) ? { color: '#4ade80', textShadow: '0 0 20px rgba(74, 222, 128, 0.4)' } : {};
                          const progressColor = isAtRisk ? 'bg-red-500' : isModerate ? 'bg-yellow-500' : '';
                          const progressStyle = (!isAtRisk && !isModerate) ? { backgroundColor: '#22c55e' } : {};
                          
                          return (
                              <>
                                  <div className="flex justify-center items-center gap-4 mb-4">
                                     <div className={`text-5xl font-bold ${scoreClass}`} style={scoreStyle}>
                                         {score}%
                                     </div>
                                     <div className="text-left">
                                         {dashboardData.progressTrend?.trend === 'up' && (
                                            <div className="px-3 py-1.5 rounded-full text-xs font-medium mb-2 inline-block" style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                                                <TrendingUp size={14} className="inline mr-1"/> Trending Up (+{score - (dashboardData.progressTrend?.previousScore || 0)}%)
                                            </div>
                                         )}
                                         <p className="text-gray-400 text-xs mb-0 max-w-xs">Score computed mathematically based on specific skill gaps against target role.</p>
                                     </div>
                                  </div>

                                  <div className="w-full bg-gray-900/50 rounded-full mb-4" style={{ height: "12px" }}>
                                      <div 
                                          className={`rounded-full ${progressColor} h-full`}
                                          style={{ width: `${score}%`, ...progressStyle, transition: 'width 0.5s ease' }}
                                      ></div>
                                  </div>

                                  <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                                      <div className="flex items-center gap-3 flex-wrap">
                                          <label className="text-gray-400 font-bold text-xs uppercase">Target Role:</label>
                                          <select 
                                              className="bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:border-blue-500"
                                              value={targetRole || dashboardData.roleMatch}
                                              onChange={handleRoleChange}
                                              style={{ minWidth: '200px', cursor: 'pointer' }}
                                          >
                                              <option value="" disabled>--- Detected Match ---</option>
                                              <option value={dashboardData.roleMatch}>{dashboardData.roleMatch} {targetRole ? '' : '(Auto-Matched)'}</option>
                                              <option value="" disabled>--- Manual Override ---</option>
                                              <option value="SDE">SDE (Software Development Engineer)</option>
                                              <option value="Frontend Developer">Frontend Engineer</option>
                                              <option value="Backend Developer">Backend Engineer</option>
                                              <option value="Full Stack Developer">Full Stack Engineer</option>
                                              <option value="Data Analyst">Data Analyst</option>
                                              <option value="Data Engineer">Data Engineer</option>
                                              <option value="DevOps">DevOps Engineer</option>
                                              <option value="Cloud Architect">Cloud Architect</option>
                                              <option value="Product Manager">Product Manager</option>
                                          </select>
                                      </div>
                                      
                                      {isAtRisk ? (
                                          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white flex items-center gap-1"><AlertCircle size={14}/>Intervention Needed</span>
                                      ) : isModerate ? (
                                          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-500 text-gray-900 flex items-center gap-1"><Clock size={14}/>Developing</span>
                                      ) : (
                                          <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#22c55e', color: 'white' }}><CheckCircle size={14} className="inline mr-1"/>Ready</span>
                                      )}
                                  </div>
                              </>
                          )
                      })()}
                    </div>
                  </div>

                </div>

                {/* Right Column: Gap Analysis */}
                <div className="lg:col-span-5">
                  <div className="theme-card h-full flex flex-col">
                    <div className="theme-card-header px-4 py-3 flex items-center gap-2">
                      <TrendingUp className="text-cyan-400" size={20}/>
                      <h5 className="mb-0 font-semibold">Gap Analysis Insights</h5>
                    </div>
                    <div className="p-4 flex-1">
                      
                      <div className="bg-gray-900/50 border border-cyan-800 text-gray-400 p-3 rounded-lg mb-4 text-sm">
                          <strong className="text-cyan-400 block mb-1">AI Diagnostic Context:</strong>
                          {dashboardData.aiExplanation}
                      </div>

                      <h6 className="text-gray-500 font-bold text-xs uppercase mb-3 tracking-wider">
                         Prioritized Skills Gap
                      </h6>
                      {dashboardData.missingSkills.length > 0 ? (
                        <div className="flex flex-col gap-2 mb-4">
                          {dashboardData.missingSkills.map((gapObj, index) => {
                              const isHighPriority = gapObj.priority === 'HIGH';
                              const isMedPriority = gapObj.priority === 'MEDIUM';
                              const badgeColor = isHighPriority ? 'bg-red-500' : isMedPriority ? 'bg-yellow-500 text-gray-900' : 'bg-gray-500 text-white';
                              
                              return (
                                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                                      <span className="font-semibold text-sm text-white flex items-center gap-2"><AlertCircle size={14} className="text-gray-500"/>{gapObj.skill}</span>
                                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                                          {gapObj.priority}
                                      </span>
                                  </div>
                              );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-900/50 border border-green-700 rounded-lg mb-4 text-center">
                            <p className="text-green-500 font-bold m-0 text-sm"><CheckCircle size={18} className="inline mr-2"/> No critical skill gaps identified.</p>
                        </div>
                      )}

                      <hr className="border-gray-700/50 my-4" />

                      <h6 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm"><Sparkles size={16}/> AI Recommendations</h6>
                      {dashboardData.recommendations.length > 0 ? (
                        <ul className="list-none m-0 p-0 space-y-2">
                          {dashboardData.recommendations.map((rec, index) => (
                            <li key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 flex items-start text-gray-400 text-sm">
                              <div className="text-cyan-400 mr-2 mt-0.5">•</div> 
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Student is currently tracking well against targets.</p>
                      )}

                    </div>
                  </div>
                </div>
                
              </div>

              {/* Bottom Section: Intervention & Feedback */}
              <div className="theme-card overflow-hidden mb-4">
                  <div className="theme-card-header px-4 py-3 flex items-center justify-between">
                      <h5 className="mb-0 font-semibold flex items-center gap-2"><Flag className="text-yellow-500" size={20}/> Intervention & Feedback Loop</h5>
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900 text-gray-500 border border-gray-700">Continuous Monitoring Active</span>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row">
                      
                      {/* LEFT: Assignment Form */}
                      <div className="w-full lg:w-1/3 p-4 bg-gray-900/30 border-b lg:border-b-0 lg:border-r border-gray-700/50">
                          <h6 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Assign New Task</h6>
                          <form onSubmit={handleAddAction} className="space-y-3">
                              <div>
                                  <label className="text-gray-400 text-xs block mb-1">Actionable Task</label>
                                  <input
                                    type="text"
                                    className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                                    placeholder="e.g. Complete DSA Sheet - Arrays"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    required
                                  />
                              </div>
                              <div>
                                  <label className="text-gray-400 text-xs block mb-1">Target Deadline</label>
                                  <input
                                    type="date"
                                    className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="text-gray-400 text-xs block mb-1">Priority Level</label>
                                  <select 
                                      className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500"
                                      value={priority}
                                      onChange={(e) => setPriority(e.target.value)}
                                  >
                                      <option value="LOW">Low Priority</option>
                                      <option value="MEDIUM">Medium Priority</option>
                                      <option value="HIGH">High Priority</option>
                                  </select>
                              </div>
                              <button type="submit" className="theme-btn theme-btn-primary w-full justify-center">
                                  <CheckCircle2 size={18}/> Assign Task
                              </button>
                          </form>
                      </div>

                      {/* RIGHT: Interactive Timeline & Feedback Loop */}
                      <div className="w-full lg:w-2/3 p-4">
                          <h6 className="text-white font-bold mb-4 text-xs uppercase tracking-wider flex justify-between items-center">
                              <span>Intervention Timeline History</span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-500">{timeline.length} Total</span>
                          </h6>

                          <div className="space-y-2 pr-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                              {timeline.length === 0 ? (
                                  <div className="text-center py-8 bg-gray-900/50 rounded-xl border border-gray-700/50 border-dashed">
                                      <CalendarDays size={48} className="text-gray-500 mb-3 mx-auto opacity-50"/>
                                      <h5 className="text-gray-500">No interventions active</h5>
                                      <p className="text-gray-600 text-sm">Assign a task to start the feedback loop.</p>
                                  </div>
                              ) : (
                                  timeline.map(item => {
                                      const today = new Date();
                                      today.setHours(0,0,0,0);
                                      let isOverdue = false;
                                      if (item.deadline && item.status === 'pending') {
                                          const dl = new Date(item.deadline);
                                          dl.setHours(0,0,0,0);
                                          isOverdue = dl < today;
                                      }
                                      
                                      const isDone = item.status === 'completed';
                                      
                                      let statusBadge, borderClass, icon;
                                      if (isDone) {
                                          statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}>Completed</span>;
                                          borderClass = "border-green-700";
                                          icon = <CheckCircle2 size={20} style={{ color: '#4ade80' }}/>;
                                      } else if (isOverdue) {
                                          statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-800">Missed / Overdue</span>;
                                          borderClass = "border-red-800";
                                          icon = <AlertCircle size={20} className="text-red-500"/>;
                                      } else {
                                          statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-700">Pending Action</span>;
                                          borderClass = "border-yellow-700";
                                          icon = <Clock size={20} className="text-yellow-500"/>;
                                      }

                                      const priorityColor = item.priority === 'HIGH' ? 'text-red-500' : item.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-cyan-400';

                                      return (
                                          <div key={item.id} className={`theme-card border ${borderClass}`}>
                                              <div className="px-4 py-3 flex justify-between items-center">
                                                  <div className="flex items-center gap-3">
                                                      {icon}
                                                      <div>
                                                          <h6 className={`text-sm font-bold mb-0 ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                                                              {item.taskName}
                                                          </h6>
                                                          <div className="flex gap-3 text-gray-500 text-xs mt-1">
                                                              <span className={priorityColor}>{item.priority || 'MEDIUM'} Priority</span>
                                                              {item.deadline && <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>}
                                                              <span>Assigned: {new Date(item.createdAt).toLocaleDateString()}</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div>{statusBadge}</div>
                                              </div>
                                              
                                              {/* Feedback Loop Body */}
                                              <div className="p-3 bg-gray-900/30 border-t border-gray-700/50">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                                          <label className="text-cyan-400 text-xs font-bold block mb-2 flex items-center gap-1"><UserCircle size={14}/> Student Note / Proof</label>
                                                          <p className="text-gray-400 text-xs mb-0 italic">
                                                              {item.studentNote ? `"${item.studentNote}"` : "Waiting for student to submit proof/notes..."}
                                                          </p>
                                                      </div>
                                                      <div className="p-3 rounded-lg bg-blue-900/10 border border-blue-800/25">
                                                          <label className="text-blue-400 text-xs font-bold block mb-2 flex items-center gap-1"><MessageSquare size={14}/> Mentor Feedback</label>
                                                          <textarea 
                                                              className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg p-2 text-xs shadow-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                                                              style={{resize: 'none'}}
                                                              rows="2"
                                                              placeholder="Add constructive feedback..."
                                                              defaultValue={item.mentorFeedback || ""}
                                                              onBlur={(e) => handleUpdateFeedback(item.id, undefined, e.target.value)}
                                                          ></textarea>
                                                          
                                                          {!isDone && (
                                                              <button 
                                                                className="w-full mt-2 px-3 py-1.5 rounded-full text-xs font-medium border border-green-600 text-green-500 hover:bg-green-600 hover:text-white transition-all"
                                                                onClick={() => handleUpdateFeedback(item.id, 'completed', undefined)}
                                                              >
                                                                  Mark as Completed
                                                              </button>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      )
                                  })
                              )}
                          </div>
                      </div>
                  </div>
              </div>
            </>
          )}
        </div>

      </div>
      </div>
    </div>
  );
}

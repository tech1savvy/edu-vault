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

  // Form states for adding action
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
      setTargetRole(""); // Reset local role on student change
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
    return <div className="container mt-5 text-center"><div className="spinner-border text-primary" /></div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger text-center">{error}</div>;
  }

  return (
    <div className="container-fluid py-5 bg-dark text-white min-vh-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h2 className="mb-4 text-center fw-bold text-light">
        <Sparkles className="text-primary me-2" size={28}/> Mentor Analytics Interface
      </h2>

      <div className="row h-100 g-4 mx-2">
        {/* Left Panel: Student List */}
        <div className="col-md-3">
          <div className="card bg-secondary border-0 shadow-lg rounded-4 mb-3 h-100">
            <div className="card-header bg-black text-white py-3 rounded-top-4 d-flex align-items-center">
              <Search className="me-2 text-info" size={20}/>
              <h5 className="mb-0">Mentees Roster</h5>
            </div>
            <div className="list-group list-group-flush bg-secondary" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
              {students.length === 0 && (
                <div className="p-3 text-white-50 text-center">No students available.</div>
              )}
              {students.map((student) => (
                <button
                  key={student.id}
                  className={`list-group-item list-group-item-action border-dark ${
                    selectedStudent?.id === student.id ? "active bg-primary border-primary text-white" : "bg-dark text-white-50 hover-bg-secondary"
                  }`}
                  onClick={() => handleSelectStudent(student)}
                  style={{ transition: 'all 0.2s' }}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <strong className="mb-1">{student.name}</strong>
                    <small>ID: {student.id}</small>
                  </div>
                  <small>{student.email}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="col-md-9">
          {!selectedStudent ? (
            // ==========================================
            // DEFAULT AGGREGATE COHORT DASHBOARD
            // ==========================================
            <div className="card bg-secondary border-0 shadow-lg rounded-4 h-100 p-5">
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-dark">
                    <TrendingUp className="text-primary me-3" size={32}/>
                    <h3 className="text-white fw-bold mb-0">Aggregate Cohort Overview</h3>
                </div>
                
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card bg-dark border-0 p-4 rounded-4 shadow-sm h-100 text-center position-relative overflow-hidden">
                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25 bg-gradient-primary"></div>
                            <p className="text-white-50 mb-2 fw-bold text-uppercase" style={{letterSpacing: '1px'}}>Total Mentees</p>
                            <h1 className="text-white m-0 display-4 fw-bold">{students.length}</h1>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-dark border-0 p-4 rounded-4 shadow-sm h-100 text-center">
                            <p className="text-white-50 mb-2 fw-bold text-uppercase" style={{letterSpacing: '1px'}}>Avg. Readiness</p>
                            <h1 className="m-0 display-4 fw-bold" style={{ color: '#4ade80' }}>72%</h1>
                            <small className="mt-1" style={{ color: '#4ade80' }}><ArrowUpRight size={14}/> +5% this month</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-dark border-0 p-4 rounded-4 shadow-sm h-100 text-center">
                            <p className="text-white-50 mb-2 fw-bold text-uppercase" style={{letterSpacing: '1px'}}>Interventions</p>
                            <h1 className="text-warning m-0 display-4 fw-bold">14</h1>
                            <small className="text-white-50 mt-1">Pending tasks</small>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card bg-dark border-0 p-4 rounded-4 shadow-sm h-100">
                             <h5 className="text-white mb-4 d-flex align-items-center">
                                 <AlertCircle className="text-danger me-2" size={20}/> At-Risk Mentees
                             </h5>
                             <ul className="list-unstyled m-0">
                                <li className="mb-3 d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary">
                                    <span className="text-white-50">Student 1</span>
                                    <span className="badge bg-danger rounded-pill px-3 py-1">33% Ready</span>
                                </li>
                                <li className="mb-3 d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary">
                                    <span className="text-white-50">Sneha Kulkarni</span>
                                    <span className="badge bg-warning text-dark rounded-pill px-3 py-1">Missing Milestones</span>
                                </li>
                                <li className="d-flex justify-content-between align-items-center">
                                    <span className="text-white-50">Alex Johnson</span>
                                    <span className="badge bg-danger rounded-pill px-3 py-1">Low Engagement</span>
                                </li>
                             </ul>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card bg-dark border-0 p-4 rounded-4 shadow-sm h-100">
                             <h5 className="text-white mb-4 d-flex align-items-center">
                                 <TrendingUp className="text-info me-2" size={20}/> Top Skill Gaps (Global)
                             </h5>
                             <div className="mb-3">
                                 <div className="d-flex justify-content-between text-white-50 small mb-1"><span>System Design</span><span>65% missing</span></div>
                                 <div className="progress bg-secondary" style={{height: '6px'}}><div className="progress-bar bg-danger" style={{width: '65%'}}></div></div>
                             </div>
                             <div className="mb-3">
                                 <div className="d-flex justify-content-between text-white-50 small mb-1"><span>AWS / Cloud</span><span>42% missing</span></div>
                                 <div className="progress bg-secondary" style={{height: '6px'}}><div className="progress-bar bg-warning" style={{width: '42%'}}></div></div>
                             </div>
                             <div className="mb-0">
                                 <div className="d-flex justify-content-between text-white-50 small mb-1"><span>Data Structures</span><span>28% missing</span></div>
                                 <div className="progress bg-secondary" style={{height: '6px'}}><div className="progress-bar bg-info" style={{width: '28%'}}></div></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          ) : !dashboardData ? (
            <div className="text-center mt-5 text-white-50">
              <div className="spinner-border text-primary shadow" role="status"></div>
              <p className="mt-3 fs-5">Analyzing profile against industry benchmarks...</p>
            </div>
          ) : (
            <>
              {/* ========================================== */}
              {/* TOP SECTION: PROFILE & GAP ANALYSIS        */}
              {/* ========================================== */}
              <div className="row g-4 mb-4">
                
                {/* Center Column: Profile & Progress */}
                <div className="col-lg-7">
                  
                  {/* DEEP PROFILE CARD */}
                  <div className="card bg-secondary border-0 rounded-4 mb-4 shadow-lg overflow-hidden">
                    <div className="card-header bg-black text-white py-3 border-0 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 d-flex align-items-center"><UserCircle className="me-2 text-primary"/> Student Deep Profile</h5>
                        {dashboardData.readinessScore > 75 ? (
                            <span className="badge shadow-sm" style={{ backgroundColor: '#22c55e', color: 'white' }}>⭐ High Potential</span>
                        ) : dashboardData.readinessScore < 50 ? (
                            <span className="badge bg-danger shadow-sm">⚠️ At Risk</span>
                        ) : (
                            <span className="badge bg-warning text-dark shadow-sm">Tracking</span>
                        )}
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                         <div>
                           <h3 className="fw-bold text-white mb-1">{dashboardData.student.name}</h3>
                           <p className="text-white-50 mb-0">{dashboardData.student.email} • {dashboardData.student.branch || "Information Technology"}</p>
                         </div>
                         <div className="text-end">
                            <h4 className="text-white mb-0">8.5 <span className="text-secondary fs-6">GPA</span></h4>
                         </div>
                      </div>

                      <div className="row g-3 mb-4">
                         <div className="col-sm-6">
                            <div className="p-3 bg-dark rounded-3 border border-secondary h-100">
                                <small className="text-white-50 d-block mb-1">Portfolio Stats</small>
                                <div className="d-flex gap-3">
                                    <span className="text-white fw-bold"><Briefcase size={16} className="text-primary me-1"/> {dashboardData.student.projectCount} Projects</span>
                                    <span className="text-white fw-bold"><CheckCircle size={16} className="me-1" style={{ color: '#4ade80' }}/> {dashboardData.student.certCount} Certs</span>
                                </div>
                            </div>
                         </div>
                         <div className="col-sm-6">
                            <div className="p-3 bg-dark rounded-3 border border-secondary h-100">
                                <small className="text-white-50 d-block mb-1">System Status</small>
                                <div className="d-flex flex-column gap-1">
                                    <span className="text-white small">Resume: <span style={{ color: '#4ade80' }}>Generated ✅</span></span>
                                    <span className="text-white small">Last Active: <span className="text-info">2 days ago</span></span>
                                </div>
                            </div>
                         </div>
                      </div>

                      <div>
                        <small className="text-muted d-block mb-2 fw-bold text-uppercase" style={{letterSpacing: '1px'}}>Core Tech Stack</small>
                        <div className="d-flex flex-wrap gap-2">
                          {(dashboardData.student.topSkills || [])
                            .flatMap(skill => typeof skill === 'string' ? skill.split(',').map(s => s.trim()) : [skill])
                            .filter(Boolean)
                            .map((skill, sdx) => (
                              <span key={sdx} className="badge bg-dark border border-secondary text-info px-3 py-2 rounded-pill shadow-sm">
                                {skill}
                              </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SCORE & PROGRESS TRACKING CARD */}
                  <div className="card bg-secondary border-0 rounded-4 shadow-lg">
                    <div className="card-body p-4 text-center">
                      <h5 className="text-white-50 mb-4 fw-bold text-uppercase d-flex align-items-center justify-content-center" style={{letterSpacing: '1px'}}>
                          <TrendingUp className="me-2 text-warning" size={18}/> Placement Readiness Progress
                      </h5>
                      
                      {(() => {
                          const score = dashboardData.readinessScore;
                          const isAtRisk = score < 50;
                          const isModerate = score >= 50 && score < 75;
                          const scoreClass = isAtRisk ? 'text-danger' : isModerate ? 'text-warning' : '';
                          const scoreStyle = (!isAtRisk && !isModerate) ? { color: '#4ade80', textShadow: '0 0 20px rgba(74, 222, 128, 0.4)' } : { textShadow: '0 0 20px rgba(0,0,0,0.5)' };
                          const progressColor = isAtRisk ? 'bg-danger' : isModerate ? 'bg-warning' : '';
                          const progressStyle = (!isAtRisk && !isModerate) ? { backgroundColor: '#22c55e' } : {};
                          
                          return (
                              <>
                                  <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
                                     <div className={`display-1 fw-bold ${scoreClass}`} style={scoreStyle}>
                                         {score}%
                                     </div>
                                     <div className="text-start">
                                         {dashboardData.progressTrend?.trend === 'up' && (
                                            <div className="badge rounded-pill px-3 py-2 mb-2 d-inline-block" style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                                                <TrendingUp size={14} className="me-1"/> Trending Up (+{score - (dashboardData.progressTrend?.previousScore || 0)}%)
                                            </div>
                                         )}
                                         <p className="text-white-50 small mb-0 w-75">Score computed mathematically based on specific skill gaps against target role.</p>
                                     </div>
                                  </div>

                                  <div className="progress bg-dark mb-4 shadow-inner" style={{ height: "12px", borderRadius: "10px" }}>
                                      <div 
                                          className={`progress-bar ${progressColor} progress-bar-striped progress-bar-animated`} 
                                          style={{ width: `${score}%`, ...progressStyle }}
                                      ></div>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center bg-dark p-3 rounded-3 border border-secondary">
                                      <div className="d-flex align-items-center">
                                          <label className="text-white-50 fw-bold me-3 text-uppercase small">Target Role:</label>
                                          <select 
                                              className="form-select bg-black text-white border-secondary shadow-sm"
                                              value={targetRole || dashboardData.roleMatch}
                                              onChange={handleRoleChange}
                                              style={{ width: '220px', cursor: 'pointer' }}
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
                                          <span className="badge bg-danger rounded-pill px-3 py-2 shadow-sm"><AlertCircle size={14} className="me-1"/>Intervention Needed</span>
                                      ) : isModerate ? (
                                          <span className="badge bg-warning text-dark rounded-pill px-3 py-2 shadow-sm"><Clock size={14} className="me-1"/>Developing</span>
                                      ) : (
                                          <span className="badge rounded-pill px-3 py-2 shadow-sm" style={{ backgroundColor: '#22c55e', color: 'white' }}><CheckCircle size={14} className="me-1"/>Ready</span>
                                      )}
                                  </div>
                              </>
                          )
                      })()}
                    </div>
                  </div>

                </div>

                {/* Right Column: Gap Analysis */}
                <div className="col-lg-5">
                  <div className="card bg-secondary border-0 rounded-4 shadow-lg h-100">
                    <div className="card-header bg-black py-3 rounded-top-4 d-flex align-items-center border-0">
                      <TrendingUp className="me-2 text-info" size={20}/>
                      <h5 className="mb-0">Gap Analysis Insights</h5>
                    </div>
                    <div className="card-body p-4">
                      
                      <div className="alert bg-dark border-info text-white-50 p-3 rounded-3 shadow-inner mb-4">
                          <strong className="text-info d-block mb-1">🤖 AI Diagnostic Context:</strong>
                          {dashboardData.aiExplanation}
                      </div>

                      <h6 className="text-secondary fw-bold text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                         Prioritized Skills Gap
                      </h6>
                      {dashboardData.missingSkills.length > 0 ? (
                        <div className="d-flex flex-column gap-2 mb-4">
                          {dashboardData.missingSkills.map((gapObj, index) => {
                              const isHighPriority = gapObj.priority === 'HIGH';
                              const isMedPriority = gapObj.priority === 'MEDIUM';
                              const badgeColor = isHighPriority ? 'bg-danger' : isMedPriority ? 'bg-warning text-dark' : 'bg-secondary text-white';
                              
                              return (
                                  <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-dark border border-secondary shadow-sm">
                                      <span className="fw-bold text-white"><AlertCircle size={16} className="me-2 text-white-50"/>{gapObj.skill}</span>
                                      <span className={`badge rounded-pill px-3 py-1 ${badgeColor}`}>
                                          {gapObj.priority}
                                      </span>
                                  </div>
                              );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 bg-dark rounded-3 border border-success mb-4 text-center">
                            <p className="text-success fw-bold m-0"><CheckCircle size={18} className="me-2"/> No critical skill gaps identified.</p>
                        </div>
                      )}

                      <hr className="border-dark my-4" />

                      <h6 className="text-info fw-bold mb-3 d-flex align-items-center"><Sparkles size={16} className="me-2"/> AI Recommendations</h6>
                      {dashboardData.recommendations.length > 0 ? (
                        <ul className="list-unstyled m-0">
                          {dashboardData.recommendations.map((rec, index) => (
                            <li key={index} className="mb-2 p-3 bg-dark rounded-3 shadow-sm border border-secondary d-flex align-items-start text-white-50">
                              <div className="text-info me-3 mt-1">•</div> 
                              <span className="lh-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white-50">Student is currently tracking well against targets.</p>
                      )}

                    </div>
                  </div>
                </div>
                
              </div>

              {/* ========================================== */}
              {/* BOTTOM SECTION: INTERVENTION & FEEDBACK    */}
              {/* ========================================== */}
              <div className="row">
                  <div className="col-12">
                      <div className="card bg-secondary border-0 rounded-4 shadow-lg mb-4 overflow-hidden">
                          <div className="card-header bg-black text-white py-3 border-0 d-flex align-items-center justify-content-between">
                              <h5 className="mb-0 d-flex align-items-center"><Flag className="me-2 text-warning" size={20}/> Intervention & Feedback Loop</h5>
                              <span className="badge bg-dark text-white-50 border border-secondary px-3 py-2 rounded-pill">Continuous Monitoring Active</span>
                          </div>
                          
                          <div className="card-body p-0">
                              <div className="row g-0">
                                  
                                  {/* LEFT: Assignment Form */}
                                  <div className="col-md-4 p-4 bg-dark border-end border-secondary">
                                      <h6 className="text-white fw-bold mb-4 text-uppercase" style={{letterSpacing:'1px'}}>Assign New Task</h6>
                                      <form onSubmit={handleAddAction}>
                                          <div className="mb-3">
                                              <label className="form-label text-white-50 small">Actionable Task</label>
                                              <input
                                                type="text"
                                                className="form-control bg-black text-white border-secondary shadow-sm"
                                                placeholder="e.g. Complete DSA Sheet - Arrays"
                                                value={taskName}
                                                onChange={(e) => setTaskName(e.target.value)}
                                                required
                                              />
                                          </div>
                                          <div className="mb-3">
                                              <label className="form-label text-white-50 small">Target Deadline</label>
                                              <input
                                                type="date"
                                                className="form-control bg-black text-white border-secondary shadow-sm"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                              />
                                          </div>
                                          <div className="mb-4">
                                              <label className="form-label text-white-50 small">Priority Level</label>
                                              <select 
                                                  className="form-select bg-black text-white border-secondary shadow-sm"
                                                  value={priority}
                                                  onChange={(e) => setPriority(e.target.value)}
                                              >
                                                  <option value="LOW">Low Priority</option>
                                                  <option value="MEDIUM">Medium Priority</option>
                                                  <option value="HIGH">High Priority 🚨</option>
                                              </select>
                                          </div>
                                          <button type="submit" className="btn btn-primary w-100 fw-bold shadow p-2">
                                              <CheckCircle2 size={18} className="me-2"/> Assign Task
                                          </button>
                                      </form>
                                  </div>

                                  {/* RIGHT: Interactive Timeline & Feedback Loop */}
                                  <div className="col-md-8 p-4">
                                      <h6 className="text-white fw-bold mb-4 text-uppercase d-flex justify-content-between" style={{letterSpacing:'1px'}}>
                                          <span>Intervention Timeline History</span>
                                          <span className="badge bg-dark text-white-50 fw-normal">{timeline.length} Total</span>
                                      </h6>

                                      <div className="timeline-container pe-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                          {timeline.length === 0 ? (
                                              <div className="text-center py-5 bg-dark rounded-4 border border-secondary border-dashed">
                                                  <CalendarDays size={48} className="text-white-50 mb-3 mx-auto opacity-50"/>
                                                  <h5 className="text-white-50">No interventions active</h5>
                                                  <p className="text-muted small">Assign a task to start the feedback loop.</p>
                                              </div>
                                          ) : (
                                              timeline.map(item => {
                                                  const today = new Date();
                                                  // Strip time for accurate date comparison
                                                  today.setHours(0,0,0,0);
                                                  let isOverdue = false;
                                                  if (item.deadline && item.status === 'pending') {
                                                      const dl = new Date(item.deadline);
                                                      dl.setHours(0,0,0,0);
                                                      isOverdue = dl < today;
                                                  }
                                                  
                                                  const isDone = item.status === 'completed';
                                                  
                                                  // Determine Status UI
                                                  let statusBadge, borderClass, bgClass, icon;
                                                  if (isDone) {
                                                      statusBadge = <span className="badge rounded-pill px-3 py-1 border" style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}>Completed</span>;
                                                      borderClass = "border-success";
                                                      bgClass = "bg-dark opacity-75";
                                                      icon = <CheckCircle2 size={24} style={{ color: '#4ade80' }}/>;
                                                  } else if (isOverdue) {
                                                      statusBadge = <span className="badge bg-danger bg-opacity-25 text-danger rounded-pill px-3 py-1 border border-danger border-opacity-25">Missed / Overdue</span>;
                                                      borderClass = "border-danger";
                                                      bgClass = "bg-black";
                                                      icon = <AlertCircle size={24} className="text-danger"/>;
                                                  } else {
                                                      statusBadge = <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill px-3 py-1 border border-warning border-opacity-25">Pending Action</span>;
                                                      borderClass = "border-warning border-opacity-50";
                                                      bgClass = "bg-dark";
                                                      icon = <Clock size={24} className="text-warning"/>;
                                                  }

                                                  const priorityColor = item.priority === 'HIGH' ? 'text-danger' : item.priority === 'MEDIUM' ? 'text-warning' : 'text-info';

                                                  return (
                                                      <div key={item.id} className={`card ${bgClass} border ${borderClass} shadow-sm mb-3 rounded-4 overflow-hidden`}>
                                                          {/* Task Header */}
                                                          <div className="card-header bg-transparent border-secondary p-3 d-flex justify-content-between align-items-center">
                                                              <div className="d-flex align-items-center gap-3">
                                                                  {icon}
                                                                  <div>
                                                                      <h6 className={`mb-1 fw-bold ${isDone ? 'text-white-50 text-decoration-line-through' : 'text-white'}`}>
                                                                          {item.taskName}
                                                                      </h6>
                                                                      <div className="d-flex gap-3 text-muted small">
                                                                          <span className={priorityColor}>{item.priority || 'MEDIUM'} Priority</span>
                                                                          {item.deadline && <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>}
                                                                          <span>Assigned: {new Date(item.createdAt).toLocaleDateString()}</span>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <div>{statusBadge}</div>
                                                          </div>
                                                          
                                                          {/* Feedback Loop Body */}
                                                          <div className="card-body p-3 bg-black bg-opacity-25">
                                                              <div className="row g-3">
                                                                  {/* Student Input */}
                                                                  <div className="col-md-6">
                                                                      <div className="p-3 rounded-3 bg-secondary bg-opacity-25 border border-secondary h-100">
                                                                          <label className="text-info small fw-bold d-block mb-2"><UserCircle size={14} className="me-1"/> Student Note / Proof</label>
                                                                          <p className="text-white-50 small mb-0 fst-italic">
                                                                              {item.studentNote ? `"${item.studentNote}"` : "Waiting for student to submit proof/notes..."}
                                                                          </p>
                                                                      </div>
                                                                  </div>
                                                                  {/* Mentor Feedback Edit */}
                                                                  <div className="col-md-6">
                                                                      <div className="p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 h-100">
                                                                          <label className="text-primary small fw-bold d-block mb-2"><MessageSquare size={14} className="me-1"/> Mentor Feedback</label>
                                                                          <textarea 
                                                                              className="form-control bg-dark text-white border-secondary small py-1" 
                                                                              style={{fontSize: '0.85rem', resize: 'none'}}
                                                                              rows="2"
                                                                              placeholder="Add constructive feedback..."
                                                                              defaultValue={item.mentorFeedback || ""}
                                                                              onBlur={(e) => handleUpdateFeedback(item.id, undefined, e.target.value)}
                                                                          ></textarea>
                                                                          
                                                                          {!isDone && (
                                                                              <button 
                                                                                className="btn btn-sm btn-outline-success w-100 mt-2 py-1 rounded-pill"
                                                                                onClick={() => handleUpdateFeedback(item.id, 'completed', undefined)}
                                                                              >
                                                                                  Mark as Completed
                                                                              </button>
                                                                          )}
                                                                      </div>
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
                      </div>
                  </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

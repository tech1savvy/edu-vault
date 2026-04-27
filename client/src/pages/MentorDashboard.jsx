import React, { useState, useEffect } from "react";
import {
  getMentorStudents,
  getStudentDashboardData,
  addMentoringAction,
  getMentoringTimeline,
} from "../services/api";
import { AlertCircle, Clock, CheckCircle, Search, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export default function MentorDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
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
    } catch (err) {
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
    } catch (err) {
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
    } catch(err) {
      alert("Error updating target role analysis");
    }
  };

  const handleAddAction = async (e) => {
    e.preventDefault();
    if (!taskName) return;
    try {
      await addMentoringAction(selectedStudent.id, taskName, deadline);
      const tlRes = await getMentoringTimeline(selectedStudent.id);
      setTimeline(tlRes.data);
      setTaskName("");
      setDeadline("");
    } catch (err) {
      alert("Failed to add action.");
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center"><div className="spinner-border text-primary" /></div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger text-center">{error}</div>;
  }

  return (
    <div className="container-fluid py-5 bg-dark text-white min-vh-100">
      <h2 className="mb-4 text-center fw-bold">🎓 Mentor Analytics Interface</h2>

      <div className="row h-100 g-4 mx-2">
        {/* Left Panel: Student List */}
        <div className="col-md-3">
          <div className="card bg-secondary border-0 shadow-lg rounded-4 mb-3 h-100">
            <div className="card-header bg-black text-white py-3 rounded-top-4 d-flex align-items-center">
              <Search className="me-2 text-info" size={20}/>
              <h5 className="mb-0">Mentees Roster</h5>
            </div>
            <div className="list-group list-group-flush bg-secondary" style={{ overflowY: 'auto', maxHeight: '75vh' }}>
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
            <div className="d-flex justify-content-center align-items-center h-100 text-white-50 bg-secondary rounded-4 shadow-lg border border-dark">
              <h4>Select a student to view their AI-driven insights</h4>
            </div>
          ) : !dashboardData ? (
            <div className="text-center mt-5 text-white-50">
              <div className="spinner-border text-primary shadow" role="status"></div>
              <p className="mt-3 fs-5">Analyzing profile against industry benchmarks...</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Center Panel: Student Overview Component */}
              <div className="col-lg-7">
                
                {/* VERY IMPORTANT PROFILE CONTEXT (Level 1) */}
                <div className="card bg-secondary border-0 rounded-4 mb-4 shadow-lg">
                  <div className="card-body p-4 position-relative">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                       <div>
                         <h2 className="fw-bold text-white mb-1">{dashboardData.student.name}</h2>
                         <p className="text-secondary mb-0">{dashboardData.student.email} • {dashboardData.student.branch}</p>
                       </div>
                       {dashboardData.readinessScore > 75 && (
                         <div className="badge bg-warning text-dark py-2 px-3 rounded-pill fw-bold shadow">
                           ⭐ High Potential Candidate
                         </div>
                       )}
                    </div>
                    <div className="row g-2 mt-2">
                       <div className="col-auto">
                         <span className="badge bg-dark border border-secondary text-white-50 px-3 py-2">
                            {dashboardData.student.projectCount} Projects
                         </span>
                       </div>
                       <div className="col-auto">
                         <span className="badge bg-dark border border-secondary text-white-50 px-3 py-2">
                            {dashboardData.student.certCount} Certifications
                         </span>
                       </div>
                       <div className="col-12 mt-2">
                         <small className="text-muted d-block mb-1">Top Frameworks/Skills:</small>
                         <div className="d-flex flex-wrap gap-2">
                            {(dashboardData.student.topSkills || [])
                              .flatMap(skill => typeof skill === 'string' ? skill.split(',').map(s => s.trim()) : [skill])
                              .filter(Boolean)
                              .map((skill, sdx) => (
                               <span key={sdx} className="badge bg-primary px-2 py-1 text-wrap text-start" style={{ lineHeight: '1.4', wordBreak: 'break-word' }}>
                                 {skill}
                               </span>
                            ))}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Score Card */}
                <div className="card bg-secondary border-0 rounded-4 mb-4 shadow-lg">
                  <div className="card-body text-center py-5 position-relative">
                    <h5 className="card-title text-white-50 mb-3 d-flex align-items-center justify-content-center">
                        <Sparkles className="me-2 text-warning" size={20}/> AI Readiness Benchmark
                    </h5>
                    
                    {(() => {
                        const score = dashboardData.readinessScore;
                        const isAtRisk = score < 50;
                        const isModerate = score >= 50 && score < 75;
                        const scoreColor = isAtRisk ? 'text-danger' : isModerate ? 'text-warning' : 'text-success';
                        
                        return (
                            <>
                                <div className="d-flex justify-content-center align-items-center gap-3">
                                   <div className={`display-1 fw-bold ${scoreColor}`}>
                                       {score}%
                                   </div>
                                   {dashboardData.progressTrend && (
                                     <div className="d-flex flex-column text-start ms-2">
                                        <small className="text-secondary mb-1">Past 30 Days</small>
                                        <span className={`badge ${dashboardData.progressTrend.trend === 'up' ? 'bg-success' : 'bg-danger'} px-2 py-1`}>
                                            {dashboardData.progressTrend.previousScore}% ➡️ {score}% {dashboardData.progressTrend.trend === 'up' ? '⬆️' : '⬇️'}
                                        </span>
                                     </div>
                                   )}
                                </div>
                                <div className="progress mx-auto mt-3 mb-4" style={{ height: "10px", width: "60%", backgroundColor: '#2b2b2b' }}>
                                    <div 
                                        className={`progress-bar ${isAtRisk ? 'bg-danger' : isModerate ? 'bg-warning' : 'bg-success'}`}
                                        role="progressbar" 
                                        style={{ width: `${score}%` }} 
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                  <span className="text-white-50 me-2">Target Role Analysis:</span>
                                  <select 
                                    className="form-select bg-dark text-primary fw-bold border-secondary w-auto" 
                                    value={targetRole || dashboardData.roleMatch}
                                    onChange={handleRoleChange}
                                  >
                                    <option value={dashboardData.roleMatch}>{dashboardData.roleMatch} (Auto-Matched)</option>
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
                                <div className="mt-2">
                                    {isAtRisk ? (
                                        <span className="badge bg-danger rounded-pill px-3 py-2"><AlertCircle size={16} className="me-1"/>At Risk (Intervention Needed)</span>
                                    ) : isModerate ? (
                                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2"><Clock size={16} className="me-1"/>Moderate Track</span>
                                    ) : (
                                        <span className="badge bg-success rounded-pill px-3 py-2"><CheckCircle size={16} className="me-1"/>Placement Ready</span>
                                    )}
                                </div>
                            </>
                        )
                    })()}
                  </div>
                </div>

                {/* Timeline / Action Items Component */}
                <div className="card bg-dark border-secondary rounded-4 shadow-lg mb-4">
                  <div className="card-header bg-black text-white py-3 rounded-top-4 d-flex align-items-center">
                    <CheckCircle2 className="me-2 text-primary" size={20}/>
                    <h5 className="mb-0">Intervention Timeline</h5>
                  </div>
                  <div className="card-body">
                    {/* Add Action Form */}
                    <form onSubmit={handleAddAction} className="mb-4 p-3 bg-secondary rounded-3 border border-dark shadow-sm">
                      <div className="row g-2">
                        <div className="col-sm-6">
                          <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Mentoring task (e.g., Complete AWS cert)"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-sm-4">
                          <input
                            type="date"
                            className="form-control bg-dark text-white border-secondary"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                          />
                        </div>
                        <div className="col-sm-2">
                          <button type="submit" className="btn btn-primary w-100 fw-bold shadow">Assign</button>
                        </div>
                      </div>
                    </form>

                    {/* Timeline List */}
                    <ul className="list-group list-group-flush bg-transparent rounded">
                      {timeline.length === 0 ? (
                        <p className="text-white-50 text-center py-3 m-0">No interventions assigned yet.</p>
                      ) : (
                        timeline.map(item => {
                          const today = new Date();
                          const isOverdue = item.deadline && item.status === 'pending' && new Date(item.deadline) < today;
                          
                          let timelineBadge;
                          if (item.status === 'completed') timelineBadge = <span className="badge bg-success rounded-pill px-3 py-2">Completed ✅</span>;
                          else if (isOverdue) timelineBadge = <span className="badge bg-danger rounded-pill px-3 py-2">Overdue ❌</span>;
                          else timelineBadge = <span className="badge bg-warning text-dark rounded-pill px-3 py-2">In Progress ⏳</span>;

                          return (
                            <li key={item.id} className={`list-group-item bg-dark text-white d-flex justify-content-between align-items-center border-secondary px-3 py-3 rounded mb-2 ${isOverdue ? 'border-danger' : ''}`}>
                              <div>
                                <div className={`fw-bold ${item.status === 'completed' ? 'text-decoration-line-through text-white-50' : ''}`}>{item.taskName}</div>
                                <small className="text-secondary">
                                  Assigned by: {item.mentor?.name} 
                                  {item.deadline ? ` • Due: ${new Date(item.deadline).toLocaleDateString()}` : ''}
                                </small>
                              </div>
                              {timelineBadge}
                            </li>
                          )
                        })
                      )}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Right Panel: Gap Analysis Component */}
              <div className="col-lg-5">
                <div className="card bg-secondary border-0 rounded-4 shadow-lg h-100">
                  <div className="card-header bg-black py-3 rounded-top-4 d-flex align-items-center border-0">
                    <TrendingUp className="me-2 text-info" size={20}/>
                    <h5 className="mb-0">Gap Analysis Insights</h5>
                  </div>
                  <div className="card-body">
                    
                    {/* Level 2: AI EXPLANATION SECTION */}
                    <div className="alert bg-dark border-info text-white-50 p-3 rounded-3 shadow-inner mb-4">
                        <strong className="text-info d-block mb-1">🤖 AI Diagnostic Context:</strong>
                        {dashboardData.aiExplanation}
                    </div>

                    <h6 className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                       Prioritized Skills Gap
                    </h6>
                    {dashboardData.missingSkills.length > 0 ? (
                      <div className="d-flex flex-column gap-2 mb-4 mt-3">
                        {dashboardData.missingSkills.map((gapObj, index) => {
                            const isHighPriority = gapObj.priority === 'HIGH';
                            const isMedPriority = gapObj.priority === 'MEDIUM';
                            const badgeColor = isHighPriority ? 'bg-danger' : isMedPriority ? 'bg-warning text-dark' : 'bg-secondary text-white';
                            
                            return (
                                <div key={index} className="d-flex justify-content-between align-items-center p-2 rounded bg-dark border border-secondary shadow-sm">
                                    <span className="fw-bold text-white"><AlertCircle size={14} className="me-2 text-white-50"/>{gapObj.skill}</span>
                                    <span className={`badge rounded-pill px-3 py-1 ${badgeColor}`}>
                                        {gapObj.priority}
                                    </span>
                                </div>
                            );
                        })}
                      </div>
                    ) : (
                      <p className="text-success fw-bold"><CheckCircle size={16} className="me-1"/> No critical skill gaps identified.</p>
                    )}

                    <hr className="border-dark my-4" />

                    <h6 className="text-info fw-bold mb-3">AI Recommendations</h6>
                    {dashboardData.recommendations.length > 0 ? (
                      <ul className="list-unstyled">
                        {dashboardData.recommendations.map((rec, index) => (
                          <li key={index} className="mb-3 p-3 bg-dark rounded-3 shadow-sm border border-secondary d-flex align-items-start text-white-50 hover-text-white transition">
                            <span className="text-info me-3 h4 mb-0">•</span> 
                            <span className="align-self-center lh-sm">{rec}</span>
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
          )}
        </div>

      </div>
    </div>
  );
}

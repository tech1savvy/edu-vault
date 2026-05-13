import React from 'react';
import { useContext } from 'react';
import { ResumeContext } from '../../../context/resumeContext.jsx';

const LayoutS = () => {
  const { 
    heading, 
    experiences, 
    education, 
    skills, 
    projects, 
    certifications, 
    achievements 
  } = useContext(ResumeContext);

  // Sample data for testing - remove this later
  const sampleData = {
    heading: {
      name: 'Shreya Maity',
      title: 'Full Stack Developer',
      email: 'shreyamaity7512@gmail.com',
      phone: '+91-6381326825',
      location: 'Punjab, India',
      summary: 'Passionate developer with expertise in React, Node.js, and modern web technologies.'
    },
    education: [
      {
        degree: 'Bachelor of Technology - Computer Science and Engineering',
        school: 'Lovely Professional University',
        duration: '2022 - Present',
        grade: 'CGPA: 7.4'
      }
    ],
    skills: [
      { name: 'JavaScript' }, { name: 'React' }, { name: 'Node.js' }, 
      { name: 'MongoDB' }, { name: 'HTML/CSS' }, { name: 'Git' }
    ],
    experiences: [
      {
        role: 'Frontend Developer',
        company: 'Tech Solutions Inc',
        duration: 'Jan 2024 - Present',
        details: 'Built responsive web applications using React and modern frameworks.',
        type: 'Job'
      }
    ],
    projects: [
      {
        title: 'Affiliate++ - Link Management Platform',
        description: 'Full-stack affiliate marketing platform with real-time analytics.',
        techStack: 'React, Node.js, MongoDB, Express'
      }
    ],
    certifications: [
      {
        name: 'Cloud Computing',
        issuer: 'NYTEL',
        date: '2024'
      }
    ],
    achievements: [
      {
        title: '5-Star C++ Programmer on HackerRank',
        description: 'Achieved 5-star rating in C++ programming challenges',
        date: '2024'
      }
    ]
  };

  // Use actual data if available, otherwise use sample data for testing
  const displayData = {
    heading: heading.name ? heading : sampleData.heading,
    education: education.length > 0 ? education : sampleData.education,
    skills: skills.length > 0 ? skills : sampleData.skills,
    experiences: experiences.length > 0 ? experiences : sampleData.experiences,
    projects: projects.length > 0 ? projects : sampleData.projects,
    certifications: certifications.length > 0 ? certifications : sampleData.certifications,
    achievements: achievements.length > 0 ? achievements : sampleData.achievements
  };

  return (
    <div className="layout-s portfolio-template">
      {/* Header Section */}
      <header className="portfolio-header bg-primary text-white p-4 text-center">
        <h1 className="display-4">{displayData.heading.name}</h1>
        <p className="lead">{displayData.heading.title}</p>
        <div className="contact-info">
          {displayData.heading.email && <span className="me-3"><i className="bi bi-envelope"></i> {displayData.heading.email}</span>}
          {displayData.heading.phone && <span className="me-3"><i className="bi bi-phone"></i> {displayData.heading.phone}</span>}
          {displayData.heading.location && <span><i className="bi bi-geo-alt"></i> {displayData.heading.location}</span>}
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-md-4 bg-light p-4">
            {/* Education */}
            <section className="mb-4">
              <h3 className="text-primary border-bottom pb-2">Education</h3>
              {displayData.education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <strong>{edu.degree}</strong>
                  <p className="mb-1">{edu.school}</p>
                  <small className="text-muted">{edu.duration}</small>
                  {edu.grade && <div><small className="text-muted">{edu.grade}</small></div>}
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="mb-4">
              <h3 className="text-primary border-bottom pb-2">Skills</h3>
              <div className="d-flex flex-wrap gap-2">
                {displayData.skills.map((skill, idx) => (
                  <span key={idx} className="badge bg-secondary">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="mb-4">
              <h3 className="text-primary border-bottom pb-2">Certifications</h3>
              <ul className="list-unstyled">
                {displayData.certifications.map((cert, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{cert.name}</strong>
                    {cert.issuer && <div className="small">{cert.issuer}</div>}
                    {cert.date && <small className="text-muted">{cert.date}</small>}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Main Content */}
          <div className="col-md-8 p-4">
            {/* Professional Summary */}
            {displayData.heading.summary && (
              <section className="mb-4">
                <h3 className="text-primary border-bottom pb-2">Professional Summary</h3>
                <p>{displayData.heading.summary}</p>
              </section>
            )}

            {/* Experience */}
            <section className="mb-4">
              <h3 className="text-primary border-bottom pb-2">Experience</h3>
              {displayData.experiences.map((exp, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{exp.role}</strong> - {exp.company}
                    </div>
                    <small className="text-muted">{exp.duration}</small>
                  </div>
                  <p className="mb-1">{exp.details}</p>
                  <span className="badge bg-info">{exp.type}</span>
                </div>
              ))}
            </section>

            {/* Projects */}
            <section className="mb-4">
              <h3 className="text-primary border-bottom pb-2">Projects</h3>
              {displayData.projects.map((project, idx) => (
                <div key={idx} className="mb-3">
                  <strong>{project.title}</strong>
                  <p className="mb-1">{project.description}</p>
                  {project.techStack && (
                    <small className="text-muted">Tech: {project.techStack}</small>
                  )}
                </div>
              ))}
            </section>

            {/* Achievements */}
            <section className="mb-4">
              <h3 className="text-primary border-bottom pb-2">Achievements</h3>
              <ul className="list-unstyled">
                {displayData.achievements.map((achievement, idx) => (
                  <li key={idx} className="mb-2">
                    <strong>{achievement.title}</strong>
                    {achievement.description && (
                      <p className="mb-1 small">{achievement.description}</p>
                    )}
                    {achievement.date && (
                      <small className="text-muted">{achievement.date}</small>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="portfolio-footer bg-dark text-white text-center p-3">
        <small>Portfolio generated with EduVault - Layout S</small>
      </footer>
    </div>
  );
};

export default LayoutS;
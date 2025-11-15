import React, { useContext, useRef } from 'react';
import './LayoutK.css';
import { ResumeContext } from '../../../../context/resumeContext';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-scroll';

const LayoutK = () => {
  const {
    heading,
    education,
    experiences,
    projects,
    skills,
    achievements,
    certifications,
    loading,
  } = useContext(ResumeContext);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const portfolioData = {
    headingData: {
      fullName: heading.name,
      title: heading.role,
      description: 'A passionate Full Stack Developer with experience in building web applications with JavaScript, React, Node.js, and other cool libraries and frameworks.', // This is not in the DB
    },
    experiencesData: experiences,
    educationData: education,
    projectsData: projects,
    skillsData: skills.map(skill => skill.name),
    achievementsData: achievements.map(ach => ({ achievement: ach.title })),
    certificationsData: certifications.map(cert => ({ certification: cert.name })),
  };

  return (
    <div className="portfolio-website">
      <div className="portfolio-controls">
        {/* ThemeSwitcher is now in the Navbar */}
      </div>
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>{portfolioData.headingData.fullName}</h1>
          <p>{portfolioData.headingData.title}</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="about" smooth={true} duration={500}>About</Link></li>
            <li><Link to="experience" smooth={true} duration={500}>Experience</Link></li>
            <li><Link to="education" smooth={true} duration={500}>Education</Link></li>
            <li><Link to="projects" smooth={true} duration={500}>Projects</Link></li>
            <li><Link to="skills" smooth={true} duration={500}>Skills</Link></li>
            <li><Link to="achievements" smooth={true} duration={500}>Achievements</Link></li>
            <li><Link to="certifications" smooth={true} duration={500}>Certifications</Link></li>
          </ul>
        </nav>
      </div>
      <div ref={componentRef} className="main-content">
        <div id="about">
          <section className="about">
            <h2>About Me</h2>
            <p>{portfolioData.headingData.description}</p>
          </section>
        </div>
        <div id="experience">
          {portfolioData.experiencesData && portfolioData.experiencesData.length > 0 && (
            <section className="experiences">
              <h2>Experience</h2>
              {portfolioData.experiencesData.map((exp, index) => (
                <div key={index} className="card">
                  <h3>{exp.role}</h3>
                  <p>{exp.company} | {exp.duration}</p>
                  <p>{exp.details}</p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div id="education">
          {portfolioData.educationData && portfolioData.educationData.length > 0 && (
            <section className="education">
              <h2>Education</h2>
              {portfolioData.educationData.map((edu, index) => (
                <div key={index} className="card">
                  <h3>{edu.degree}</h3>
                  <p>{edu.institution} | {edu.duration}</p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div id="projects">
          {portfolioData.projectsData && portfolioData.projectsData.length > 0 && (
            <section className="projects">
              <h2>Projects</h2>
              {portfolioData.projectsData.map((project, index) => (
                <div key={index} className="card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div id="skills">
          {portfolioData.skillsData && portfolioData.skillsData.length > 0 && (
            <section className="skills">
              <h2>Skills</h2>
              <div className="skills-container">
                {portfolioData.skillsData.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}
        </div>
        <div id="achievements">
          {portfolioData.achievementsData && portfolioData.achievementsData.length > 0 && (
            <section className="achievements">
              <h2>Achievements</h2>
              <ul>
                {portfolioData.achievementsData.map((ach, index) => (
                  <li key={index}>{ach.achievement}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div id="certifications">
          {portfolioData.certificationsData && portfolioData.certificationsData.length > 0 && (
            <section className="certifications">
              <h2>Certifications</h2>
              <ul>
                {portfolioData.certificationsData.map((cert, index) => (
                  <li key={index}>{cert.certification}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <footer className="footer">
          <p>&copy; 2025 My Portfolio</p>
        </footer>
      </div>
    </div>
  );
};

export default LayoutK;

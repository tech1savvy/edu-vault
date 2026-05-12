import React, { useState, useContext } from 'react';
import './LayoutK.css';
import Header from './Header';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Projects from './Projects';
import Skills from './Skills';
import Achievements from './Achievements';
import Certifications from './Certifications';
import Contact from './Contact';
import { ResumeContext } from '../../../../context/resumeContext';

const LayoutK = () => {
  const [theme, setTheme] = useState('dark');
  const {
    heading,
    projects,
    skills,
    experiences,
    education,
    achievements,
    certifications,
  } = useContext(ResumeContext);

  return (
    <div className="portfolio-layout-k" data-theme={theme}>
      <div className="theme-switcher">
        <button onClick={() => setTheme('dark')}>🌙</button>
        <button onClick={() => setTheme('light')}>☀️</button>
        <button onClick={() => setTheme('blue')}>💧</button>
      </div>
      <div className="portfolio-container">
        <Header data={heading} />
        <main className="portfolio-content">
          <About data={heading} />
          <Experience data={experiences} />
          <Education data={education} />
          <Projects data={projects} />
          <Skills data={skills} />
          <Achievements data={achievements} />
          <Certifications data={certifications} />
          <Contact data={heading} />
        </main>
      </div>
    </div>
  );
};

export default LayoutK;

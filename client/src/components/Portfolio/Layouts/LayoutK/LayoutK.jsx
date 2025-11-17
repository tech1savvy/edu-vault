import React, { useState, useEffect } from 'react';
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
import {
  getHeading,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getAchievements,
  getCertifications,
} from '../../../../services/api';

const LayoutK = () => {
  const [theme, setTheme] = useState('dark');
  const [heading, setHeading] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setHeading(await getHeading());
        setProjects(await getProjects());
        setSkills(await getSkills());
        setExperience(await getExperience());
        setEducation(await getEducation());
        setAchievements(await getAchievements());
        setCertifications(await getCertifications());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

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
          <Experience data={experience} />
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

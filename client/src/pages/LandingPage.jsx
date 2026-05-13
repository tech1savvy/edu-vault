import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Cpu, Shield } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.feature-card');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="landing-page" ref={containerRef}>
      <div className="ambient-background">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
        <div className="glow-orb-3"></div>
      </div>
      <div className="grid-overlay"></div>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon"><Sparkles size={16} /></span>
            The New Standard for Career Growth
          </div>
          <h1 className="hero-title">Unlock Your Potential<br/>with EduVault</h1>
          <p className="hero-subtitle">
            The intelligent platform for building stunning resumes, tracking applications, 
            and effortlessly matching with your dream opportunities using advanced AI.
          </p>
          <div className="hero-buttons">
            <Link to="/signup?role=user" className="btn-premium btn-primary-gradient">
              Start Building Free
            </Link>
            <Link to="/login" className="btn-premium btn-outline-glow">
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">


        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon-glow"></div>
              <FileText size={36} className="feature-icon" />
            </div>
            <h3 className="feature-title">Smart Resume Builder</h3>
            <p className="feature-description">
              Craft professional, ATS-friendly resumes with our intuitive builder. 
              Tailor your skills and experience seamlessly to stand out from the crowd.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon-glow"></div>
              <Cpu size={36} className="feature-icon" />
            </div>
            <h3 className="feature-title">AI Job Matching</h3>
            <p className="feature-description">
              Leverage advanced machine learning to instantly match your profile against 
              the latest job descriptions. Get actionable insights on missing skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon-glow"></div>
              <Shield size={36} className="feature-icon" />
            </div>
            <h3 className="feature-title">Role-Based Access</h3>
            <p className="feature-description">
              Whether you are a Student building a career, a Mentor guiding talent, 
              or an Admin managing job postings—EduVault adapts to your needs securely.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

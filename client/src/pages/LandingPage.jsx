import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const containerRef = useRef(null);

  // Optional: Add subtle mouse tracking effect to cards
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
      {/* Animated Ambient Background */}
      <div className="ambient-background">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
        <div className="glow-orb-3"></div>
      </div>
      <div className="grid-overlay"></div>
      
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon"><i className="bi bi-stars"></i></span>
            The New Standard for Career Growth
          </div>
          <h1 className="hero-title">Unlock Your Potential<br/>with EduVault</h1>
          <p className="hero-subtitle">
            The intelligent platform for building stunning resumes, tracking applications, 
            and effortlessly matching with your dream opportunities using advanced AI.
          </p>
          <div className="hero-buttons d-flex justify-content-center gap-3">
            <Link to="/signup?role=user" className="btn-premium btn-primary-gradient">
              Start Building Free
            </Link>
            <Link to="/login" className="btn-premium btn-outline-glow">
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section mx-3 mx-md-5 pt-5">
        <div className="container mt-4">
          <h2 className="about-title text-center"><span>What this site is about:</span></h2>
          
          <div className="row g-4 justify-content-center mt-2">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-glow"></div>
                  <i className="bi bi-file-earmark-person feature-icon"></i>
                </div>
                <h3 className="feature-title">Smart Resume Builder</h3>
                <p className="feature-description">
                  Craft professional, ATS-friendly resumes with our intuitive builder. 
                  Tailor your skills and experience seamlessly to stand out from the crowd.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-glow"></div>
                  <i className="bi bi-cpu feature-icon"></i>
                </div>
                <h3 className="feature-title">AI Job Matching</h3>
                <p className="feature-description">
                  Leverage advanced machine learning to instantly match your profile against 
                  the latest job descriptions. Get actionable insights on missing skills.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-glow"></div>
                  <i className="bi bi-shield-lock feature-icon"></i>
                </div>
                <h3 className="feature-title">Role-Based Access</h3>
                <p className="feature-description mb-4">
                  Whether you are a Student building a career, a Mentor guiding talent, 
                  or an Admin managing job postings—EduVault adapts to your needs securely.
                </p>
                <div className="d-flex flex-column gap-2 px-3">
                  <Link to="/signup?role=user" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', transition: 'all 0.3s' }}>Join as Student</Link>
                  <Link to="/signup?role=mentor" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', transition: 'all 0.3s' }}>Join as Mentor</Link>
                  <Link to="/signup?role=administrator" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', transition: 'all 0.3s' }}>Join as Admin</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

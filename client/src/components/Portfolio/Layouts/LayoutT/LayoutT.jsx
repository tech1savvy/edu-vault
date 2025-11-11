import React from "react";
import "./LayoutT.css";
import profile from "./images/profile.jpeg";

export default function LayoutT() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="brand">
          <h1>Tanya Singh</h1>
          <p className="tagline">Cloud & DevOps · Full-stack · Problem solver</p>
        </div>
        <nav className="nav">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#certifications">Certifications</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="about">
        <div className="heroInner">
          <div className="heroText">
            <h2>Heyaa!! I’m Tanya Singh :))</h2>
            <p>
              I build cloud-ready applications and automate infrastructure. I’m currently focused
              on deploying secure, scalable services and improving developer experience.
            </p>
            <div className="ctaRow">
              <a className="ctaPrimary" href="#projects">See my work</a>
              <a className="ctaGhost" href="#contact">Get in touch</a>
            </div>
          </div>
          <div className="heroImg">
            <img src={profile} alt="Tanya Singh" />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills" id="skills">
        <h3 className="sectionTitle">Skills</h3>
        <div className="skillsGrid">
          <div className="skillCard">Cloud Computing (AWS, Azure)</div>
          <div className="skillCard">DevOps (CI/CD, Docker, Kubernetes)</div>
          <div className="skillCard">Full-stack Development (Python, Django, JS)</div>
          <div className="skillCard">Database Management (SQL, RDS)</div>
          <div className="skillCard">Automation & Scripting (Python, Bash)</div>
          <div className="skillCard">Problem Solving & Algorithms</div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications" id="certifications">
        <h3 className="sectionTitle">Certifications</h3>
        <div className="grid">
          <article className="card">
            <h4>AWS Certified Solutions Architect</h4>
            <p>Proficient in designing and deploying scalable cloud infrastructure on AWS.</p>
          </article>
          <article className="card">
            <h4>Microsoft Azure Fundamentals</h4>
            <p>Certified in foundational Azure services and cloud concepts.</p>
          </article>
          <article className="card">
            <h4>Docker & Kubernetes Practitioner</h4>
            <p>Hands-on experience in containerization and orchestration of applications.</p>
          </article>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects" id="projects">
        <h3 className="sectionTitle">Projects</h3>
        <div className="grid">
          <article className="card">
            <h4>Project One</h4>
            <p>A short description of Project One. What it does and the tech used.</p>
            <a className="projectLink" href="#">View</a>
          </article>
          <article className="card">
            <h4>Project Two</h4>
            <p>A short description of Project Two. Built for XYZ.</p>
            <a className="projectLink" href="#">View</a>
          </article>
          <article className="card">
            <h4>Project Three</h4>
            <p>A short description of Project Three. Includes demos and images.</p>
            <a className="projectLink" href="#">View</a>
          </article>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <h3 className="sectionTitle">Contact</h3>
        <p>
          Interested in collaborating? Drop me a message —{" "}
          <a href="mailto:tanya@example.com">tanya@example.com</a>
        </p>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input className="input" type="text" placeholder="Your name" required />
          <input className="input" type="email" placeholder="Your email" required />
          <textarea className="textarea" placeholder="Message" required></textarea>
          <button className="ctaPrimary" type="submit">Send</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Tanya Singh - Built using a green palette.</p>
      </footer>
    </div>
  );
}

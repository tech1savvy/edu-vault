import { useContext } from "react";
import { Link } from "react-router";
import { ResumeContext } from "../context/resumeContext";

function Navbar() {
  const { 
    heading, 
    education, 
    experiences, 
    projects, 
    skills, 
    achievements, 
    certifications 
  } = useContext(ResumeContext);

  const handleProcessResume = async () => {
    const fullResume = {
      heading,
      education,
      experiences,
      projects,
      skills,
      achievements,
      certifications,
    };

    console.log("Aggregated Resume Data:", fullResume);

    try {
      const response = await fetch("/api/process/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullResume),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Resume processed successfully!");
        console.log("Server response:", result);
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Failed to process resume:", error);
      alert(`Error: ${error.message}`);
    }
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          EduVault
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownInput"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Input Components
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownInput"
              >
                <li>
                  <Link className="dropdown-item" to="/input/heading">
                    Heading
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/input/experience">
                    Experience
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/input/education">
                    Education
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/input/skills">
                    Skills
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/input/projects">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/input/certifications">
                    Certifications
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/input/achievements">
                    Achievements
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownOutput"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Output Components
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownOutput"
              >
                <li>
                  <Link className="dropdown-item" to="/output/heading">
                    Heading
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/output/experience">
                    Experience
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/output/education">
                    Education
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/output/skills">
                    Skills
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/output/projects">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/output/certifications">
                    Certifications
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/output/achievements">
                    Achievements
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          <button className="btn btn-outline-success" onClick={handleProcessResume}>
            Process Resume for AI
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "./Portfolio/Layouts/LayoutK/ThemeSwitcher";

function Navbar({ toggleTheme }) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary fixed-top" style={{ backgroundColor: '#212529' }}>
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
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownPortfolio"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Portfolio
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownPortfolio"
              >
                <li>
                  <Link className="dropdown-item" to="/portfolio/layout-k">
                    Layout K
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          {location.pathname === '/portfolio/layout-k' && <ThemeSwitcher toggleTheme={toggleTheme} />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

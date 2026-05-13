import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="theme-bg">
      <div className="theme-blob theme-blob-tr" />
      <div className="theme-blob theme-blob-bl" />
      <div className="theme-content mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl theme-card p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full filter blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full filter blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold sm:text-5xl theme-gradient-text">Build Your Career Story with EduVault</h1>
            <p className="mt-4 max-w-2xl text-gray-400">
              Create polished resumes, portfolio pages, and professional profiles in one modern workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup" className="theme-btn theme-btn-primary px-5 py-2.5">
                Get Started
              </Link>
              <Link to="/login" className="theme-btn border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2.5">
                Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;

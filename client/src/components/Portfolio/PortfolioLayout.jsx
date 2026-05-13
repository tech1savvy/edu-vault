import React, { useState } from 'react';
import LayoutS from './Layouts/LayoutS';
// Import other layouts when they're ready
// import LayoutK from './Layouts/LayoutK';
// import LayoutT from './Layouts/LayoutT';

const PortfolioLayout = () => {
  const [selectedLayout, setSelectedLayout] = useState('LayoutS');

  // Layout configuration
  const layouts = {
    LayoutS: {
      component: LayoutS,
      name: 'Modern Professional',
      description: 'Clean, professional layout with sidebar'
    },
    // Add other layouts when teammates create them
    // LayoutK: { component: LayoutK, name: 'Creative', description: 'Creative and modern design' },
    // LayoutT: { component: LayoutT, name: 'Traditional', description: 'Classic resume format' }
  };

  const CurrentLayout = layouts[selectedLayout].component;

  return (
    <div className="portfolio-builder">
      {/* Layout Selector */}
      <div className="layout-selector bg-light p-3 border-bottom">
        <div className="container">
          <h4>Choose Portfolio Layout</h4>
          <div className="btn-group" role="group">
            {Object.entries(layouts).map(([key, layout]) => (
              <button
                key={key}
                type="button"
                className={`btn ${selectedLayout === key ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedLayout(key)}
              >
                {layout.name}
              </button>
            ))}
          </div>
          <small className="text-muted d-block mt-2">
            {layouts[selectedLayout].description}
          </small>
        </div>
      </div>

      {/* Selected Layout */}
      <div className="portfolio-preview">
        <CurrentLayout />
      </div>

      {/* Action Buttons */}
      <div className="portfolio-actions fixed-bottom bg-white border-top p-3">
        <div className="container text-center">
          <button className="btn btn-success me-2">
            <i className="bi bi-download"></i> Download PDF
          </button>
          <button className="btn btn-outline-primary">
            <i className="bi bi-eye"></i> Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioLayout;
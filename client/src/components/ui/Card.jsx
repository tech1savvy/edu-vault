const Card = ({ title, subtitle, children, className = "" }) => {
  return (
    <section className={`theme-card p-6 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h2 className="text-xl font-semibold text-gray-100">{title}</h2>}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
};

export default Card;

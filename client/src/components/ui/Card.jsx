const Card = ({ title, subtitle, children, className = "" }) => {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm transition hover:shadow-md dark:border-slate-600/90 dark:bg-slate-900/95 ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{title}</h2>}
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
};

export default Card;

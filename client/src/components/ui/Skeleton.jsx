const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-600 ${className}`}
    />
  );
};

export default Skeleton;

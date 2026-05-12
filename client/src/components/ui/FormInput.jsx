const baseStyles =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40";

const FormInput = ({
  label,
  name,
  error,
  as = "input",
  className = "",
  options = [],
  ...props
}) => {
  const inputClass = `${baseStyles} ${error ? "border-rose-400 focus:ring-rose-200" : ""} ${className}`;

  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>}
      {as === "textarea" ? (
        <textarea name={name} className={inputClass} {...props} />
      ) : as === "select" ? (
        <select name={name} className={inputClass} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input name={name} className={inputClass} {...props} />
      )}
      {error && <span className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span>}
    </label>
  );
};

export default FormInput;

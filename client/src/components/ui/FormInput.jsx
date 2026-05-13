const baseStyles =
  "w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 placeholder:text-gray-500";

const FormInput = ({
  label,
  name,
  error,
  as = "input",
  className = "",
  options = [],
  ...props
}) => {
  const inputClass = `${baseStyles} ${error ? "border-red-400 focus:ring-red-500/40" : ""} ${className}`;

  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
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
      {error && <span className="text-xs font-medium text-red-400">{error}</span>}
    </label>
  );
};

export default FormInput;

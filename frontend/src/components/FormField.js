// simple labeled input, shows an error message under the field if given
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  as = 'input',
  children,
}) {
  const baseClasses =
    'w-full rounded-md border bg-white px-3 py-2 text-sm text-ink transition focus:outline-none focus:ring-2 focus:ring-brass/40 ' +
    (error ? 'border-rust' : 'border-ink/15 focus:border-brass');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-rust"> *</span>}
      </label>

      {as === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange} className={baseClasses}>
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className={baseClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      {error && <span className="text-xs text-rust">{error}</span>}
    </div>
  );
}

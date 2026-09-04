// simple labeled input, shows an error message under the field if given
// `variant` only controls color theme (light = customer/public, dark = admin card) — no behavior change
const THEME = {
  light: {
    label: 'text-slate-700',
    ring: 'focus:border-indigo-500 focus:ring-indigo-500/20',
    border: 'border-slate-200',
    error: 'text-rose-600',
    errorBorder: 'border-rose-400',
  },
  dark: {
    label: 'text-slate-300',
    ring: 'focus:border-amber-400 focus:ring-amber-400/20',
    border: 'border-slate-200',
    error: 'text-rose-400',
    errorBorder: 'border-rose-400',
  },
};

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
  variant = 'light',
}) {
  const theme = THEME[variant] || THEME.light;

  const baseClasses =
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 ' +
    (error ? `${theme.errorBorder} focus:ring-rose-400/20` : `${theme.border} ${theme.ring}`);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={`text-sm font-medium ${theme.label}`}>
        {label}
        {required && <span className="text-rose-500"> *</span>}
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

      {error && <span className={`text-xs ${theme.error}`}>{error}</span>}
    </div>
  );
}

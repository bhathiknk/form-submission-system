const VARIANTS = {
  // customer / public theme — indigo
  primary: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700',
  accent: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700',
  outline: 'border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',

  // admin dashboard theme — amber on slate
  adminAccent: 'bg-amber-400 text-slate-900 shadow-sm shadow-amber-400/20 hover:bg-amber-300 font-semibold',
  adminOutline: 'border border-slate-600 text-slate-200 hover:border-amber-400 hover:text-amber-300',
  adminGhost: 'text-slate-300 hover:bg-white/5 hover:text-white',
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

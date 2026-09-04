const VARIANTS = {
  primary: 'bg-ink text-paper hover:bg-ink/90',
  accent: 'bg-brass text-ink hover:bg-brassdark hover:text-paper',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink/5',
  danger: 'bg-rust text-paper hover:bg-rust/90',
  ghost: 'text-ink/70 hover:text-ink hover:bg-ink/5',
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
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

import Link from 'next/link';

// Shared container for both login forms. `active` just controls which tab is
// highlighted and which color theme is applied — no auth logic lives here.
export default function AuthCard({ active, title, subtitle, children }) {
  const isAdmin = active === 'admin';

  return (
    <main
      className={`flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 transition-colors ${
        isAdmin ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      <div className="w-full max-w-md">
        <div className={`mb-6 flex gap-1 rounded-full p-1 ${isAdmin ? 'bg-slate-800' : 'bg-slate-200/70'}`}>
          <Link
            href="/login"
            className={`flex-1 rounded-full py-2 text-center text-sm font-medium transition ${
              !isAdmin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Customer
          </Link>
          <Link
            href="/admin/login"
            className={`flex-1 rounded-full py-2 text-center text-sm font-medium transition ${
              isAdmin ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin
          </Link>
        </div>

        <div
          className={`rounded-2xl p-8 shadow-xl ${
            isAdmin ? 'bg-slate-800/60 ring-1 ring-white/10' : 'bg-white ring-1 ring-slate-900/5'
          }`}
        >
          <h1 className={`text-2xl font-bold tracking-tight ${isAdmin ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-1.5 text-sm ${isAdmin ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}

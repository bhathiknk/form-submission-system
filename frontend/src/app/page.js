import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="relative mx-auto max-w-6xl overflow-hidden px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl"
        />

        <section className="relative grid gap-12 py-20 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="mb-4 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Client Intake Platform
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
              A straightforward way to collect and manage client submissions
            </h1>
            <p className="mt-5 max-w-prose text-slate-600">
              Customers register, sign in, and submit their details through a guided form.
              Admins review everything in one place filter by gender, search by name,
              and keep every record up to date.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Create a customer account
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-900/5">
            <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
            <ol className="mt-4 space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
                Register for a customer account with your email.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
                Sign in and complete the application form.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">3</span>
                An admin reviews, updates, or follows up on your submission.
              </li>
            </ol>
          </div>
        </section>

        <section className="relative grid gap-6 pb-20 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">🔐</div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Secure authentication</h3>
            <p className="mt-1.5 text-sm text-slate-500">JWT-based sessions keep customer and admin accounts protected.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">🧭</div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Role-based access</h3>
            <p className="mt-1.5 text-sm text-slate-500">Customers and admins each get a dedicated, guarded experience.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">⚡</div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Fast review</h3>
            <p className="mt-1.5 text-sm text-slate-500">Filter, search, and update submissions from a single dashboard.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        Evotec Records
      </footer>
    </div>
  );
}

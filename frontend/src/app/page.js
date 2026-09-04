import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-12 py-20 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="mb-4 text-sm font-medium text-brassdark">Client Intake Platform</p>
            <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              A straightforward way to collect and manage client submissions
            </h1>
            <p className="mt-5 max-w-prose text-ink/70">
              Customers register, sign in, and submit their details through a guided form.
              Admins review everything in one place — filter by gender, search by name,
              and keep every record up to date.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink/90"
              >
                Create a customer account
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-ink/20 px-5 py-3 text-sm font-medium text-ink hover:border-ink"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-8">
            <h2 className="font-serif text-lg text-ink">How it works</h2>
            <ol className="mt-4 space-y-4 text-sm text-ink/70">
              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-moss/15 text-center text-xs font-semibold leading-5 text-moss">1</span>
                Register for a customer account with your email.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-moss/15 text-center text-xs font-semibold leading-5 text-moss">2</span>
                Sign in and complete the application form.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-moss/15 text-center text-xs font-semibold leading-5 text-moss">3</span>
                An admin reviews, updates, or follows up on your submission.
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10 py-8 text-center text-xs text-ink/40">
        Evotec Records — Full-Stack Technical Assignment
      </footer>
    </div>
  );
}

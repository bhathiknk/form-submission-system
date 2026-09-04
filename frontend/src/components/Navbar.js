'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'ADMIN';

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur ${
        isAdmin ? 'border-white/10 bg-slate-900/95' : 'border-slate-200 bg-white/90'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={`text-lg font-bold tracking-tight ${isAdmin ? 'text-white' : 'text-slate-900'}`}
        >
          Evotec<span className={isAdmin ? 'text-amber-400' : 'text-indigo-600'}>Records</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {!user && (
            <>
              <Link
                href="/login"
                className="px-3 py-2 font-medium text-slate-600 transition hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}

          {user && user.role === 'CUSTOMER' && (
            <>
              <Link href="/application" className="text-slate-600 transition hover:text-slate-900">
                Application
              </Link>
              <span className="hidden text-slate-400 sm:inline">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>Log out</Button>
            </>
          )}

          {user && isAdmin && (
            <>
              <Link href="/admin/dashboard" className="text-slate-300 transition hover:text-white">
                Dashboard
              </Link>
              <span className="hidden text-slate-500 sm:inline">{user.email}</span>
              <Button variant="adminOutline" onClick={handleLogout}>Log out</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-ink">
          Evotec Records
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {!user && (
            <>
              <Link href="/login" className="text-ink/70 hover:text-ink">Customer Login</Link>
              <Link href="/register" className="text-ink/70 hover:text-ink">Register</Link>
              <Link href="/admin/login" className="text-ink/70 hover:text-ink">Admin</Link>
            </>
          )}

          {user && user.role === 'CUSTOMER' && (
            <>
              <Link href="/application" className="text-ink/70 hover:text-ink">Submit Form</Link>
              <span className="hidden text-ink/40 sm:inline">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>Log out</Button>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <Link href="/admin/dashboard" className="text-ink/70 hover:text-ink">Dashboard</Link>
              <span className="hidden text-ink/40 sm:inline">{user.email}</span>
              <Button variant="outline" onClick={handleLogout}>Log out</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

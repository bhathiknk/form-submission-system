'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// redirects away if not logged in, or logged in as the wrong role
export function useRequireAuth(requiredRole, redirectTo) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || (requiredRole && user.role !== requiredRole)) {
      router.replace(redirectTo);
    }
  }, [user, loading, requiredRole, redirectTo, router]);

  return { user, loading };
}

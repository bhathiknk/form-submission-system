'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function CustomerLoginPage() {
  const { customerLogin } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await customerLogin(form.email, form.password);
      toast.success('Welcome back');
      router.push('/application');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="font-serif text-2xl text-ink">Customer login</h1>
        <p className="mt-2 text-sm text-ink/60">Sign in to submit or manage your application.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="text-sm text-rust">{error}</p>}

          <Button type="submit" variant="accent" loading={submitting} fullWidth>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-brassdark hover:underline">Register</Link>
        </p>
        <p className="mt-2 text-center text-xs text-ink/40">
          Are you an admin? <Link href="/admin/login" className="hover:underline">Go to admin login</Link>
        </p>
      </main>
    </div>
  );
}

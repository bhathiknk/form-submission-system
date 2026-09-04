'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../../components/Navbar';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
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
      await adminLogin(form.email, form.password);
      toast.success('Welcome back');
      router.push('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="font-serif text-2xl text-paper">Admin login</h1>
        <p className="mt-2 text-sm text-paper/60">Restricted access for administrators only.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 rounded-lg border border-paper/10 bg-ink p-6">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="admin@evotec.software"
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
            Log in as admin
          </Button>
        </form>
      </main>
    </div>
  );
}

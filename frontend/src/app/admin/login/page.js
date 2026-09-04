'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../../components/Navbar';
import AuthCard from '../../../components/AuthCard';
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
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <AuthCard active="admin" title="Admin sign in" subtitle="Restricted access for administrators only.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="admin@evotec.software"
            variant="dark"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            variant="dark"
          />

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button type="submit" variant="adminAccent" loading={submitting} fullWidth>
            Log in as admin
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}

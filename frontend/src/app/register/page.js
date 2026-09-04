'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // basic client-side checks before hitting the API
  function validate() {
    const next = {};
    if (!form.email) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Enter a valid email address';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 4) next.password = 'Password must be at least 4 characters';

    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form.email, form.password, form.confirmPassword);
      toast.success('Account created. You can now log in.');
      router.push('/login');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const fieldErrors = {};
        apiErrors.forEach((fe) => { fieldErrors[fe.field] = fe.message; });
        setErrors(fieldErrors);
      }
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="font-serif text-2xl text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-ink/60">Register as a customer to submit your application.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="you@example.com"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="At least 4 characters"
          />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" variant="accent" loading={submitting} fullWidth>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brassdark hover:underline">Log in</Link>
        </p>
      </main>
    </div>
  );
}

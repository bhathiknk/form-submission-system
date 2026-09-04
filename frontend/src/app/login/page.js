'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';
import AuthShell from '../../components/AuthShell';
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
    <Box>
      <Navbar />
      <AuthShell active="customer" title="Welcome back" subtitle="Sign in to submit or manage your application.">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting} fullWidth>
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Typography component={NextLink} href="/register" variant="body2" sx={{ fontWeight: 600, color: 'primary.dark', textDecoration: 'none' }}>
            Register
          </Typography>
        </Typography>
      </AuthShell>
    </Box>
  );
}

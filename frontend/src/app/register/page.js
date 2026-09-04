'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import Navbar from '../../components/Navbar';
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 8 }}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'rgba(22,26,32,0.08)' }}>
            <Typography variant="h5">Create your account</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Register as a customer to submit your application.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
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
                error={Boolean(errors.password)}
                helperText={errors.password || 'At least 4 characters'}
                required
                fullWidth
              />
              <TextField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                required
                fullWidth
              />

              <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting} fullWidth>
                {submitting ? 'Creating account…' : 'Create account'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
              Already have an account?{' '}
              <Typography component={NextLink} href="/login" variant="body2" sx={{ display: 'inline', fontWeight: 600, color: 'primary.dark', textDecoration: 'none' }}>
                Log in
              </Typography>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

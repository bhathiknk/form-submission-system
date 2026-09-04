'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Box, TextField, Button, Alert } from '@mui/material';
import Navbar from '../../../components/Navbar';
import AuthShell from '../../../components/AuthShell';
import { useAuth } from '../../../context/AuthContext';
import { palette } from '../../../theme/palette';

// dark-field styling so inputs read correctly against the admin card's dark background
const darkFieldSx = {
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.brass },
};

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
    <Box sx={{ minHeight: '100vh', bgcolor: palette.slate950 }}>
      <Navbar />
      <AuthShell active="admin" title="Admin sign in" subtitle="Restricted access for administrators only.">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@evotec.software"
            required
            fullWidth
            sx={darkFieldSx}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            sx={darkFieldSx}
          />

          {error && <Alert severity="error" variant="outlined">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            fullWidth
            sx={{ bgcolor: palette.brass, color: palette.ink, '&:hover': { bgcolor: palette.brassDark } }}
          >
            {submitting ? 'Logging in…' : 'Log in as admin'}
          </Button>
        </Box>
      </AuthShell>
    </Box>
  );
}

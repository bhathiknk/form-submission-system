'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Box, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.indigo },
};
export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                sx={darkFieldSx}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            size="small"
                            sx={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                  ),
                }}
            />
            {error && <Alert severity="error" variant="outlined">{error}</Alert>}
            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                fullWidth
                sx={{
                  background: `linear-gradient(135deg, ${palette.indigo}, ${palette.indigoDark})`,
                  color: '#fff',
                  boxShadow: '0 8px 20px -6px rgba(79,70,229,0.6)',
                  '&:hover': { background: `linear-gradient(135deg, ${palette.indigoDark}, ${palette.indigo})` },
                }}
            >
              {submitting ? 'Logging in…' : 'Log in as admin'}
            </Button>
          </Box>
        </AuthShell>
      </Box>
  );
}
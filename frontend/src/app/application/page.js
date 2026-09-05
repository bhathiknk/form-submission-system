'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box, Container, Paper, Typography, TextField, MenuItem, Button, Alert, Grid, InputAdornment,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import Navbar from '../../components/Navbar';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { createSubmission } from '../../lib/submissions';
import { palette } from '../../theme/palette';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^(\+?\d{1,3}[-\s]?)?\(?0?\d{2,4}\)?[-\s]?\d{3,4}[-\s]?\d{3,4}$/;

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', gender: '', mobileNumber: '', address: '', feedback: '',
};

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

// shared styling so every field gets the same rounded, softly-highlighted
// focus treatment instead of MUI's default flat outline
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
    '&.Mui-focused': {
      boxShadow: `0 0 0 4px rgba(79,70,229,0.12)`,
    },
  },
};

export default function ApplicationPage() {
  const { user, loading } = useRequireAuth('CUSTOMER', '/login');

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.gender) next.gender = 'Please select a gender';
    if (!form.mobileNumber.trim()) next.mobileNumber = 'Mobile number is required';
    else if (!MOBILE_REGEX.test(form.mobileNumber.trim())) next.mobileNumber = 'Enter a valid mobile number';
    if (!form.address.trim()) next.address = 'Address is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createSubmission(form);
      toast.success('Application submitted successfully');
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const fieldErrors = {};
        apiErrors.forEach((fe) => { fieldErrors[fe.field] = fe.message; });
        setErrors(fieldErrors);
      }
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Typography variant="body2" color="text.secondary" sx={{ p: 4 }}>Loading…</Typography>
        </Box>
    );
  }

  return (
      <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            backgroundImage: 'radial-gradient(circle at 90% 0%, rgba(79,70,229,0.08), transparent 40%), radial-gradient(circle at 5% 30%, rgba(13,156,144,0.06), transparent 40%)',
          }}
      >
        <Navbar />
        <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>Application form</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Fill in your details below. Fields marked * are required.
          </Typography>

          {submitted && (
              <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                Your application was submitted. An admin will review it shortly. You can submit another one below.
              </Alert>
          )}

          <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 3,
                p: { xs: 2.5, sm: 4 },
                border: '1px solid',
                borderColor: 'rgba(20,22,31,0.08)',
                borderRadius: 3,
                boxShadow: '0 24px 48px -28px rgba(20,22,31,0.2)',
              }}
          >
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                    label="First name" name="firstName" value={form.firstName} onChange={handleChange}
                    error={Boolean(errors.firstName)} helperText={errors.firstName} required fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    label="Last name" name="lastName" value={form.lastName} onChange={handleChange}
                    error={Boolean(errors.lastName)} helperText={errors.lastName} required fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                    error={Boolean(errors.email)} helperText={errors.email} placeholder="you@example.com" required fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                    select label="Gender" name="gender" value={form.gender} onChange={handleChange}
                    error={Boolean(errors.gender)} helperText={errors.gender} required fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <WcOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                >
                  <MenuItem value="" disabled>Select…</MenuItem>
                  {GENDERS.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    label="Mobile number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange}
                    error={Boolean(errors.mobileNumber)} helperText={errors.mobileNumber} placeholder="0917 123 4567" required fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Address" name="address" value={form.address} onChange={handleChange}
                    error={Boolean(errors.address)} helperText={errors.address} required fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Feedback (optional)" name="feedback" value={form.feedback} onChange={handleChange}
                    multiline rows={3} fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                            <ChatBubbleOutlineOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                      ),
                    }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    fullWidth
                    sx={{
                      py: 1.4,
                      background: `linear-gradient(135deg, ${palette.indigo}, ${palette.indigoDark})`,
                      boxShadow: '0 10px 24px -8px rgba(79,70,229,0.5)',
                      '&:hover': { background: `linear-gradient(135deg, ${palette.indigoDark}, ${palette.indigo})` },
                    }}
                >
                  {submitting ? 'Submitting…' : 'Submit application'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
  );
}
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box, Container, Paper, Typography, TextField, MenuItem, Button, Alert, Grid,
} from '@mui/material';
import Navbar from '../../components/Navbar';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { createSubmission } from '../../lib/submissions';

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4">Application form</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Fill in your details below. Fields marked * are required.
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Your application was submitted. An admin will review it shortly. You can submit another one below.
          </Alert>
        )}

        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'rgba(22,26,32,0.08)' }}
        >
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name" name="firstName" value={form.firstName} onChange={handleChange}
                error={Boolean(errors.firstName)} helperText={errors.firstName} required fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last name" name="lastName" value={form.lastName} onChange={handleChange}
                error={Boolean(errors.lastName)} helperText={errors.lastName} required fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                error={Boolean(errors.email)} helperText={errors.email} placeholder="you@example.com" required fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select label="Gender" name="gender" value={form.gender} onChange={handleChange}
                error={Boolean(errors.gender)} helperText={errors.gender} required fullWidth
              >
                <MenuItem value="" disabled>Select…</MenuItem>
                {GENDERS.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange}
                error={Boolean(errors.mobileNumber)} helperText={errors.mobileNumber} placeholder="0917 123 4567" required fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address" name="address" value={form.address} onChange={handleChange}
                error={Boolean(errors.address)} helperText={errors.address} required fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Feedback (optional)" name="feedback" value={form.feedback} onChange={handleChange}
                multiline rows={3} fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" disabled={submitting} fullWidth>
                {submitting ? 'Submitting…' : 'Submit application'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Grid,
} from '@mui/material';
import { updateSubmission } from '../lib/submissions';

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

// popup form to edit an existing submission, used by the admin dashboard
export default function EditSubmissionModal({ submission, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName: submission.firstName,
    lastName: submission.lastName,
    email: submission.email,
    gender: submission.gender,
    mobileNumber: submission.mobileNumber,
    address: submission.address,
    feedback: submission.feedback || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateSubmission(submission.id, form);
      toast.success('Submission updated');
      onSaved(res.data.submission);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const fieldErrors = {};
        apiErrors.forEach((fe) => { fieldErrors[fe.field] = fe.message; });
        setErrors(fieldErrors);
      }
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 32px 64px -24px rgba(20,22,31,0.35)' } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Edit submission</DialogTitle>
      <DialogContent>
        <Grid container spacing={2.5} component="form" id="edit-submission-form" onSubmit={handleSubmit} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={Boolean(errors.firstName)} helperText={errors.firstName} required fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={Boolean(errors.lastName)} helperText={errors.lastName} required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email} required fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} error={Boolean(errors.gender)} helperText={errors.gender} required fullWidth>
              {GENDERS.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Mobile number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} error={Boolean(errors.mobileNumber)} helperText={errors.mobileNumber} required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} error={Boolean(errors.address)} helperText={errors.address} required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Feedback" name="feedback" value={form.feedback} onChange={handleChange} multiline rows={3} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button type="submit" form="edit-submission-form" variant="contained" color="primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

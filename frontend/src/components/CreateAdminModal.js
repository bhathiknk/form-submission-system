'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box, Alert,
} from '@mui/material';
import apiClient from '../lib/apiClient';

// lets a logged-in admin create another admin account
export default function CreateAdminModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const { data } = await apiClient.post('/auth/admin/create', { email });
      setResult(data.data);
      toast.success('Admin account created');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Create admin account</DialogTitle>

      {!result ? (
        <>
          <DialogContent>
            <Box component="form" id="create-admin-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Admin email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="new-admin@evotec.software" required fullWidth
              />
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} color="inherit">Cancel</Button>
            <Button type="submit" form="create-admin-form" variant="contained" color="primary" disabled={creating}>
              {creating ? 'Creating…' : 'Create'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Share these credentials with the new admin. This password is shown only once.
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(22,26,32,0.04)', borderRadius: 1.5 }}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary' }}>Email:</Box> {result.user.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <Box component="span" sx={{ color: 'text.secondary' }}>Temporary password:</Box>{' '}
                <Box component="span" sx={{ fontFamily: 'monospace' }}>{result.temporaryPassword}</Box>
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} variant="outlined">Done</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

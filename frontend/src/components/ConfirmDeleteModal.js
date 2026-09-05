'use client';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

// small confirm dialog before deleting a submission
export default function ConfirmDeleteModal({ submission, onCancel, onConfirm, deleting }) {
  return (
    <Dialog
      open
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 32px 64px -24px rgba(20,22,31,0.35)' } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Delete submission?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will permanently delete the submission for{' '}
          <strong>{submission.firstName} {submission.lastName}</strong>. This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

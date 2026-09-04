'use client';

import Button from './Button';

// small confirm dialog before deleting a submission
export default function ConfirmDeleteModal({ submission, onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-paper p-6">
        <h2 className="font-serif text-lg text-ink">Delete submission?</h2>
        <p className="mt-2 text-sm text-ink/60">
          This will permanently delete the submission for{' '}
          <span className="font-medium text-ink">{submission.firstName} {submission.lastName}</span>. This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" onClick={onConfirm} loading={deleting}>Delete</Button>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

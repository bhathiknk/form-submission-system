'use client';

import Button from './Button';

// small confirm dialog before deleting a submission
export default function ConfirmDeleteModal({ submission, onCancel, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">Delete submission?</h2>
        <p className="mt-2 text-sm text-slate-500">
          This will permanently delete the submission for{' '}
          <span className="font-medium text-slate-900">{submission.firstName} {submission.lastName}</span>. This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" onClick={onConfirm} loading={deleting}>Delete</Button>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

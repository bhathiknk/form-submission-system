'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import FormField from './FormField';
import Button from './Button';
import { updateSubmission } from '../lib/submissions';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-paper p-6">
        <h2 className="font-serif text-xl text-ink">Edit submission</h2>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <FormField label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
          <FormField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />

          <div className="sm:col-span-2">
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
          </div>

          <FormField label="Gender" name="gender" as="select" value={form.gender} onChange={handleChange} error={errors.gender} required>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </FormField>

          <FormField label="Mobile number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} error={errors.mobileNumber} required />

          <div className="sm:col-span-2">
            <FormField label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} required />
          </div>

          <div className="sm:col-span-2">
            <FormField label="Feedback" name="feedback" as="textarea" value={form.feedback} onChange={handleChange} error={errors.feedback} />
          </div>

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" variant="accent" loading={saving}>Save changes</Button>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

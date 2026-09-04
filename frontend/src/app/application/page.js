'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { createSubmission } from '../../lib/submissions';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^(\+?\d{1,3}[-\s]?)?\(?0?\d{2,4}\)?[-\s]?\d{3,4}[-\s]?\d{3,4}$/;

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  mobileNumber: '',
  address: '',
  feedback: '',
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
      <div className="min-h-screen">
        <Navbar />
        <p className="p-6 text-sm text-ink/50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-2xl text-ink">Application form</h1>
        <p className="mt-2 text-sm text-ink/60">Fill in your details below. Fields marked * are required.</p>

        {submitted && (
          <div className="mt-6 rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-moss">
            Your application was submitted. An admin will review it shortly. You can submit another one below.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <FormField label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
          <FormField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />

          <div className="sm:col-span-2">
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required placeholder="you@example.com" />
          </div>

          <FormField label="Gender" name="gender" as="select" value={form.gender} onChange={handleChange} error={errors.gender} required>
            <option value="">Select...</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </FormField>

          <FormField label="Mobile number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} error={errors.mobileNumber} required placeholder="0917 123 4567" />

          <div className="sm:col-span-2">
            <FormField label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} required />
          </div>

          <div className="sm:col-span-2">
            <FormField label="Feedback (optional)" name="feedback" as="textarea" value={form.feedback} onChange={handleChange} error={errors.feedback} />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" variant="accent" loading={submitting} fullWidth>
              Submit application
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

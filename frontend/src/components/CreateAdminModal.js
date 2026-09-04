'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import FormField from './FormField';
import Button from './Button';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">Create admin account</h2>

        {!result ? (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <FormField label="Admin email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="new-admin@evotec.software" />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" variant="adminAccent" loading={creating}>Create</Button>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-slate-600">Share these credentials with the new admin. This password is shown only once.</p>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
              <p><span className="text-slate-500">Email:</span> {result.user.email}</p>
              <p><span className="text-slate-500">Temporary password:</span> <span className="font-mono">{result.temporaryPassword}</span></p>
            </div>
            <Button className="mt-4" variant="outline" onClick={onClose}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}

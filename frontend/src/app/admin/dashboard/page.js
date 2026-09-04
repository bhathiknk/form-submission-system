'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../../components/Navbar';
import Button from '../../../components/Button';
import EditSubmissionModal from '../../../components/EditSubmissionModal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import CreateAdminModal from '../../../components/CreateAdminModal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { getSubmissions, deleteSubmission } from '../../../lib/submissions';

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'];

const GENDER_BADGE = {
  MALE: 'bg-sky-400/10 text-sky-300',
  FEMALE: 'bg-pink-400/10 text-pink-300',
  OTHER: 'bg-amber-400/10 text-amber-300',
};

export default function AdminDashboardPage() {
  const { user, loading } = useRequireAuth('ADMIN', '/admin/login');

  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [gender, setGender] = useState('');
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(false);

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  const fetchData = useCallback(async (page = 1) => {
    setFetching(true);
    try {
      const res = await getSubmissions({ gender: gender || undefined, search: search || undefined, page });
      setSubmissions(res.data.submissions);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setFetching(false);
    }
  }, [gender, search]);

  useEffect(() => {
    if (user) fetchData(1);
  }, [user, fetchData]);

  // debounce search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) fetchData(1);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleConfirmDelete() {
    setDeletingBusy(true);
    try {
      await deleteSubmission(deleting.id);
      toast.success('Submission deleted');
      setDeleting(null);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <p className="p-6 text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Submissions</h1>
            <p className="mt-1 text-sm text-slate-400">{pagination.total} total record{pagination.total === 1 ? '' : 's'}</p>
          </div>
          <Button variant="adminAccent" onClick={() => setShowCreateAdmin(true)}>+ New admin</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by first or last name..."
            className="w-64 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20"
          />
          <select
            value={gender}
            onChange={(e) => { setGender(e.target.value); }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20"
          >
            <option value="">All genders</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>
            ))}
          </select>
          {gender && (
            <Button variant="adminGhost" onClick={() => setGender('')}>Clear filter</Button>
          )}
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/60">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
              )}
              {!fetching && submissions.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No submissions found.</td></tr>
              )}
              {!fetching && submissions.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium text-white">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-slate-300">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${GENDER_BADGE[s.gender] || 'bg-slate-400/10 text-slate-300'}`}>
                      {s.gender}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{s.mobileNumber}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(s.dateCreated).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="adminGhost" onClick={() => setEditing(s)}>Edit</Button>
                      <Button variant="ghost" className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300" onClick={() => setDeleting(s)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm">
            <Button variant="adminOutline" disabled={pagination.page <= 1} onClick={() => fetchData(pagination.page - 1)}>Previous</Button>
            <span className="text-slate-400">Page {pagination.page} of {pagination.totalPages}</span>
            <Button variant="adminOutline" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchData(pagination.page + 1)}>Next</Button>
          </div>
        )}
      </main>

      {editing && (
        <EditSubmissionModal
          submission={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchData(pagination.page); }}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          submission={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleConfirmDelete}
          deleting={deletingBusy}
        />
      )}

      {showCreateAdmin && <CreateAdminModal onClose={() => setShowCreateAdmin(false)} />}
    </div>
  );
}

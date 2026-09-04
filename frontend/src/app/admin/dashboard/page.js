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
      <div className="min-h-screen">
        <Navbar />
        <p className="p-6 text-sm text-ink/50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-ink">Submissions</h1>
            <p className="mt-1 text-sm text-ink/60">{pagination.total} total record{pagination.total === 1 ? '' : 's'}</p>
          </div>
          <Button variant="outline" onClick={() => setShowCreateAdmin(true)}>+ New admin</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by first or last name..."
            className="w-64 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/40"
          />
          <select
            value={gender}
            onChange={(e) => { setGender(e.target.value); }}
            className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/40"
          >
            <option value="">All genders</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>
            ))}
          </select>
          {gender && (
            <Button variant="ghost" onClick={() => setGender('')}>Clear filter</Button>
          )}
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-ink/10 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/[0.03] text-xs uppercase tracking-wide text-ink/50">
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
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
              )}
              {!fetching && submissions.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/40">No submissions found.</td></tr>
              )}
              {!fetching && submissions.map((s) => (
                <tr key={s.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-3 font-medium text-ink">{s.firstName} {s.lastName}</td>
                  <td className="px-4 py-3 text-ink/70">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-moss/10 px-2 py-0.5 text-xs font-medium text-moss">{s.gender}</span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{s.mobileNumber}</td>
                  <td className="px-4 py-3 text-ink/50">{new Date(s.dateCreated).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setEditing(s)}>Edit</Button>
                      <Button variant="ghost" className="text-rust hover:bg-rust/10" onClick={() => setDeleting(s)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm">
            <Button variant="outline" disabled={pagination.page <= 1} onClick={() => fetchData(pagination.page - 1)}>Previous</Button>
            <span className="text-ink/60">Page {pagination.page} of {pagination.totalPages}</span>
            <Button variant="outline" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchData(pagination.page + 1)}>Next</Button>
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

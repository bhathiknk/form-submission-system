'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Box, Container, Typography, Button, TextField, MenuItem, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, Chip, IconButton, Stack, Tooltip, Pagination,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import Navbar from '../../../components/Navbar';
import EditSubmissionModal from '../../../components/EditSubmissionModal';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import CreateAdminModal from '../../../components/CreateAdminModal';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { getSubmissions, deleteSubmission } from '../../../lib/submissions';
import { palette } from '../../../theme/palette';

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'];

const GENDER_COLOR = {
  MALE: { bg: 'rgba(62,92,74,0.12)', text: palette.moss },
  FEMALE: { bg: 'rgba(168,68,46,0.1)', text: palette.rust },
  OTHER: { bg: 'rgba(184,134,63,0.14)', text: palette.brassDark },
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
      <Box sx={{ minHeight: '100vh', bgcolor: palette.slate950 }}>
        <Navbar />
        <Typography variant="body2" sx={{ p: 4, color: 'rgba(255,255,255,0.5)' }}>Loading…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.slate950 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack direction="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={2}>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff' }}>Submissions</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
              {pagination.total} total record{pagination.total === 1 ? '' : 's'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowCreateAdmin(true)}
            sx={{ bgcolor: palette.brass, color: palette.ink, '&:hover': { bgcolor: palette.brassDark } }}
          >
            + New admin
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 3 }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by first or last name…"
            size="small"
            sx={{
              width: 280,
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.brass },
            }}
          />
          <TextField
            select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            size="small"
            sx={{
              width: 180,
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.brass },
            }}
          >
            <MenuItem value="">All genders</MenuItem>
            {GENDER_OPTIONS.map((g) => (
              <MenuItem key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</MenuItem>
            ))}
          </TextField>
          {gender && (
            <Button onClick={() => setGender('')} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Clear filter
            </Button>
          )}
        </Stack>

        <TableContainer
          component={Paper}
          sx={{ mt: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' } }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Last modified</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetching && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!fetching && submissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
              {!fetching && submissions.map((s) => {
                const color = GENDER_COLOR[s.gender] || { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.7)' };
                // userModified is only set once an admin actually saves an edit —
                // so an untouched row correctly shows nothing here, not a false "modified" date
                const wasModified = Boolean(s.userModified);

                return (
                  <TableRow key={s.id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.06)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{s.firstName} {s.lastName}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>{s.email}</TableCell>
                    <TableCell>
                      <Chip label={s.gender} size="small" sx={{ bgcolor: color.bg, color: color.text }} />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>{s.mobileNumber}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(s.dateCreated).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {wasModified ? (
                        <Tooltip title={`Edited by ${s.userModified.email}`}>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <HistoryOutlinedIcon sx={{ fontSize: 15, color: palette.brass }} />
                            <Box>
                              <Typography variant="caption" component="div" sx={{ color: '#fff', lineHeight: 1.3 }}>
                                {s.userModified.email}
                              </Typography>
                              <Typography variant="caption" component="div" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>
                                {new Date(s.dateModified).toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditing(s)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleting(s)} sx={{ color: palette.rust }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {pagination.totalPages > 1 && (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              page={pagination.page}
              count={pagination.totalPages}
              onChange={(_, page) => fetchData(page)}
              sx={{
                '& .MuiPaginationItem-root': { color: 'rgba(255,255,255,0.6)' },
                '& .Mui-selected': { bgcolor: `${palette.brass} !important`, color: palette.ink },
              }}
            />
          </Stack>
        )}
      </Container>

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
    </Box>
  );
}

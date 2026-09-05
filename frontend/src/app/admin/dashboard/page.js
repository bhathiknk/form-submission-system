'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Box, Container, Typography, Button, TextField, MenuItem, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, Chip, IconButton, Stack, Tooltip, Pagination,
  InputLabel, FormControl, Select, useMediaQuery,
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
  MALE: { bg: 'rgba(79,70,229,0.16)', text: '#A5B4FC' },
  FEMALE: { bg: 'rgba(241,99,60,0.14)', text: '#F5A28A' },
  OTHER: { bg: 'rgba(13,156,144,0.16)', text: '#5EEAD4' },
};

const fieldSx = {
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: palette.indigo },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.16)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.32)' },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.indigo },
};

export default function AdminDashboardPage() {
  const { user, loading } = useRequireAuth('ADMIN', '/admin/login');
  const isMobile = useMediaQuery('(max-width:899px)');

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
      <Box
          sx={{
            minHeight: '100vh',
            bgcolor: palette.slate950,
            backgroundImage: 'radial-gradient(circle at 10% 0%, rgba(79,70,229,0.14), transparent 40%), radial-gradient(circle at 90% 20%, rgba(13,156,144,0.08), transparent 45%)',
          }}
      >
        <Navbar />
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 6 }, px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={2}>
            <Box>
              <Typography variant="h4" sx={{ color: '#fff', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>Submissions</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                {pagination.total} total record{pagination.total === 1 ? '' : 's'}
              </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={() => setShowCreateAdmin(true)}
                sx={{
                  background: `linear-gradient(135deg, ${palette.indigo}, ${palette.indigoDark})`,
                  color: '#fff',
                  boxShadow: '0 8px 20px -6px rgba(79,70,229,0.55)',
                  '&:hover': { background: `linear-gradient(135deg, ${palette.indigoDark}, ${palette.indigo})` },
                }}
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
                sx={{ width: { xs: '100%', sm: 280 }, ...fieldSx }}
            />
            <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 }, ...fieldSx }}>
              <InputLabel id="gender-filter-label">Gender</InputLabel>
              <Select
                  labelId="gender-filter-label"
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="">All genders</MenuItem>
                {GENDER_OPTIONS.map((g) => (
                    <MenuItem key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {gender && (
                <Button onClick={() => setGender('')} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Clear filter
                </Button>
            )}
          </Stack>

          {/* Desktop / tablet: full table */}
          {!isMobile && (
              <TableContainer
                  component={Paper}
                  sx={{
                    mt: 3,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 3,
                    boxShadow: '0 24px 48px -32px rgba(0,0,0,0.6)',
                    overflowX: 'auto',
                  }}
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
                          <TableRow key={s.id} sx={{ '& td': { borderColor: 'rgba(255,255,255,0.06)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.025)' }, transition: 'background-color 0.15s ease' }}>
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
                                      <HistoryOutlinedIcon sx={{ fontSize: 15, color: palette.teal }} />
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
                              <IconButton size="small" onClick={() => setEditing(s)} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: palette.indigo, bgcolor: 'rgba(79,70,229,0.1)' } }}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => setDeleting(s)} sx={{ color: palette.coral, '&:hover': { bgcolor: 'rgba(241,99,60,0.1)' } }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
          )}

          {/* Mobile: stacked cards, same data and same actions as the table above */}
          {isMobile && (
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                {fetching && (
                    <Paper sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, py: 5, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</Typography>
                    </Paper>
                )}
                {!fetching && submissions.length === 0 && (
                    <Paper sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, py: 5, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>No submissions found.</Typography>
                    </Paper>
                )}
                {!fetching && submissions.map((s) => {
                  const color = GENDER_COLOR[s.gender] || { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.7)' };
                  const wasModified = Boolean(s.userModified);

                  return (
                      <Paper
                          key={s.id}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 3,
                            p: 2,
                          }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                              {s.firstName} {s.lastName}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {s.email}
                            </Typography>
                          </Box>
                          <Chip label={s.gender} size="small" sx={{ bgcolor: color.bg, color: color.text, flexShrink: 0 }} />
                        </Stack>

                        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1.5 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Mobile</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{s.mobileNumber}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Submitted</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {new Date(s.dateCreated).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box sx={{ mt: 1.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>Last modified</Typography>
                          {wasModified ? (
                              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
                                <HistoryOutlinedIcon sx={{ fontSize: 15, color: palette.teal }} />
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                      variant="caption"
                                      component="div"
                                      sx={{ color: '#fff', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                  >
                                    {s.userModified.email}
                                  </Typography>
                                  <Typography variant="caption" component="div" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>
                                    {new Date(s.dateModified).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Stack>
                          ) : (
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>—</Typography>
                          )}
                        </Box>

                        <Stack direction="row" justifyContent="flex-end" spacing={0.5} sx={{ mt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', pt: 1 }}>
                          <IconButton size="small" onClick={() => setEditing(s)} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: palette.indigo, bgcolor: 'rgba(79,70,229,0.1)' } }}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleting(s)} sx={{ color: palette.coral, '&:hover': { bgcolor: 'rgba(241,99,60,0.1)' } }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Paper>
                  );
                })}
              </Stack>
          )}

          {pagination.totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                    page={pagination.page}
                    count={pagination.totalPages}
                    onChange={(_, page) => fetchData(page)}
                    siblingCount={isMobile ? 0 : 1}
                    sx={{
                      '& .MuiPaginationItem-root': { color: 'rgba(255,255,255,0.6)' },
                      '& .Mui-selected': { background: `linear-gradient(135deg, ${palette.indigo}, ${palette.indigoDark}) !important`, color: '#fff' },
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
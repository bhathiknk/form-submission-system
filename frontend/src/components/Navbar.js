'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Box, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/palette';

// Top bar shared by every page. Switches to a dark "ledger" look on admin
// pages so the two roles feel like distinct areas of the same product.
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'ADMIN';

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isAdmin ? 'rgba(11,12,20,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        color: isAdmin ? '#fff' : 'text.primary',
        borderBottom: '1px solid',
        borderColor: isAdmin ? 'rgba(255,255,255,0.08)' : 'rgba(20,22,31,0.06)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1180, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Typography
          component={NextLink}
          href="/"
          variant="h6"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}
        >
          Evotec{' '}
          <Box
            component="span"
            sx={{
              background: `linear-gradient(90deg, ${palette.indigo}, ${palette.teal})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Records
          </Box>
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {!user && (
            <>
              <Button component={NextLink} href="/login" color="inherit" sx={{ color: 'text.secondary' }}>
                Log in
              </Button>
              <Button component={NextLink} href="/register" variant="contained" color="primary">
                Sign up
              </Button>
            </>
          )}

          {user && user.role === 'CUSTOMER' && (
            <>
              <Button component={NextLink} href="/application" color="inherit" sx={{ color: 'text.secondary' }}>
                Application
              </Button>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary', mx: 1 }}>
                {user.email}
              </Typography>
              <Button variant="outlined" color="primary" onClick={handleLogout}>Log out</Button>
            </>
          )}

          {user && isAdmin && (
            <>
              <Button component={NextLink} href="/admin/dashboard" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Dashboard
              </Button>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'rgba(255,255,255,0.5)', mx: 1 }}>
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{ color: palette.teal, borderColor: 'rgba(13,156,144,0.5)', '&:hover': { borderColor: palette.teal, bgcolor: 'rgba(13,156,144,0.08)' } }}
              >
                Log out
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

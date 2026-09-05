import NextLink from 'next/link';
import { Box, Container, Typography, Button, Stack, Paper, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import Navbar from '../components/Navbar';
import { palette } from '../theme/palette';

const STEPS = [
  'Register for a customer account with your email.',
  'Sign in and complete the application form.',
  'An admin reviews, updates, or follows up on your submission.',
];

const FEATURES = [
  { icon: LockOutlinedIcon, title: 'Secure authentication', body: 'JWT-based sessions keep customer and admin accounts protected.' },
  { icon: ExploreOutlinedIcon, title: 'Role-based access', body: 'Customers and admins each get a dedicated, guarded experience.' },
  { icon: BoltOutlinedIcon, title: 'Fast review', body: 'Filter, search, and update submissions from a single dashboard.' },
];

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -180,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(79,70,229,0.16), rgba(13,156,144,0.05) 60%, transparent 72%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="overline"
                sx={{ color: palette.indigo, fontWeight: 700, letterSpacing: '0.06em' }}
              >
                Client intake platform
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.1rem' }, lineHeight: 1.15, mt: 1 }}>
                A straightforward way to collect and manage client submissions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 3, maxWidth: 62 + 'ch', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Customers register, sign in, and submit their details through a guided form.
                Admins review everything in one place, filter by gender, search by name,
                and keep every record up to date.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
                <Button component={NextLink} href="/register" variant="contained" color="primary" size="large">
                  Create a customer account
                </Button>
                <Button component={NextLink} href="/login" variant="outlined" size="large" sx={{ borderColor: 'rgba(20,22,31,0.18)', color: 'text.primary' }}>
                  Sign in
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: '1px solid rgba(20,22,31,0.08)',
                  boxShadow: '0 24px 48px -24px rgba(20,22,31,0.18)',
                }}
              >
                <Typography variant="h6">How it works</Typography>
                <Stack spacing={2.5} sx={{ mt: 3 }}>
                  {STEPS.map((step, i) => (
                    <Stack key={step} direction="row" spacing={2}>
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${palette.indigo}, ${palette.teal})`,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pt: 0.3 }}>{step}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: { xs: 4, md: 6 } }}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <Grid item xs={12} sm={4} key={title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    border: '1px solid rgba(20,22,31,0.08)',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 16px 32px -20px rgba(20,22,31,0.25)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(79,70,229,0.1)',
                    }}
                  >
                    <Icon sx={{ color: palette.indigo, fontSize: 22 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 700 }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{body}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="footer" sx={{ borderTop: '1px solid rgba(20,22,31,0.08)', py: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">Evotec Records</Typography>
      </Box>
    </Box>
  );
}

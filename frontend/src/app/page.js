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

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography
              variant="overline"
              sx={{ color: palette.brassDark, fontWeight: 700, letterSpacing: '0.06em' }}
            >
              Client intake platform
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, lineHeight: 1.15, mt: 1 }}>
              A straightforward way to collect and manage client submissions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 3, maxWidth: 62 + 'ch' }}>
              Customers register, sign in, and submit their details through a guided form.
              Admins review everything in one place, filter by gender, search by name,
              and keep every record up to date.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
              <Button component={NextLink} href="/register" variant="contained" color="primary" size="large">
                Create a customer account
              </Button>
              <Button component={NextLink} href="/login" variant="outlined" size="large" sx={{ borderColor: 'rgba(22,26,32,0.25)', color: 'text.primary' }}>
                Sign in
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 4, borderColor: 'rgba(22,26,32,0.1)' }}>
              <Typography variant="h6">How it works</Typography>
              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {STEPS.map((step, i) => (
                  <Stack key={step} direction="row" spacing={2}>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        bgcolor: palette.brass,
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
                    <Typography variant="body2" color="text.secondary">{step}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: { xs: 4, md: 6 } }}>
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Grid item xs={12} sm={4} key={title}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%', borderColor: 'rgba(22,26,32,0.1)' }}>
                <Icon sx={{ color: palette.brass, fontSize: 28 }} />
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 700 }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{body}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="footer" sx={{ borderTop: '1px solid rgba(22,26,32,0.08)', py: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">Evotec Records</Typography>
      </Box>
    </Box>
  );
}

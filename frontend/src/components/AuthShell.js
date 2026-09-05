'use client';

import NextLink from 'next/link';
import { Box, Container, Paper, Typography, Tabs, Tab } from '@mui/material';
import { palette } from '../theme/palette';

// Shared container for both login forms. `active` just controls which tab is
// highlighted and which color theme is applied — no auth logic lives here.
export default function AuthShell({ active, title, subtitle, children }) {
  const isAdmin = active === 'admin';
  const tabValue = isAdmin ? 1 : 0;

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isAdmin ? palette.slate950 : 'background.default',
        backgroundImage: isAdmin
          ? 'radial-gradient(circle at 15% 10%, rgba(79,70,229,0.16), transparent 45%)'
          : 'radial-gradient(circle at 85% 0%, rgba(13,156,144,0.08), transparent 45%)',
        px: 2,
        py: 8,
      }}
    >
      <Container maxWidth="xs">
        <Tabs
          value={tabValue}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 40,
            bgcolor: isAdmin ? 'rgba(255,255,255,0.06)' : 'rgba(20,22,31,0.05)',
            borderRadius: 999,
            p: 0.5,
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab
            component={NextLink}
            href="/login"
            label="Customer"
            sx={{
              minHeight: 34,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 600,
              color: isAdmin ? 'rgba(255,255,255,0.6)' : 'text.secondary',
              '&.Mui-selected': { bgcolor: '#fff', color: 'text.primary', boxShadow: '0 2px 8px rgba(20,22,31,0.1)' },
            }}
          />
          <Tab
            component={NextLink}
            href="/admin/login"
            label="Admin"
            sx={{
              minHeight: 34,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 600,
              color: isAdmin ? 'rgba(255,255,255,0.6)' : 'text.secondary',
              '&.Mui-selected': { bgcolor: palette.indigo, color: '#fff' },
            }}
          />
        </Tabs>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            bgcolor: isAdmin ? 'rgba(255,255,255,0.04)' : '#fff',
            border: '1px solid',
            borderColor: isAdmin ? 'rgba(255,255,255,0.1)' : 'rgba(20,22,31,0.08)',
            boxShadow: isAdmin ? 'none' : '0 24px 48px -28px rgba(20,22,31,0.25)',
          }}
        >
          <Typography variant="h5" sx={{ color: isAdmin ? '#fff' : 'text.primary' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ mt: 0.75, color: isAdmin ? 'rgba(255,255,255,0.55)' : 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
          <Box sx={{ mt: 3 }}>{children}</Box>
        </Paper>
      </Container>
    </Box>
  );
}

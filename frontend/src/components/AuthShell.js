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
            bgcolor: isAdmin ? 'rgba(255,255,255,0.06)' : 'rgba(22,26,32,0.06)',
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
              '&.Mui-selected': { bgcolor: '#fff', color: 'text.primary' },
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
              '&.Mui-selected': { bgcolor: palette.brass, color: '#161A20' },
            }}
          />
        </Tabs>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            bgcolor: isAdmin ? 'rgba(255,255,255,0.04)' : '#fff',
            border: '1px solid',
            borderColor: isAdmin ? 'rgba(255,255,255,0.1)' : 'rgba(22,26,32,0.08)',
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

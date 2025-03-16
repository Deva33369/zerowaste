import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid
} from '@mui/material';
import {
  Lock as LockIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <LockIcon color="error" sx={{ fontSize: 80 }} />
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Access Denied
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          You do not have permission to access this page
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          The page you are trying to access is restricted or requires different user permissions. 
          Please contact an administrator if you believe this is an error.
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              component={Link}
              to={-1}
              color="primary"
            >
              Go Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              component={Link}
              to="/"
              color="primary"
            >
              Go Home
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage; 
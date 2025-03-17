import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NatureIcon from '@mui/icons-material/Nature';
import SchoolIcon from '@mui/icons-material/School';

const Navigation = () => {
  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Explore Our Features
        </Typography>
        <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph>
          Discover all the ways you can help reduce food waste and fight hunger
        </Typography>
        
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <RestaurantIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Browse Food Donations
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, flexGrow: 1 }}>
                Find free food donations available in your community
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to="/food"
              >
                View Donations
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <AddCircleOutlineIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Donate Food
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, flexGrow: 1 }}>
                List surplus food for donation to those in need
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to="/create-food"
              >
                Create Donation
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <StorefrontIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Food Marketplace
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, flexGrow: 1 }}>
                Purchase discounted surplus food from local businesses
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to="/marketplace"
              >
                Shop Deals
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <DeleteOutlineIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Waste Items
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, flexGrow: 1 }}>
                Browse or list non-food waste items for reuse and recycling
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to="/waste-items"
              >
                View Items
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <NatureIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Environmental Impact
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, flexGrow: 1 }}>
                See how your donations help save water, reduce carbon emissions, and conserve land
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to="/environmental-impact"
              >
                Calculate Impact
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <SchoolIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Food Education
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3, flexGrow: 1 }}>
                Learn tips for meal planning, food preservation, and creative recipes to reduce waste
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={RouterLink}
                to="/education"
              >
                Learn More
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Navigation;
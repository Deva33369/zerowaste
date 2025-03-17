import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Stack,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useAuth } from '../context/AuthContext';

// Animated components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <SmartToyIcon fontSize="large" color="primary" />,
      title: 'Smart AI Food Matching',
      description: 'Our AI matches food donations to nearby people based on location, dietary needs, and shelf-life urgency.'
    },
    {
      icon: <RestaurantIcon fontSize="large" color="primary" />,
      title: 'Decentralized Trust Score',
      description: 'Blockchain-based trust system ensures food quality and safety validation before donation pickup.'
    },
    {
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
      title: 'Geo-Tagged Real-Time Pickups',
      description: 'Food is assigned a priority score, ensuring quick delivery before expiration.'
    },
    {
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      title: 'Gamified Social Impact',
      description: 'Users earn rewards or tax incentives for donating frequently, encouraging continued participation.'
    },
    {
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      title: 'AI-Based Expiry Prediction',
      description: 'Supermarkets get alerts to donate items before they expire, reducing waste and increasing donations.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          pt: 8,
          pb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionTypography
                component="h1"
                variant="h2"
                fontWeight="bold"
                gutterBottom
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Reduce Food Waste, Fight Hunger
              </MotionTypography>
              <MotionTypography
                variant="h5"
                paragraph
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                ZeroWaste connects surplus food from restaurants, supermarkets, and individuals
                with people in need, using AI and blockchain technology.
              </MotionTypography>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Stack direction="row" spacing={2} mt={4}>
                  {isAuthenticated() ? (
                    <Button 
                      component={RouterLink} 
                      to="/dashboard" 
                      variant="contained" 
                      color="secondary" 
                      size="large"
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button 
                        component={RouterLink} 
                        to="/register" 
                        variant="contained" 
                        color="secondary" 
                        size="large"
                      >
                        Join Now
                      </Button>
                      <Button 
                        component={RouterLink} 
                        to="/food" 
                        variant="outlined" 
                        color="inherit" 
                        size="large"
                      >
                        Browse Food
                      </Button>
                    </>
                  )}
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                component="img"
                src="https://images.unsplash.com/photo-1488330890490-c291ecf62571?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Food donation"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 5
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h2" color="primary" fontWeight="bold">1.3B</Typography>
              <Typography variant="subtitle1">Tons of food wasted annually</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h2" color="primary" fontWeight="bold">820M</Typography>
              <Typography variant="subtitle1">People suffering from hunger</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h2" color="primary" fontWeight="bold">30%</Typography>
              <Typography variant="subtitle1">Of food production is wasted</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph>
            Our platform uses cutting-edge technology to efficiently redistribute surplus food
          </Typography>
          
          <Grid container spacing={4} mt={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  sx={{ height: '100%' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" paragraph>
            Join our community of donors and recipients to help reduce food waste and fight hunger.
          </Typography>
          <Button 
            component={RouterLink} 
            to="/register" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ mt: 2 }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
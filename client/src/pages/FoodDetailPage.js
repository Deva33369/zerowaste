import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardMedia, 
  Divider, 
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import { format, parseISO, addHours } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isRecipient } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openClaimDialog, setOpenClaimDialog] = useState(false);
  const [claimData, setClaimData] = useState({
    pickupTime: addHours(new Date(), 2),
    notes: ''
  });
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/food/${id}`);
        setFood(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load food details. Please try again later.');
        console.error('Error fetching food details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleClaimDialogOpen = () => {
    if (!isAuthenticated()) {
      showSnackbar('Please log in to claim food', 'warning');
      navigate('/login');
      return;
    }
    
    if (!isRecipient()) {
      showSnackbar('Only recipients can claim food', 'warning');
      return;
    }
    
    setOpenClaimDialog(true);
  };

  const handleClaimDialogClose = () => {
    setOpenClaimDialog(false);
    setClaimError('');
  };

  const handleClaimChange = (name, value) => {
    setClaimData({
      ...claimData,
      [name]: value
    });
  };

  const handleClaimSubmit = async () => {
    try {
      setClaimLoading(true);
      setClaimError('');
      
      const response = await axios.post('/api/claims', {
        food: id,
        pickupTime: claimData.pickupTime,
        notes: claimData.notes
      });
      
      showSnackbar('Food claimed successfully! The donor will be notified.', 'success');
      handleClaimDialogClose();
      
      // Refresh food data to update status
      const updatedFood = await axios.get(`/api/food/${id}`);
      setFood(updatedFood.data);
      
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to claim food. Please try again.');
      console.error('Error claiming food:', err);
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/food')}>
          Back to Food Listings
        </Button>
      </Container>
    );
  }

  if (!food) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Food item not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/food')} sx={{ mt: 2 }}>
          Back to Food Listings
        </Button>
      </Container>
    );
  }

  // Check if food has location data for map
  const hasLocation = food.location && 
                     food.location.coordinates && 
                     food.location.coordinates.length === 2;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/food')} 
        sx={{ mb: 3 }}
      >
        Back to Food Listings
      </Button>
      
      <Grid container spacing={4}>
        {/* Left column - Images and Map */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="300"
              image={food.images && food.images.length > 0 
                ? food.images[0] 
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"}
              alt={food.name}
            />
          </Card>
          
          {hasLocation && (
            <Paper sx={{ height: 300, mb: 3 }}>
              <MapContainer 
                center={[food.location.coordinates[1], food.location.coordinates[0]]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[food.location.coordinates[1], food.location.coordinates[0]]}>
                  <Popup>
                    {food.name} <br />
                    Available for pickup
                  </Popup>
                </Marker>
              </MapContainer>
            </Paper>
          )}
        </Grid>
        
        {/* Right column - Food details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={food.status.toUpperCase()} 
                color={food.status === 'available' ? 'success' : 'default'} 
                sx={{ mb: 2 }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                {food.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {food.description}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <RestaurantIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Quantity:</strong> {food.quantity} {food.unit}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Expires:</strong> {format(parseISO(food.expiryDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Location:</strong> {food.donor?.address?.city || 'Location not specified'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Donated by:</strong> {food.donor?.name || 'Anonymous'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 3 }}>
              {food.status === 'available' ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  fullWidth
                  onClick={handleClaimDialogOpen}
                  disabled={!isAuthenticated() || !isRecipient()}
                >
                  Claim This Food
                </Button>
              ) : (
                <Alert severity="info">
                  This food item has already been claimed
                </Alert>
              )}
              
              {isAuthenticated() && !isRecipient() && food.status === 'available' && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Only recipients can claim food items
                </Typography>
              )}
              
              {!isAuthenticated() && food.status === 'available' && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Please log in as a recipient to claim this food
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Claim Dialog */}
      <Dialog open={openClaimDialog} onClose={handleClaimDialogClose}>
        <DialogTitle>Claim Food Item</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide details for your pickup:
          </DialogContentText>
          
          {claimError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {claimError}
            </Alert>
          )}
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Pickup Time"
              value={claimData.pickupTime}
              onChange={(newValue) => handleClaimChange('pickupTime', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
              minDateTime={new Date()}
              maxDateTime={parseISO(food.expiryDate)}
            />
          </LocalizationProvider>
          
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label="Additional Notes"
            name="notes"
            multiline
            rows={3}
            value={claimData.notes}
            onChange={(e) => handleClaimChange('notes', e.target.value)}
            placeholder="Any dietary restrictions, allergies, or special instructions..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClaimDialogClose}>Cancel</Button>
          <Button 
            onClick={handleClaimSubmit} 
            variant="contained" 
            disabled={claimLoading}
          >
            {claimLoading ? 'Submitting...' : 'Confirm Claim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FoodDetailPage; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  InputAdornment,
  FormHelperText,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { format, addDays } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const unitOptions = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'l', label: 'Liters (l)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'pcs', label: 'Pieces' },
  { value: 'servings', label: 'Servings' },
  { value: 'packages', label: 'Packages' }
];

const steps = ['Basic Information', 'Details & Location', 'Review & Submit'];

const CreateFoodPage = () => {
  const navigate = useNavigate();
  const { user, isDonor } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    expiryDate: addDays(new Date(), 3),
    description: '',
    images: [],
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    }
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle date change
  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      expiryDate: newDate
    });
    
    // Clear error
    if (formErrors.expiryDate) {
      setFormErrors({
        ...formErrors,
        expiryDate: ''
      });
    }
  };
  
  // Handle location change
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    
    // Parse coordinates as numbers
    const numValue = parseFloat(value);
    
    if (name === 'longitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: [numValue, formData.location.coordinates[1]]
        }
      });
    } else if (name === 'latitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: [formData.location.coordinates[0], numValue]
        }
      });
    }
    
    // Clear error
    if (formErrors.location) {
      setFormErrors({
        ...formErrors,
        location: ''
      });
    }
  };
  
  // Validate form based on current step
  const validateStep = () => {
    const errors = {};
    
    if (activeStep === 0) {
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!formData.quantity) {
        errors.quantity = 'Quantity is required';
      } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
        errors.quantity = 'Quantity must be a positive number';
      }
      
      if (!formData.unit) {
        errors.unit = 'Unit is required';
      }
    }
    
    if (activeStep === 1) {
      if (!formData.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
      } else if (formData.expiryDate < new Date()) {
        errors.expiryDate = 'Expiry date cannot be in the past';
      }
      
      if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
        errors.location = 'Please provide location coordinates';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await axios.post('/api/food', formData);
      
      showSnackbar('Food donation created successfully!', 'success');
      navigate(`/food/${response.data._id}`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create food donation. Please try again.');
      console.error('Error creating food donation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render form steps
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                label="Food Name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="e.g., Fresh Bread, Canned Soup, Vegetables"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="quantity"
                name="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="unit"
                name="unit"
                select
                label="Unit"
                value={formData.unit}
                onChange={handleChange}
                error={!!formErrors.unit}
                helperText={formErrors.unit || 'Select the unit of measurement'}
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      required 
                      error={!!formErrors.expiryDate}
                      helperText={formErrors.expiryDate}
                    />
                  )}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the food, such as ingredients, allergens, or preparation instructions"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Location
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="longitude"
                    name="longitude"
                    label="Longitude"
                    type="number"
                    value={formData.location.coordinates[0]}
                    onChange={handleLocationChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddLocationIcon />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ step: 0.000001 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="latitude"
                    name="latitude"
                    label="Latitude"
                    type="number"
                    value={formData.location.coordinates[1]}
                    onChange={handleLocationChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddLocationIcon />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ step: 0.000001 }}
                  />
                </Grid>
              </Grid>
              {formErrors.location && (
                <FormHelperText error>{formErrors.location}</FormHelperText>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tip: You can find your coordinates by right-clicking on Google Maps and selecting "What's here?"
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  // Image upload functionality would be implemented here
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Image upload is currently disabled in this demo
              </Typography>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Donation
              </Typography>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Food Name:</Typography>
                    <Typography variant="body1" gutterBottom>{formData.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Quantity:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.quantity} {formData.unit}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Expiry Date:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {format(formData.expiryDate, 'MMMM dd, yyyy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Location:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formData.location.coordinates[0]}, {formData.location.coordinates[1]}
                    </Typography>
                  </Grid>
                  {formData.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Description:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {formData.description}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };
  
  // Redirect if not a donor
  if (!isDonor()) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Only donors can create food donations. Please register as a donor to continue.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/food')} sx={{ mt: 2 }}>
          Back to Food Listings
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Donate Food
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Donation'
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateFoodPage; 
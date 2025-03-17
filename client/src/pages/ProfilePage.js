import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    lat: '',
    lng: '',
    userType: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Initialize form data from user context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: user.phone || '',
        city: user.location?.city || '',
        state: user.location?.state || '',
        lat: user.location?.coordinates?.[1] || '',
        lng: user.location?.coordinates?.[0] || '',
        userType: user.userType || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;

    // Validate password match if either field is filled
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        isValid = false;
      } else if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Prepare data for API call
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: {
          city: formData.city,
          state: formData.state,
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
        }
      };
      
      // Only include password if it was provided
      if (formData.password) {
        userData.password = formData.password;
      }
      
      const response = await updateProfile(userData);
      
      // Update the user in the auth context
      updateUser(response.data);
      
      setSuccess('Profile updated successfully');
      setEditMode(false);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: user.phone || '',
        city: user.location?.city || '',
        state: user.location?.state || '',
        lat: user.location?.coordinates?.[1] || '',
        lng: user.location?.coordinates?.[0] || '',
        userType: user.userType || ''
      });
    }
    
    setEditMode(false);
    setError(null);
    setSuccess(null);
    setPasswordError('');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and update your personal information
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.userType === 'donor' ? 'Donor' : 'Recipient'}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Box>
            
            {user.phone && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1">
                  {user.phone}
                </Typography>
              </Box>
            )}
            
            {user.location && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {user.location.city}, {user.location.state}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => setEditMode(true)}
                disabled={editMode}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Profile Edit Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                {editMode ? 'Edit Profile Information' : 'Profile Information'}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                {/* Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    required
                  />
                </Grid>
                
                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    required
                  />
                </Grid>
                
                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                {/* User Type (readonly) */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled>
                    <InputLabel>User Type</InputLabel>
                    <Select
                      value={formData.userType}
                      name="userType"
                      label="User Type"
                    >
                      <MenuItem value="donor">Donor</MenuItem>
                      <MenuItem value="recipient">Recipient</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                    <FormHelperText>User type cannot be changed</FormHelperText>
                  </FormControl>
                </Grid>
                
                {/* Location Fields */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Location Information
                  </Typography>
                </Grid>
                
                {/* City */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    fullWidth
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                {/* State */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    fullWidth
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                {/* Latitude */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Latitude"
                    fullWidth
                    name="lat"
                    type="number"
                    value={formData.lat}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    inputProps={{ step: "0.000001" }}
                  />
                </Grid>
                
                {/* Longitude */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Longitude"
                    fullWidth
                    name="lng"
                    type="number"
                    value={formData.lng}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    inputProps={{ step: "0.000001" }}
                  />
                </Grid>
                
                {/* Password Fields (only show when editing) */}
                {editMode && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Change Password (leave blank to keep current password)
                      </Typography>
                    </Grid>
                    
                    {/* New Password */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="New Password"
                        fullWidth
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    
                    {/* Confirm Password */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Confirm Password"
                        fullWidth
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!passwordError}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              
              {/* Buttons */}
              {editMode && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ mr: 2 }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage; 
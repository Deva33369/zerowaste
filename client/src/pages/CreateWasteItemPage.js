import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Breadcrumbs,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getCategories } from '../services/categoryService';
import { createWasteItem } from '../services/wasteItemService';
import { uploadMultipleImages } from '../services/uploadService';

const conditionOptions = [
  { value: 'New', label: 'New' },
  { value: 'Like New', label: 'Like New' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' }
];

const CreateWasteItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
    },
    images: []
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Redirect if user is not a donor
    if (user && user.userType !== 'donor') {
      navigate('/dashboard');
    }
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, [navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (imageFiles.length + files.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }
    
    // Create preview URLs for the images
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);
    
    const newImagePreviewUrls = newImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleRemoveImage = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    const newImagePreviewUrls = newImageFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    setUploadingImages(true);
    try {
      const response = await uploadMultipleImages(imageFiles);
      setUploadingImages(false);
      return response.data;
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      setUploadingImages(false);
      return [];
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.condition) {
      errors.condition = 'Condition is required';
    }
    
    if (!formData.location.city.trim()) {
      errors['location.city'] = 'City is required';
    }
    
    if (!formData.location.state.trim()) {
      errors['location.state'] = 'State is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Upload images first
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const uploadedImages = await uploadImages();
        imageUrls = uploadedImages.map(img => img.url);
      }
      
      // Create waste item with image URLs
      const itemData = {
        ...formData,
        images: imageUrls
      };
      
      await createWasteItem(itemData);
      
      // Redirect to waste items page on success
      navigate('/waste-items', { state: { message: 'Item created successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/waste-items" style={{ textDecoration: 'none', color: 'inherit' }}>
          Browse Items
        </Link>
        <Typography color="text.primary">Create New Item</Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Offer a New Item
        </Typography>

        <Typography variant="body1" paragraph color="text.secondary">
          Fill out the form below to list your item for others to request.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={!!formErrors.description}
                helperText={formErrors.description}
                placeholder="Describe the item, including its size, color, and any other relevant details."
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <Typography variant="caption" color="error">
                    {formErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Condition */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.condition}>
                <InputLabel id="condition-label">Condition</InputLabel>
                <Select
                  labelId="condition-label"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  label="Condition"
                >
                  {conditionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.condition && (
                  <Typography variant="caption" color="error">
                    {formErrors.condition}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Location Fields */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Location Information
              </Typography>
            </Grid>

            {/* Address (Optional) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address (Optional)"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                helperText="This will not be shown publicly, only the city and state"
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                error={!!formErrors['location.city']}
                helperText={formErrors['location.city']}
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="location.state"
                value={formData.location.state}
                onChange={handleInputChange}
                error={!!formErrors['location.state']}
                helperText={formErrors['location.state']}
              />
            </Grid>

            {/* Postal Code (Optional) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code (Optional)"
                name="location.postalCode"
                value={formData.location.postalCode}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Images */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Images
              </Typography>
              
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageChange}
              />
              
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoIcon />}
                  sx={{ mb: 2 }}
                >
                  Add Images (Up to 5)
                </Button>
              </label>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adding clear photos increases the chance of your item being requested.
              </Typography>
              
              {imagePreviewUrls.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {imagePreviewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                          }
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  component={Link}
                  to="/waste-items"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || uploadingImages}
                  sx={{ minWidth: 120 }}
                >
                  {loading || uploadingImages ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Submit Item'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateWasteItemPage;
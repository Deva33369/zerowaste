import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { format, isAfter, parseISO } from 'date-fns';
import axios from 'axios';

const FoodListingPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    expiryDate: 'all',
    sortBy: 'expiryDate'
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/food');
        setFoods(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load food listings. Please try again later.');
        console.error('Error fetching food listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort the food items
  const filteredFoods = foods.filter(food => {
    // Only show available food
    if (food.status !== 'available') return false;
    
    // Search filter
    if (searchTerm && !food.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !food.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Expiry date filter
    if (filters.expiryDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const expiryDate = parseISO(food.expiryDate);
      if (expiryDate < today || expiryDate >= tomorrow) return false;
    } else if (filters.expiryDate === 'week') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const expiryDate = parseISO(food.expiryDate);
      if (expiryDate < today || expiryDate >= nextWeek) return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'expiryDate') {
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    } else if (filters.sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const displayedFoods = filteredFoods.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Food Donations
      </Typography>
      
      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="expiry-date-label">Expiry Date</InputLabel>
              <Select
                labelId="expiry-date-label"
                id="expiryDate"
                name="expiryDate"
                value={filters.expiryDate}
                onChange={handleFilterChange}
                label="Expiry Date"
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Expires Today</MenuItem>
                <MenuItem value="week">Expires This Week</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                label="Sort By"
              >
                <MenuItem value="expiryDate">Expiry Date (Soonest First)</MenuItem>
                <MenuItem value="createdAt">Recently Added</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredFoods.length} {filteredFoods.length === 1 ? 'result' : 'results'}
        </Typography>
      </Box>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Food listings */}
          {displayedFoods.length > 0 ? (
            <Grid container spacing={3}>
              {displayedFoods.map((food) => (
                <Grid item xs={12} sm={6} md={4} key={food._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={food.images && food.images.length > 0 
                        ? food.images[0] 
                        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"}
                      alt={food.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {food.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {food.description?.substring(0, 100)}
                        {food.description?.length > 100 ? '...' : ''}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <RestaurantIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {food.quantity} {food.unit}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          Expires: {format(parseISO(food.expiryDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {food.donor?.address?.city || 'Location not specified'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary" 
                        component={RouterLink} 
                        to={`/food/${food._id}`}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No food donations found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filters, or check back later for new donations.
              </Typography>
            </Box>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default FoodListingPage; 
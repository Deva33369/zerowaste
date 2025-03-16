import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
  Paper,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Alert,
  AlertTitle,
  Breadcrumbs
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { getWasteItemById, deleteWasteItem, updateWasteItem } from '../services/wasteItemService';
import { createRequest } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

// Default image if none is available
const DEFAULT_IMAGE = '/images/default-item.jpg';

const WasteItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // For request dialog
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  
  // For delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // For success message after a request is submitted
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await getWasteItemById(id);
        setItem(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load waste item. It may have been removed or you may not have permission to view it.');
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleOpenRequestDialog = () => {
    setOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
    setRequestMessage('');
    setRequestError(null);
  };

  const handleRequestSubmit = async () => {
    setRequestLoading(true);
    setRequestError(null);
    
    try {
      await createRequest({
        wasteItem: id,
        message: requestMessage
      });
      
      setRequestLoading(false);
      setOpenRequestDialog(false);
      setRequestSuccess(true);
      
      // Clear the form
      setRequestMessage('');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Failed to submit request. Please try again.');
      setRequestLoading(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteItem = async () => {
    setDeleteLoading(true);
    
    try {
      await deleteWasteItem(id);
      navigate('/waste-items', { state: { message: 'Item successfully deleted' } });
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  // Prepare gallery images
  const galleryImages = item?.images?.length 
    ? item.images.map(img => ({
        original: img,
        thumbnail: img,
      }))
    : [
        {
          original: DEFAULT_IMAGE,
          thumbnail: DEFAULT_IMAGE,
        }
      ];

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Button 
          component={Link} 
          to="/waste-items" 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Browse
        </Button>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          <AlertTitle>Item Not Found</AlertTitle>
          The requested waste item could not be found.
        </Alert>
        <Button 
          component={Link} 
          to="/waste-items" 
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Browse
        </Button>
      </Container>
    );
  }

  const isOwner = user && item.user._id === user._id;
  const isAvailable = item.status === 'available';
  const formattedDate = format(new Date(item.createdAt), 'PPP');
  const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Typography color="text.primary">{item.title}</Typography>
      </Breadcrumbs>

      {/* Success Message */}
      {requestSuccess && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => setRequestSuccess(false)}
        >
          <AlertTitle>Request Submitted!</AlertTitle>
          Your request has been sent to the donor. You can view the status in your requests page.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left column - Images */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              mb: 2
            }}
          >
            <ImageGallery 
              items={galleryImages} 
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
              thumbnailPosition="bottom"
            />
          </Paper>
        </Grid>

        {/* Right column - Item Details */}
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start', 
              mb: 2 
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {item.title}
            </Typography>
            
            <Chip 
              label={item.status} 
              color={item.status === 'available' ? 'success' : 'default'} 
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={item.condition} 
              size="medium" 
              color={
                item.condition === 'New' ? 'success' : 
                item.condition === 'Like New' ? 'primary' :
                item.condition === 'Good' ? 'info' :
                item.condition === 'Fair' ? 'warning' : 'default'
              }
              sx={{ mr: 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {item.category.name}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" paragraph>
            {item.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Details:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {timeAgo}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Posted on {formattedDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {item.location.city}, {item.location.state}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Donor Information */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Offered by:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {item.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {format(new Date(item.user.createdAt), 'MMMM yyyy')}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Action Buttons */}
          {isOwner ? (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                component={Link}
                to={`/waste-items/edit/${item._id}`}
                fullWidth
              >
                Edit Item
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteDialog}
                fullWidth
              >
                Delete Item
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={!isAuthenticated || !isAvailable || user?.userType !== 'recipient'}
                onClick={handleOpenRequestDialog}
              >
                {!isAuthenticated
                  ? 'Log in to Request'
                  : !isAvailable
                  ? 'Item Not Available'
                  : user?.userType !== 'recipient'
                  ? 'Only Recipients Can Request'
                  : 'Request This Item'}
              </Button>
              {!isAuthenticated && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    Log in
                  </Link>{' '}
                  or{' '}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    Register
                  </Link>{' '}
                  to request this item
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Request Dialog */}
      <Dialog 
        open={openRequestDialog} 
        onClose={handleCloseRequestDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Item: {item.title}</DialogTitle>
        <DialogContent>
          {requestError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {requestError}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" paragraph>
            Send a message to the donor explaining why you're interested in this item.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Your Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            placeholder="Introduce yourself and explain how you'll use this item..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog} disabled={requestLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRequestSubmit} 
            variant="contained" 
            color="primary"
            disabled={!requestMessage.trim() || requestLoading}
          >
            {requestLoading ? <CircularProgress size={24} /> : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteItem} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WasteItemDetailPage; 
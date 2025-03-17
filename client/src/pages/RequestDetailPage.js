import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  CancelOutlined as CancelIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { 
  getRequestById, 
  updateRequestStatus, 
  cancelRequest 
} from '../services/requestService';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isDonor } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Dialog states
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getRequestById(id);
        setRequest(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load request details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRequestData();
  }, [id]);

  const handleAccept = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    setError(null);
    
    try {
      const response = await updateRequestStatus(id, 'accepted', dialogMessage);
      setRequest(response.data);
      setActionSuccess('Request accepted successfully');
      setOpenAcceptDialog(false);
      setDialogMessage('');
    } catch (err) {
      setError('Failed to accept request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleReject = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    setError(null);
    
    try {
      const response = await updateRequestStatus(id, 'rejected', dialogMessage);
      setRequest(response.data);
      setActionSuccess('Request rejected successfully');
      setOpenRejectDialog(false);
      setDialogMessage('');
    } catch (err) {
      setError('Failed to reject request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleComplete = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    setError(null);
    
    try {
      const response = await updateRequestStatus(id, 'completed', dialogMessage);
      setRequest(response.data);
      setActionSuccess('Request marked as completed successfully');
      setOpenCompleteDialog(false);
      setDialogMessage('');
    } catch (err) {
      setError('Failed to complete request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    setError(null);
    
    try {
      const response = await cancelRequest(id, dialogMessage);
      setRequest(response.data);
      setActionSuccess('Request cancelled successfully');
      setOpenCancelDialog(false);
      setDialogMessage('');
    } catch (err) {
      setError('Failed to cancel request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Dialog handlers
  const handleDialogClose = () => {
    setOpenCancelDialog(false);
    setOpenRejectDialog(false);
    setOpenAcceptDialog(false);
    setOpenCompleteDialog(false);
    setDialogMessage('');
  };

  const getStatusChip = (status) => {
    switch(status) {
      case 'pending':
        return <Chip label="Pending" color="warning" />;
      case 'accepted':
        return <Chip label="Accepted" color="info" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" />;
      case 'completed':
        return <Chip label="Completed" color="success" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="default" />;
      default:
        return <Chip label={status} color="default" />;
    }
  };

  // Determine if the user can perform actions
  const canTakeAction = (action) => {
    if (!request || !user) return false;
    
    const isRequestor = request.user._id === user._id;
    const isItemOwner = request.wasteItem.user._id === user._id;
    
    switch (action) {
      case 'accept':
        return isItemOwner && request.status === 'pending';
      case 'reject':
        return isItemOwner && request.status === 'pending';
      case 'complete':
        return (isItemOwner || isRequestor) && request.status === 'accepted';
      case 'cancel':
        return isRequestor && ['pending', 'accepted'].includes(request.status);
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !request) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Request not found
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
      
      {/* Page title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Request Details
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {actionSuccess}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Left column - Item details */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={
                request.wasteItem.images && request.wasteItem.images.length > 0
                  ? request.wasteItem.images[0]
                  : '/images/default-item.jpg'
              }
              alt={request.wasteItem.title}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" component="div">
                  {request.wasteItem.title}
                </Typography>
                <Box>
                  {getStatusChip(request.status)}
                </Box>
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {request.wasteItem.description}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Category
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {request.wasteItem.category.name}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Condition
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {request.wasteItem.condition}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <LocationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {request.wasteItem.location.city}, {request.wasteItem.location.state}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Listed {formatDistanceToNow(new Date(request.wasteItem.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to={`/waste-items/${request.wasteItem._id}`}
                >
                  View Full Item Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column - Request details and actions */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Request Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {isDonor() ? 'Requested by' : 'Offered by'}
                      </Typography>
                      <Typography variant="body1">
                        {isDonor() ? request.user.name : request.wasteItem.user.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Request Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(request.createdAt), 'PPP')}
                  </Typography>
                </Grid>
                
                {request.message && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Message
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body1">
                        {request.message}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {request.responseMessage && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Response
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body1">
                        {request.responseMessage}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {request.status !== 'pending' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Status Updated
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(request.updatedAt), 'PPP')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {canTakeAction('accept') && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckIcon />}
                  onClick={() => setOpenAcceptDialog(true)}
                  disabled={actionLoading}
                  fullWidth
                >
                  Accept Request
                </Button>
              )}
              
              {canTakeAction('reject') && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setOpenRejectDialog(true)}
                  disabled={actionLoading}
                  fullWidth
                >
                  Reject Request
                </Button>
              )}
              
              {canTakeAction('complete') && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={() => setOpenCompleteDialog(true)}
                  disabled={actionLoading}
                  fullWidth
                >
                  Mark as Completed
                </Button>
              )}
              
              {canTakeAction('cancel') && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setOpenCancelDialog(true)}
                  disabled={actionLoading}
                  fullWidth
                >
                  Cancel Request
                </Button>
              )}
            </Box>
          </Paper>
          
          {/* Contact information */}
          {request.status === 'accepted' && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {isDonor() ? 'Recipient' : 'Donor'}
                </Typography>
                <Typography variant="body1">
                  {isDonor() ? request.user.name : request.wasteItem.user.name}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1">
                  {isDonor() ? request.user.email : request.wasteItem.user.email}
                </Typography>
              </Box>
              
              {(isDonor() ? request.user.phone : request.wasteItem.user.phone) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {isDonor() ? request.user.phone : request.wasteItem.user.phone}
                  </Typography>
                </Box>
              )}
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<MessageIcon />}
                component="a"
                href={`mailto:${isDonor() ? request.user.email : request.wasteItem.user.email}`}
                fullWidth
                sx={{ mt: 2 }}
              >
                Contact via Email
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Confirmation Dialogs */}
      {/* Accept Dialog */}
      <Dialog
        open={openAcceptDialog}
        onClose={handleDialogClose}
        aria-labelledby="accept-dialog-title"
      >
        <DialogTitle id="accept-dialog-title">
          Accept Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to accept this request? 
            This will notify the requester and share your contact information with them.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Add a message (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={dialogMessage}
            onChange={(e) => setDialogMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleAccept} 
            color="primary" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Accept'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={handleDialogClose}
        aria-labelledby="reject-dialog-title"
      >
        <DialogTitle id="reject-dialog-title">
          Reject Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this request? 
            You can optionally provide a reason for the rejection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Reason for rejection (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={dialogMessage}
            onChange={(e) => setDialogMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Complete Dialog */}
      <Dialog
        open={openCompleteDialog}
        onClose={handleDialogClose}
        aria-labelledby="complete-dialog-title"
      >
        <DialogTitle id="complete-dialog-title">
          Mark as Completed
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this exchange as completed? 
            This confirms that the item has been successfully handed over.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Add a final note (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={dialogMessage}
            onChange={(e) => setDialogMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleComplete} 
            color="success" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Complete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleDialogClose}
        aria-labelledby="cancel-dialog-title"
      >
        <DialogTitle id="cancel-dialog-title">
          Cancel Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your request for this item? 
            You can optionally provide a reason for cancellation.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Reason for cancellation (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={dialogMessage}
            onChange={(e) => setDialogMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Go Back
          </Button>
          <Button 
            onClick={handleCancel} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Cancel Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequestDetailPage; 
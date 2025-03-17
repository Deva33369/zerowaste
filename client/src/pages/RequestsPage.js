import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';

import { getUserRequests, updateRequestStatus, cancelRequest } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

// Status colors for request chips
const statusColors = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
  canceled: 'default',
  completed: 'info'
};

// Tab panel component for the different tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`requests-tabpanel-${index}`}
      aria-labelledby={`requests-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const RequestsPage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    text: '',
    action: null,
    requestId: null,
    status: null
  });

  // Rejection/cancellation reason state
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getUserRequests();
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load requests. Please try again.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenConfirmDialog = (requestId, status, title, text) => {
    setConfirmDialog({
      open: true,
      title,
      text,
      requestId,
      status,
      action: status === 'canceled' ? handleCancelRequest : handleUpdateStatus
    });
    
    // Reset reason if opening a new dialog
    setReason('');
    setReasonError(false);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false
    });
  };

  const handleUpdateStatus = async () => {
    if ((confirmDialog.status === 'rejected') && !reason.trim()) {
      setReasonError(true);
      return;
    }
    
    try {
      const data = { status: confirmDialog.status };
      if (confirmDialog.status === 'rejected') {
        data.rejectionReason = reason;
      }
      
      const response = await updateRequestStatus(confirmDialog.requestId, data);
      
      // Update the requests list
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === confirmDialog.requestId ? response.data : req
        )
      );
      
      handleCloseConfirmDialog();
    } catch (err) {
      setError('Failed to update request status. Please try again.');
    }
  };

  const handleCancelRequest = async () => {
    if (!reason.trim()) {
      setReasonError(true);
      return;
    }
    
    try {
      const response = await cancelRequest(confirmDialog.requestId, reason);
      
      // Update the requests list
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === confirmDialog.requestId ? response.data : req
        )
      );
      
      handleCloseConfirmDialog();
    } catch (err) {
      setError('Failed to cancel request. Please try again.');
    }
  };

  // Filter requests based on user type and status
  const getFilteredRequests = () => {
    if (!user) return [];

    const isDonor = user.userType === 'donor';
    
    // Filter based on tab value
    let filteredRequests = requests.filter(request => {
      if (tabValue === 0) {
        // Active (pending or accepted)
        return ['pending', 'accepted'].includes(request.status);
      } else if (tabValue === 1) {
        // Completed
        return request.status === 'completed';
      } else {
        // Closed (rejected or canceled)
        return ['rejected', 'canceled'].includes(request.status);
      }
    });
    
    return filteredRequests;
  };

  // Get paginated results
  const getPaginatedRequests = () => {
    const filteredRequests = getFilteredRequests();
    return filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const isDonor = user?.userType === 'donor';
  const paginatedRequests = getPaginatedRequests();
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, getFilteredRequests().length - page * rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Requests
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChangeTab} 
          aria-label="requests tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Active" id="requests-tab-0" aria-controls="requests-tabpanel-0" />
          <Tab label="Completed" id="requests-tab-1" aria-controls="requests-tabpanel-1" />
          <Tab label="Closed" id="requests-tab-2" aria-controls="requests-tabpanel-2" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderRequestsTable(paginatedRequests, emptyRows, isDonor)}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderRequestsTable(paginatedRequests, emptyRows, isDonor)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderRequestsTable(paginatedRequests, emptyRows, isDonor)}
      </TabPanel>

      <TablePagination
        component="div"
        count={getFilteredRequests().length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.text}
          </DialogContentText>
          
          {(confirmDialog.status === 'rejected' || confirmDialog.status === 'canceled') && (
            <TextField
              margin="dense"
              id="reason"
              label="Reason (Required)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setReasonError(false);
              }}
              error={reasonError}
              helperText={reasonError ? 'Please provide a reason' : ''}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button 
            onClick={confirmDialog.action} 
            color={confirmDialog.status === 'accepted' ? 'success' : 'primary'} 
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

  function renderRequestsTable(paginatedRequests, emptyRows, isDonor) {
    if (paginatedRequests.length === 0 && !emptyRows) {
      return (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No requests found in this category.
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table aria-label="requests table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>{isDonor ? 'Recipient' : 'Donor'}</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequests.map((request) => {
              const { wasteItem, createdAt, status } = request;
              const otherUser = isDonor ? request.user : wasteItem.user;
              
              // Determine what actions are available based on status and user type
              const canAccept = isDonor && status === 'pending';
              const canReject = isDonor && status === 'pending';
              const canComplete = isDonor && status === 'accepted';
              const canCancel = !isDonor && (status === 'pending' || status === 'accepted');
              
              return (
                <TableRow key={request._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {wasteItem.images && wasteItem.images.length > 0 ? (
                        <Avatar
                          variant="rounded"
                          src={wasteItem.images[0]}
                          alt={wasteItem.title}
                          sx={{ width: 50, height: 50, mr: 2 }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{ width: 50, height: 50, mr: 2, bgcolor: 'grey.300' }}
                        >
                          ?
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="subtitle2" component={Link} to={`/waste-items/${wasteItem._id}`} sx={{ textDecoration: 'none' }}>
                          {wasteItem.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {wasteItem.category.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="body2">
                        {otherUser.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={status.charAt(0).toUpperCase() + status.slice(1)} 
                      color={statusColors[status]} 
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          component={Link} 
                          to={`/requests/${request._id}`}
                          color="primary"
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {canAccept && (
                        <Tooltip title="Accept Request">
                          <IconButton 
                            color="success"
                            onClick={() => handleOpenConfirmDialog(
                              request._id, 
                              'accepted', 
                              'Accept Request', 
                              'Are you sure you want to accept this request? The recipient will be notified.'
                            )}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {canReject && (
                        <Tooltip title="Reject Request">
                          <IconButton 
                            color="error"
                            onClick={() => handleOpenConfirmDialog(
                              request._id, 
                              'rejected', 
                              'Reject Request', 
                              'Please provide a reason for rejecting this request.'
                            )}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {canComplete && (
                        <Tooltip title="Mark as Completed">
                          <IconButton 
                            color="info"
                            onClick={() => handleOpenConfirmDialog(
                              request._id, 
                              'completed', 
                              'Mark as Completed', 
                              'Are you sure this request has been completed? This will update the item status to donated.'
                            )}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {canCancel && (
                        <Tooltip title="Cancel Request">
                          <IconButton 
                            color="default"
                            onClick={() => handleOpenConfirmDialog(
                              request._id, 
                              'canceled', 
                              'Cancel Request', 
                              'Please provide a reason for canceling this request.'
                            )}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 73 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default RequestsPage; 
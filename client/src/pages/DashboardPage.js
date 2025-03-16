import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  RecyclingOutlined as RecycleIcon,
  ShoppingBagOutlined as RequestIcon,
  CheckCircleOutline as CheckIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';

import { useAuth } from '../context/AuthContext';
import { getUserWasteItems } from '../services/wasteItemService';
import { getUserRequests } from '../services/requestService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const DashboardPage = () => {
  const { user, isDonor } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user's waste items if they are a donor
        if (isDonor()) {
          const itemsResponse = await getUserWasteItems();
          setMyItems(itemsResponse.data);
        }
        
        // Fetch user's requests for all users
        const requestsResponse = await getUserRequests();
        setMyRequests(requestsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isDonor]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter requests based on status
  const getActiveRequests = () => {
    return myRequests.filter(request => 
      ['pending', 'accepted'].includes(request.status)
    );
  };
  
  const getCompletedRequests = () => {
    return myRequests.filter(request => 
      request.status === 'completed'
    );
  };

  // Get recent items/requests for summary
  const getRecentItems = () => {
    return myItems.slice(0, 3);
  };
  
  const getRecentRequests = () => {
    return myRequests.slice(0, 3);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name}! Manage your {isDonor() ? 'donations' : 'requests'} here.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              {isDonor() ? <RecycleIcon fontSize="large" /> : <RequestIcon fontSize="large" />}
            </Box>
            <Typography variant="h4" component="div">
              {isDonor() ? myItems.length : myRequests.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isDonor() ? 'Total Items Offered' : 'Total Requests Made'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'warning.main' }}>
              <TimeIcon fontSize="large" />
            </Box>
            <Typography variant="h4" component="div">
              {isDonor() 
                ? myItems.filter(item => item.status === 'available').length 
                : myRequests.filter(req => req.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isDonor() ? 'Available Items' : 'Pending Requests'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'info.main' }}>
              <RequestIcon fontSize="large" />
            </Box>
            <Typography variant="h4" component="div">
              {isDonor()
                ? myRequests.filter(req => 
                    req.wasteItem.user._id === user?._id && req.status === 'pending'
                  ).length
                : myRequests.filter(req => req.status === 'accepted').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isDonor() ? 'Incoming Requests' : 'Accepted Requests'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <CheckIcon fontSize="large" />
            </Box>
            <Typography variant="h4" component="div">
              {myRequests.filter(req => req.status === 'completed').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed Exchanges
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isDonor() && getRecentItems().length > 0 ? (
              <List>
                {getRecentItems().map((item) => (
                  <ListItem
                    key={item._id}
                    alignItems="flex-start"
                    sx={{ px: 0, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={item.images && item.images.length > 0 ? item.images[0] : undefined}
                        alt={item.title}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link to={`/waste-items/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="subtitle2">{item.title}</Typography>
                        </Link>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {item.category.name}
                          </Typography>
                          {" — "}
                          <Typography component="span" variant="body2">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </Typography>
                        </>
                      }
                    />
                    <Chip 
                      label={item.status} 
                      size="small" 
                      color={item.status === 'available' ? 'success' : 'default'} 
                    />
                  </ListItem>
                ))}
              </List>
            ) : getRecentRequests().length > 0 ? (
              <List>
                {getRecentRequests().map((request) => (
                  <ListItem
                    key={request._id}
                    alignItems="flex-start"
                    sx={{ px: 0, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={request.wasteItem.images && request.wasteItem.images.length > 0 
                          ? request.wasteItem.images[0] 
                          : undefined}
                        alt={request.wasteItem.title}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link to={`/waste-items/${request.wasteItem._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="subtitle2">{request.wasteItem.title}</Typography>
                        </Link>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </Typography>
                        </>
                      }
                    />
                    <Chip 
                      label={request.status} 
                      size="small" 
                      color={
                        request.status === 'pending' ? 'warning' :
                        request.status === 'accepted' ? 'info' :
                        request.status === 'completed' ? 'success' :
                        'default'
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No recent activity found.
              </Typography>
            )}
            
            <Button 
              component={Link} 
              to={isDonor() ? "/waste-items" : "/requests"} 
              fullWidth 
              sx={{ mt: 2 }}
            >
              View All
            </Button>
          </Paper>
          
          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isDonor() ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                component={Link}
                to="/waste-items/create"
                sx={{ mb: 2 }}
              >
                Offer New Item
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<RequestIcon />}
                fullWidth
                component={Link}
                to="/waste-items"
                sx={{ mb: 2 }}
              >
                Browse Items
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              fullWidth
              component={Link}
              to="/profile"
            >
              View Profile
            </Button>
          </Paper>
        </Grid>
        
        {/* Right Column - Detailed Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                aria-label="dashboard tabs"
              >
                <Tab label={isDonor() ? "My Items" : "My Requests"} id="dashboard-tab-0" />
                <Tab label="Active" id="dashboard-tab-1" />
                <Tab label="Completed" id="dashboard-tab-2" />
              </Tabs>
            </Box>
            
            {/* All Items/Requests Tab */}
            <TabPanel value={tabValue} index={0}>
              {isDonor() ? (
                myItems.length > 0 ? (
                  <Grid container spacing={3}>
                    {myItems.map((item) => (
                      <Grid item xs={12} sm={6} key={item._id}>
                        <Card>
                          <CardActionArea component={Link} to={`/waste-items/${item._id}`}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={item.images && item.images.length > 0 ? item.images[0] : '/images/default-item.jpg'}
                              alt={item.title}
                            />
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" component="div">
                                  {item.title}
                                </Typography>
                                <Chip 
                                  label={item.status} 
                                  size="small" 
                                  color={item.status === 'available' ? 'success' : 'default'} 
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {item.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </Typography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Button size="small" component={Link} to={`/waste-items/${item._id}`}>
                              View Details
                            </Button>
                            {item.status === 'available' && (
                              <Box sx={{ ml: 'auto' }}>
                                <Typography variant="body2" color="text.secondary">
                                  {item.requests?.length || 0} requests
                                </Typography>
                              </Box>
                            )}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      You haven't offered any items yet.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      component={Link}
                      to="/waste-items/create"
                    >
                      Offer an Item
                    </Button>
                  </Box>
                )
              ) : (
                myRequests.length > 0 ? (
                  <Grid container spacing={3}>
                    {myRequests.map((request) => (
                      <Grid item xs={12} sm={6} key={request._id}>
                        <Card>
                          <CardActionArea component={Link} to={`/requests/${request._id}`}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={request.wasteItem.images && request.wasteItem.images.length > 0 
                                ? request.wasteItem.images[0] 
                                : '/images/default-item.jpg'}
                              alt={request.wasteItem.title}
                            />
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" component="div">
                                  {request.wasteItem.title}
                                </Typography>
                                <Chip 
                                  label={request.status} 
                                  size="small" 
                                  color={
                                    request.status === 'pending' ? 'warning' :
                                    request.status === 'accepted' ? 'info' :
                                    request.status === 'completed' ? 'success' :
                                    request.status === 'rejected' ? 'error' :
                                    'default'
                                  } 
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Requested: {format(new Date(request.createdAt), 'MMM d, yyyy')}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {request.wasteItem.location.city}, {request.wasteItem.location.state}
                                </Typography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Button size="small" component={Link} to={`/requests/${request._id}`}>
                              View Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      You haven't made any requests yet.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/waste-items"
                    >
                      Browse Items
                    </Button>
                  </Box>
                )
              )}
            </TabPanel>
            
            {/* Active Tab */}
            <TabPanel value={tabValue} index={1}>
              {getActiveRequests().length > 0 ? (
                <Grid container spacing={3}>
                  {getActiveRequests().map((request) => (
                    <Grid item xs={12} key={request._id}>
                      <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Box
                              component="img"
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 1
                              }}
                              src={request.wasteItem.images && request.wasteItem.images.length > 0 
                                ? request.wasteItem.images[0] 
                                : '/images/default-item.jpg'}
                              alt={request.wasteItem.title}
                            />
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="h6">
                                {request.wasteItem.title}
                              </Typography>
                              <Chip 
                                label={request.status} 
                                size="small" 
                                color={request.status === 'pending' ? 'warning' : 'info'} 
                              />
                            </Box>
                            <Typography variant="body2" gutterBottom>
                              {isDonor() 
                                ? `Requested by: ${request.user.name}`
                                : `From: ${request.wasteItem.user.name}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Requested: {format(new Date(request.createdAt), 'PPP')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Button 
                                component={Link} 
                                to={`/requests/${request._id}`}
                                variant="outlined" 
                                size="small"
                              >
                                View Details
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No active requests found.
                  </Typography>
                </Box>
              )}
            </TabPanel>
            
            {/* Completed Tab */}
            <TabPanel value={tabValue} index={2}>
              {getCompletedRequests().length > 0 ? (
                <Grid container spacing={3}>
                  {getCompletedRequests().map((request) => (
                    <Grid item xs={12} key={request._id}>
                      <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Box
                              component="img"
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 1
                              }}
                              src={request.wasteItem.images && request.wasteItem.images.length > 0 
                                ? request.wasteItem.images[0] 
                                : '/images/default-item.jpg'}
                              alt={request.wasteItem.title}
                            />
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="h6">
                                {request.wasteItem.title}
                              </Typography>
                              <Chip 
                                label="Completed" 
                                size="small" 
                                color="success" 
                              />
                            </Box>
                            <Typography variant="body2" gutterBottom>
                              {isDonor() 
                                ? `Given to: ${request.user.name}`
                                : `From: ${request.wasteItem.user.name}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Completed: {format(new Date(request.updatedAt), 'PPP')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Button 
                                component={Link} 
                                to={`/requests/${request._id}`}
                                variant="outlined" 
                                size="small"
                              >
                                View Details
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No completed exchanges found.
                  </Typography>
                </Box>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 
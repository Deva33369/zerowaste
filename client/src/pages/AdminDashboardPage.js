import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Tab,
  Tabs,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  SupervisorAccount as SupervisorAccountIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryStats
} from '../services/categoryService';
import { getRequestStats } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

// Tab panel component for the different tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Random colors for charts
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FF6B6B', '#6A5ACD', '#20B2AA', '#FF7F50'
];

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Stats state
  const [categoryStats, setCategoryStats] = useState([]);
  const [requestStats, setRequestStats] = useState({
    statusCounts: [],
    dailyRequests: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      // Fetch category stats
      const catStatsResponse = await getCategoryStats();
      setCategoryStats(catStatsResponse.data);
      
      // Fetch request stats
      const reqStatsResponse = await getRequestStats();
      setRequestStats(reqStatsResponse.data);
      
      setStatsLoading(false);
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
      setStatsLoading(false);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Dialog handlers
  const handleOpenDialog = (mode, category = null) => {
    setDialogMode(mode);
    setSelectedCategory(category);
    
    // Reset form
    if (mode === 'add') {
      setCategoryForm({
        name: '',
        description: '',
        icon: ''
      });
    } else {
      // Fill form with category data for editing
      setCategoryForm({
        name: category.name,
        description: category.description,
        icon: category.icon
      });
    }
    
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setCategoryForm({
      ...categoryForm,
      [name]: value
    });
    
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!categoryForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!categoryForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!categoryForm.icon.trim()) {
      errors.icon = 'Icon is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (dialogMode === 'add') {
        // Create new category
        await createCategory(categoryForm);
      } else {
        // Update existing category
        await updateCategory(selectedCategory._id, categoryForm);
      }
      
      // Refresh the categories list
      fetchCategories();
      
      // Close the dialog
      handleCloseDialog();
    } catch (err) {
      setError(`Failed to ${dialogMode} category. Please try again.`);
    }
  };

  // Delete handlers
  const handleOpenConfirmDialog = (category) => {
    setCategoryToDelete(category);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(categoryToDelete._id);
      
      // Refresh the categories list
      fetchCategories();
      
      // Close the dialog
      handleCloseConfirmDialog();
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      handleCloseConfirmDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SupervisorAccountIcon fontSize="large" sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Categories" icon={<CategoryIcon />} iconPosition="start" id="admin-tab-0" aria-controls="admin-tabpanel-0" />
          <Tab label="Statistics" icon={<BarChartIcon />} iconPosition="start" id="admin-tab-1" aria-controls="admin-tabpanel-1" />
        </Tabs>

        {/* Categories Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Manage Categories</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
            >
              Add Category
            </Button>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : categories.length === 0 ? (
            <Alert severity="info">No categories found. Add a new category to get started.</Alert>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Icon</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Box sx={{ fontSize: '24px', width: 40, textAlign: 'center' }}>
                          {category.icon}
                        </Box>
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          aria-label="edit category"
                          onClick={() => handleOpenDialog('edit', category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete category"
                          onClick={() => handleOpenConfirmDialog(category)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Statistics Tab */}
        <TabPanel value={tabValue} index={1}>
          {statsLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Summary Cards */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Platform Overview
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PeopleIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            Users
                          </Typography>
                        </Box>
                        <Typography variant="h4" component="div">
                          {requestStats.userCount || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <InventoryIcon color="secondary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            Items
                          </Typography>
                        </Box>
                        <Typography variant="h4" component="div">
                          {requestStats.itemCount || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <SwapHorizIcon color="success" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            Requests
                          </Typography>
                        </Box>
                        <Typography variant="h4" component="div">
                          {requestStats.requestCount || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CategoryIcon color="info" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            Categories
                          </Typography>
                        </Box>
                        <Typography variant="h4" component="div">
                          {categories.length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
                
              {/* Category Distribution Chart */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Items by Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} items`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              {/* Request Status Chart */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Requests by Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={requestStats.statusCounts}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                      >
                        {requestStats.statusCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} requests`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              {/* Daily Requests Chart */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Requests Activity (Last 7 Days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={requestStats.dailyRequests}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="category-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="category-dialog-title">
          {dialogMode === 'add' ? 'Add New Category' : 'Edit Category'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitCategory}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Category Name"
              type="text"
              fullWidth
              value={categoryForm.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={categoryForm.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              name="icon"
              label="Icon (Emoji)"
              type="text"
              fullWidth
              value={categoryForm.icon}
              onChange={handleInputChange}
              error={!!formErrors.icon}
              helperText={formErrors.icon || "Use an emoji as the icon (e.g., '📱', '👕', '📚')"}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitCategory} 
            variant="contained" 
            color="primary"
          >
            {dialogMode === 'add' ? 'Add Category' : 'Update Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? 
            This may affect existing items in this category.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteCategory} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboardPage; 
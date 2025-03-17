import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Paper,
  Stack,
  Button,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import WaterIcon from '@mui/icons-material/Water';
import Co2Icon from '@mui/icons-material/Co2';
import ForestIcon from '@mui/icons-material/Forest';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';

// Mock data for environmental impact calculations
const impactFactors = {
  'Vegetables': { water: 322, carbon: 2.0, land: 0.3 },
  'Fruits': { water: 962, carbon: 1.1, land: 0.5 },
  'Bread': { water: 1608, carbon: 1.3, land: 0.6 },
  'Rice': { water: 2497, carbon: 4.0, land: 0.2 },
  'Pasta': { water: 1849, carbon: 1.8, land: 0.4 },
  'Beef': { water: 15415, carbon: 27.0, land: 20.0 },
  'Chicken': { water: 4325, carbon: 6.9, land: 7.1 },
  'Fish': { water: 3691, carbon: 6.1, land: 0 },
  'Dairy': { water: 1020, carbon: 3.2, land: 1.8 },
  'Sweets': { water: 1526, carbon: 2.1, land: 0.7 }
};

const foodTypes = Object.keys(impactFactors);

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];

const EnvironmentalImpactCalculator = () => {
  const [foodType, setFoodType] = useState('Vegetables');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('kg');
  const [loading, setLoading] = useState(false);
  const [impact, setImpact] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [cumulativeImpact, setCumulativeImpact] = useState({
    water: 0,
    carbon: 0,
    land: 0
  });

  // Mock donation history
  useEffect(() => {
    // Simulate loading donation history
    setLoading(true);
    setTimeout(() => {
      const mockHistory = [
        { id: 1, foodType: 'Vegetables', quantity: 5, date: '2025-03-10', water: 1610, carbon: 10, land: 1.5 },
        { id: 2, foodType: 'Bread', quantity: 3, date: '2025-03-12', water: 4824, carbon: 3.9, land: 1.8 },
        { id: 3, foodType: 'Fruits', quantity: 4, date: '2025-03-15', water: 3848, carbon: 4.4, land: 2.0 }
      ];
      setDonationHistory(mockHistory);
      
      // Calculate cumulative impact
      const totalImpact = mockHistory.reduce(
        (acc, donation) => ({
          water: acc.water + donation.water,
          carbon: acc.carbon + donation.carbon,
          land: acc.land + donation.land
        }),
        { water: 0, carbon: 0, land: 0 }
      );
      
      setCumulativeImpact(totalImpact);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateImpact = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const factor = impactFactors[foodType];
      const calculatedImpact = {
        water: factor.water * quantity,
        carbon: factor.carbon * quantity,
        land: factor.land * quantity
      };
      
      setImpact(calculatedImpact);
      setLoading(false);
      
      // Add to donation history (in a real app, this would be an API call)
      const newDonation = {
        id: donationHistory.length + 4,
        foodType,
        quantity,
        date: new Date().toISOString().split('T')[0],
        ...calculatedImpact
      };
      
      setDonationHistory([...donationHistory, newDonation]);
      
      // Update cumulative impact
      setCumulativeImpact({
        water: cumulativeImpact.water + calculatedImpact.water,
        carbon: cumulativeImpact.carbon + calculatedImpact.carbon,
        land: cumulativeImpact.land + calculatedImpact.land
      });
    }, 1000);
  };

  const impactData = [
    { name: 'Water Saved (L)', value: cumulativeImpact.water },
    { name: 'CO₂ Prevented (kg)', value: cumulativeImpact.carbon },
    { name: 'Land Saved (m²)', value: cumulativeImpact.land }
  ];
  
  const chartData = donationHistory.map(donation => ({
    name: donation.foodType,
    'Water Saved (L)': donation.water,
    'CO₂ Prevented (kg)': donation.carbon * 100, // Scale up for visibility
    'Land Saved (m²)': donation.land * 100      // Scale up for visibility
  }));

  const equivalencies = {
    water: Math.round(cumulativeImpact.water / 150), // Showers saved (150L per shower)
    carbon: Math.round(cumulativeImpact.carbon / 2.3), // Car trips avoided (2.3kg CO2 per km)
    land: Math.round(cumulativeImpact.land / 4)       // Trees worth of space (4m² per tree)
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Environmental Impact Calculator
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Calculate the environmental impact of your food donations and see how much of a difference you're making.
      </Typography>
      
      <Grid container spacing={4}>
        {/* Calculator Section */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calculate Impact
              </Typography>
              
              <Stack spacing={3}>
                <TextField
                  select
                  label="Food Type"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  fullWidth
                >
                  {foodTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
                  inputProps={{ min: 0.1, step: 0.1 }}
                  fullWidth
                />
                
                <TextField
                  select
                  label="Unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="kg">Kilograms (kg)</MenuItem>
                  <MenuItem value="items">Items</MenuItem>
                  <MenuItem value="servings">Servings</MenuItem>
                </TextField>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateImpact}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Calculate Impact'}
                </Button>
              </Stack>
              
              {impact && (
                <Box mt={3}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Calculated Impact:
                  </Typography>
                  
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center">
                      <WaterIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        <strong>{impact.water.toLocaleString()}</strong> liters of water saved
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <Co2Icon color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        <strong>{impact.carbon.toLocaleString()}</strong> kg of CO₂ emissions prevented
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <ForestIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>
                        <strong>{impact.land.toLocaleString()}</strong> m² of land use avoided
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Summary Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Total Impact */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  Your Total Environmental Impact
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <WaterIcon sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {cumulativeImpact.water.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Liters of water saved</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Equal to {equivalencies.water} showers
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Co2Icon sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {cumulativeImpact.carbon.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">kg of CO₂ prevented</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Equal to {equivalencies.carbon} km not driven
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <ForestIcon sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {cumulativeImpact.land.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">m² of land saved</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Equal to {equivalencies.land} trees worth of space
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Charts */}
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Impact Distribution
                </Typography>
                
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={impactData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Impact By Donation
                </Typography>
                
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Water Saved (L)" fill="#2196F3" />
                    <Bar dataKey="CO₂ Prevented (kg)" fill="#4CAF50" />
                    <Bar dataKey="Land Saved (m²)" fill="#FF9800" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Recent Donations */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Donations Impact
                </Typography>
                
                {loading ? (
                  <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>Date</th>
                          <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>Food Type</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>Quantity</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>Water Saved (L)</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>CO₂ Prevented (kg)</th>
                          <th style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>Land Saved (m²)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donationHistory.map((donation) => (
                          <tr key={donation.id}>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>{donation.date}</td>
                            <td style={{ padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>{donation.foodType}</td>
                            <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>{donation.quantity} {unit}</td>
                            <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>{donation.water.toLocaleString()}</td>
                            <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>{donation.carbon.toLocaleString()}</td>
                            <td style={{ textAlign: 'right', padding: '12px 8px', borderBottom: '1px solid #e0e0e0' }}>{donation.land.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnvironmentalImpactCalculator;
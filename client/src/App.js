import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FoodListingPage from "./pages/FoodListingPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import CreateFoodPage from "./pages/CreateFoodPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateWasteItemPage from "./pages/CreateWasteItemPage";

// New Features
import EnvironmentalImpactCalculator from "./pages/EnvironmentalImpactCalculator";
import FoodEducationHub from "./pages/FoodEducationHub";

// Marketplace Components
import FoodMarketplace from "./pages/FoodMarketplace";  // Marketplace UI
import FoodListingForm from "./pages/FoodListingForm";  // Form for restaurants

// Guards
import PrivateRoute from "./components/guards/PrivateRoute";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green color for eco-friendly theme
    },
    secondary: {
      main: "#ff9800", // Orange for food-related themes
    },
    background: {
      default: "#f8f9fa",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <Router>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 120px)", paddingBottom: "2rem" }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } 
                />
                <Route path="/food" element={<FoodListingPage />} />
                <Route path="/food/:id" element={<FoodDetailPage />} />
                <Route 
                  path="/create-food" 
                  element={
                    <PrivateRoute>
                      <CreateFoodPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Waste Items Routes */}
                <Route path="/waste-items" element={<FoodListingPage />} /> {/* Assuming we use same listing pattern */}
                <Route 
                  path="/waste-items/create" 
                  element={
                    <PrivateRoute>
                      <CreateWasteItemPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Marketplace Routes */}
                <Route path="/marketplace" element={<FoodMarketplace />} /> {/* Browse & Buy Food */}
                <Route 
                  path="/food-listing" 
                  element={
                    <PrivateRoute>
                      <FoodListingForm />
                    </PrivateRoute>
                  } 
                /> {/* Only restaurants can list food */}
                
                {/* New Feature Routes */}
                <Route path="/environmental-impact" element={<EnvironmentalImpactCalculator />} />
                <Route path="/education" element={<FoodEducationHub />} />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
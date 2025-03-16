import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Recycling as RecyclingIcon,
  Logout as LogoutIcon,
  SupervisorAccount as AdminIcon,
  AddCircleOutline as AddItemIcon,
  SwapHoriz as RequestsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout, isDonor, isAdmin } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // User menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    showSnackbar('Successfully logged out', 'success');
    navigate('/');
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Navigation links based on user type and authentication status
  const getNavLinks = () => {
    const links = [
      { title: 'Home', path: '/' },
      { title: 'Browse Items', path: '/waste-items' }
    ];
    
    if (isAuthenticated()) {
      links.push({ title: 'Dashboard', path: '/dashboard' });
      links.push({ title: 'Requests', path: '/requests', icon: <RequestsIcon /> });
      
      if (isDonor()) {
        links.push({ 
          title: 'Offer Item', 
          path: '/waste-items/create', 
          icon: <AddItemIcon />,
          highlight: true
        });
      }
      
      if (isAdmin()) {
        links.push({ 
          title: 'Admin', 
          path: '/admin', 
          icon: <AdminIcon /> 
        });
      }
    }
    
    return links;
  };
  
  const navLinks = getNavLinks();
  
  // Desktop navigation
  const desktopNav = (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {navLinks.map((link) => (
          <Button
            key={link.path}
            component={Link}
            to={link.path}
            color={link.highlight ? 'secondary' : 'inherit'}
            variant={link.highlight ? 'contained' : 'text'}
            sx={{ 
              mx: 1,
              ...(link.highlight ? { 
                borderRadius: 2, 
                px: 2,
                color: 'white'
              } : {})
            }}
            startIcon={link.icon}
          >
            {link.title}
          </Button>
        ))}
      </Box>
      
      {isAuthenticated() ? (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <Button
            id="profile-button"
            aria-controls={open ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleUserMenuClick}
            color="inherit"
            sx={{ ml: 2, textTransform: 'none' }}
            startIcon={
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.main 
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            }
          >
            {user?.name || 'User'}
          </Button>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'profile-button',
            }}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, width: 200 }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/requests'); }}>
              <ListItemIcon>
                <RequestsIcon fontSize="small" />
              </ListItemIcon>
              My Requests
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/login" sx={{ ml: 1 }}>
            Login
          </Button>
          <Button variant="outlined" color="inherit" component={Link} to="/register" sx={{ ml: 1 }}>
            Register
          </Button>
        </Box>
      )}
    </>
  );
  
  // Mobile drawer content
  const mobileDrawerContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        {isAuthenticated() ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: theme.palette.primary.main,
                mr: 2
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{user?.name || 'User'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.userType === 'donor' ? 'Donor' : 'Recipient'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ZeroWaste
          </Typography>
        )}
      </Box>
      
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton 
              component={Link} 
              to={link.path}
              sx={{ 
                ...(link.highlight ? { 
                  bgcolor: theme.palette.secondary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                  }
                } : {})
              }}
            >
              {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
              <ListItemText primary={link.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      {isAuthenticated() ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/profile">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RecyclingIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '.1rem',
              }}
            >
              ZEROWASTE
            </Typography>
          </Box>

          {/* Mobile menu button */}
          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {mobileDrawerContent}
              </Drawer>
            </>
          ) : (
            desktopNav
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
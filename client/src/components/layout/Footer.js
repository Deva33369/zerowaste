import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Recycling as RecyclingIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Browse Items', path: '/waste-items' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' }
      ]
    },
    {
      title: 'Information',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Contact Us', path: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Accessibility', path: '/accessibility' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <TwitterIcon />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <InstagramIcon />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, name: 'LinkedIn', url: 'https://linkedin.com' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RecyclingIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                }}
              >
                ZEROWASTE
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              ZeroWaste connects people who want to donate items they no longer need with those who could use them, 
              reducing waste and helping communities.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  aria-label={social.name}
                  component={MuiLink}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1, color: 'primary.main' }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ py: 0.5 }}>
                    <MuiLink
                      component={Link}
                      to={link.path}
                      color="text.secondary"
                      sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                      {link.name}
                    </MuiLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} ZeroWaste. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ♥ for a greener planet
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
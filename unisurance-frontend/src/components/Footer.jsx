import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Unisurance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A decentralized retirement savings platform powered by Chainlink.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link href="https://chain.link/" target="_blank" color="inherit" display="block" sx={{ mb: 1 }}>
              Chainlink
            </Link>
            <Link href="https://ethereum.org/" target="_blank" color="inherit" display="block" sx={{ mb: 1 }}>
              Ethereum
            </Link>
            <Link href="https://docs.chain.link/" target="_blank" color="inherit" display="block">
              Chainlink Documentation
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Connect
            </Typography>
            <Link href="https://github.com/" target="_blank" color="inherit" display="block" sx={{ mb: 1 }}>
              GitHub
            </Link>
            <Link href="https://twitter.com/" target="_blank" color="inherit" display="block" sx={{ mb: 1 }}>
              Twitter
            </Link>
            <Link href="https://discord.com/" target="_blank" color="inherit" display="block">
              Discord
            </Link>
          </Grid>
        </Grid>
        
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Unisurance. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
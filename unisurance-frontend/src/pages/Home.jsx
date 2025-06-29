import React from 'react';
import { Container, Typography, Grid, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import RetirementCalculator from '../components/RetirementCalculator';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white'
              }}
            >
              <Typography variant="h3" gutterBottom>
                Unisurance
              </Typography>
              <Typography variant="h5" gutterBottom>
                Secure Your Future with Blockchain-Powered Retirement Savings
              </Typography>
              <Typography variant="body1" paragraph>
                Contribute monthly, earn yield, and enjoy a steady retirement income.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={Link}
                to="/contribute"
                sx={{ mt: 2 }}
              >
                Start Contributing
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                How It Works
              </Typography>
                           <Box component="ol" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Create a Plan</strong>: Set your monthly contribution amount and period.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Contribute</strong>: Make regular contributions to build your retirement fund.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Earn Yield</strong>: Your contributions generate yield through DeFi strategies.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Retire</strong>: Once your contribution period is complete, start receiving monthly income.
                  </Typography>
                </Box>
              </Box>
              
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Chainlink Integration
                </Typography>
                <Typography paragraph>
                  Unisurance leverages Chainlink's decentralized oracle network for:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Price Feeds</strong>: Accurate token valuations
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Automation</strong>: Reliable yield distribution
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>VRF</strong>: Fair random rewards
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <RetirementCalculator />
          </Grid>
        </Grid>
      </Box>
      // Add this button to the hero section in Home.jsx
<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
  <Button 
    variant="contained" 
    color="primary" 
    size="large"
    component={Link}
    to="/create-plan"
  >
    Create a Plan
  </Button>
  <Button 
    variant="outlined" 
    color="primary" 
    size="large"
    component={Link}
    to="/contribute"
  >
    Make a Contribution
  </Button>
</Box>

    </Container>
  );
};

export default Home;
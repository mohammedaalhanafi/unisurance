import React from 'react';
import { Container, Typography, Grid, Box, Paper, Alert } from '@mui/material';
import ContributeForm from '../components/ContributeForm';
import WalletBalance from '../components/WalletBalance';

const Contribute = ({ usdcContract, account }) => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Make a Contribution
        </Typography>
        
        {!account && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please connect your wallet to make a contribution.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <WalletBalance usdcContract={usdcContract} account={account} />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <ContributeForm usdcContract={usdcContract} account={account} />
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                How Contributions Work
              </Typography>
              
              <Typography paragraph>
                When you contribute to Unisurance, your funds are automatically:
              </Typography>
              
              <Box component="ol" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Deposited</strong> into your retirement plan
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Allocated</strong> to yield-generating strategies
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Tracked</strong> for your contribution progress
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Eligible</strong> for random bonus rewards via Chainlink VRF
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Chainlink Integration
              </Typography>
              
              <Typography paragraph>
                Your contribution is processed with the help of Chainlink's decentralized oracle network:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Price Feeds</strong>: Ensure accurate valuation of your contribution
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>VRF</strong>: Powers the random bonus reward system
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Automation</strong>: Schedules regular yield compounding
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Contribute;
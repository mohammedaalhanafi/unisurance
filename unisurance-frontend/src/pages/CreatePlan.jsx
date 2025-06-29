// src/pages/CreatePlan.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Paper, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlanCreationForm from '../components/PlanCreationForm';
import WalletBalance from '../components/WalletBalance';
import CountdownTimer from '../components/CountdownTimer';

const CreatePlan = ({ usdcContract, account }) => {
  const [createdPlan, setCreatedPlan] = useState(null);
  const [mockBalanceUpdated, setMockBalanceUpdated] = useState(0); // Use a number to force re-renders
  const navigate = useNavigate();

  const handlePlanCreated = (plan) => {
    setCreatedPlan(plan);
    
    // Store the plan in localStorage
    const storedPlans = localStorage.getItem('unisurancePlans');
    let allPlans = [];
    
    if (storedPlans) {
      allPlans = JSON.parse(storedPlans);
    }
    
    allPlans.push(plan);
    localStorage.setItem('unisurancePlans', JSON.stringify(allPlans));
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleMockBalanceUpdate = () => {
    setMockBalanceUpdated(prev => prev + 1); // Increment to force re-render
  };

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setMockBalanceUpdated(prev => prev + 1);
    };

    window.addEventListener('local-storage-update', handleStorageChange);
    
    return () => {
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Create a Retirement Plan
        </Typography>
        
        {!account && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please connect your wallet to create a retirement plan.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <WalletBalance 
              usdcContract={usdcContract} 
              account={account} 
              onMockBalanceUpdate={handleMockBalanceUpdate}
              key={`wallet-balance-${mockBalanceUpdated}`} // Force re-render when balance updates
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            {!createdPlan ? (
              <PlanCreationForm 
                usdcContract={usdcContract} 
                account={account} 
                onPlanCreated={handlePlanCreated}
                onMockBalanceUpdate={handleMockBalanceUpdate}
                key={`plan-creation-${mockBalanceUpdated}`} // Force re-render when balance updates
              />
            ) : (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Your Plan is Active!
                </Typography>
                
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your plan has been created successfully! You can track its progress on your dashboard.
                </Alert>
                
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    Plan Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Contribution
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {createdPlan.contribution} USDC
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Duration
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {createdPlan.duration}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Start Date
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {new Date(createdPlan.startDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        End Date
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {new Date(createdPlan.endDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <CountdownTimer 
                  targetDate={createdPlan.endDate} 
                  title="Time Remaining Until Plan Completion"
                />
                
                <Box mt={3} display="flex" justifyContent="center">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleGoToDashboard}
                  >
                    Go to Dashboard
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreatePlan;
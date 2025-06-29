// src/components/ContributeForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const ContributeForm = ({ account, onMockBalanceUpdate, onContributionSuccess }) => {
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState('0');

  // Function to get mock balance
  const getMockBalance = (account) => {
    if (!account) return "0";
    const storedBalance = localStorage.getItem(`mock_usdc_${account}`);
    return storedBalance ? storedBalance : "0";
  };

  // Function to set mock balance
  const setMockBalance = (account, newBalance) => {
    if (!account) return;
    localStorage.setItem(`mock_usdc_${account}`, newBalance);
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('mock-balance-update', { 
      detail: { account, balance: newBalance } 
    }));
  };

  // Load plans and balance
  useEffect(() => {
    // Load plans from localStorage
    const loadPlans = () => {
      const storedPlans = localStorage.getItem('unisurancePlans');
      if (storedPlans) {
        const parsedPlans = JSON.parse(storedPlans);
        setPlans(parsedPlans);
        
        // Set first plan as default if available
        if (parsedPlans.length > 0 && !selectedPlan) {
          setSelectedPlan(parsedPlans[0].id.toString());
        }
      }
    };

    // Load balance
    const loadBalance = () => {
      if (account) {
        const mockBalance = getMockBalance(account);
        setBalance(mockBalance);
      }
    };

    loadPlans();
    loadBalance();
    
    // Listen for mock balance updates
    const handleMockBalanceUpdate = (e) => {
      if (e.detail && e.detail.account === account) {
        setBalance(e.detail.balance);
      }
    };
    
    window.addEventListener('mock-balance-update', handleMockBalanceUpdate);
    
    return () => {
      window.removeEventListener('mock-balance-update', handleMockBalanceUpdate);
    };
  }, [account, selectedPlan]);

  const handleContribute = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!selectedPlan) {
      setError('Please select a plan to contribute to');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid contribution amount');
      return;
    }

    // Check if user has enough balance
    const currentBalance = getMockBalance(account);
    if (parseFloat(currentBalance) < parseFloat(amount)) {
      setError(`Insufficient USDC balance. You have ${currentBalance} USDC but need ${amount} USDC.`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Simulate a delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update mock balance
      const newBalance = (parseFloat(currentBalance) - parseFloat(amount)).toString();
      setMockBalance(account, newBalance);
      setBalance(newBalance);
      
      // Update plan with new contribution
      const storedPlans = localStorage.getItem('unisurancePlans');
      if (storedPlans) {
        const allPlans = JSON.parse(storedPlans);
        const updatedPlans = allPlans.map(plan => {
          if (plan.id.toString() === selectedPlan.toString()) {
            return {
              ...plan,
              totalContributed: plan.totalContributed + parseFloat(amount)
            };
          }
          return plan;
        });
        
        localStorage.setItem('unisurancePlans', JSON.stringify(updatedPlans));
        setPlans(updatedPlans);
      }
      
      // Notify parent components
      if (onMockBalanceUpdate) {
        onMockBalanceUpdate();
      }
      
      if (onContributionSuccess) {
        const plan = plans.find(p => p.id.toString() === selectedPlan.toString());
        onContributionSuccess(plan, parseFloat(amount));
      }
      
      setSuccess(`Successfully contributed ${amount} USDC to your plan!`);
      setAmount(''); // Reset amount field
    } catch (error) {
      console.error('Error contributing to plan:', error);
      setError(error.message || 'Failed to contribute to plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper id="contribute-form" elevation={2} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contribute to Your Plan
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Current Balance
        </Typography>
        <Typography variant="h6">
          {balance} USDC
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {plans.length === 0 ? (
        <Alert severity="info">
          You don't have any active plans. Create a plan first to make contributions.
        </Alert>
      ) : (
        <Box component="form" noValidate>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Plan</InputLabel>
            <Select
              value={selectedPlan}
              label="Select Plan"
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id.toString()}>
                  {plan.name} - {plan.contribution} USDC/month
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="amount"
            label="Contribution Amount (USDC)"
            type="number"
            id="amount"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleContribute}
            disabled={loading || plans.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Contribute Now'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ContributeForm;
// src/components/PlanCreationForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CircularProgress,
  Alert,
  Slider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { parseAmount, formatAmount } from '../utils/helpers';
import { ethers } from 'ethers';
import useLocalStorage from '../hooks/useLocalStorage';

const PlanCreationForm = ({ usdcContract, account, onPlanCreated, onMockBalanceUpdate }) => {
  // State for time units
  const [timeUnit, setTimeUnit] = useState('months');
  const [timeValue, setTimeValue] = useState(12);
  
  // State for seconds, minutes, hours, days for testing
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [useMockBalance, setUseMockBalance] = useState(true); // Default to mock balance for hackathon
  
  // Use our custom hook for the balance
  const [mockBalance, setMockBalance] = useLocalStorage(`mock_usdc_${account || 'default'}`, "0");
  const [displayBalance, setDisplayBalance] = useState("0");

  // Fetch user's USDC balance (real or mock)
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) {
        setDisplayBalance("0");
        return;
      }
      
      try {
        if (useMockBalance) {
          // Use mock balance
          setDisplayBalance(mockBalance);
        } else {
          // Try to get real balance
          if (usdcContract) {
            try {
              const balanceWei = await usdcContract.balanceOf(account);
              const formattedBalance = formatAmount(balanceWei);
              setDisplayBalance(formattedBalance);
            } catch (error) {
              console.error("Error fetching real balance:", error);
              // Fall back to mock balance
              setDisplayBalance(mockBalance);
              setUseMockBalance(true);
            }
          } else {
            // No contract, use mock
            setDisplayBalance(mockBalance);
            setUseMockBalance(true);
          }
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
    
    // Set up an interval to refresh the balance every 3 seconds
    const interval = setInterval(fetchBalance, 3000);
    
    return () => clearInterval(interval);
  }, [account, usdcContract, useMockBalance, mockBalance]);

  // Calculate total seconds for the plan duration
  const calculateTotalSeconds = () => {
    if (tabValue === 0) {
      // Standard mode - convert months to seconds (approximate)
      return timeValue * 30 * 24 * 60 * 60; // months * 30 days * 24 hours * 60 minutes * 60 seconds
    } else {
      // Testing mode - use exact seconds, minutes, hours, days
      return (
        parseInt(seconds || 0) + 
        parseInt(minutes || 0) * 60 + 
        parseInt(hours || 0) * 3600 + 
        parseInt(days || 0) * 86400
      );
    }
  };

  // Calculate end date based on duration
  const calculateEndDate = () => {
    const now = new Date();
    const totalSeconds = calculateTotalSeconds();
    return new Date(now.getTime() + totalSeconds * 1000);
  };

  // Format time for display
  const formatTime = () => {
    if (tabValue === 0) {
      return `${timeValue} ${timeUnit}`;
    } else {
      const parts = [];
      if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
      return parts.length > 0 ? parts.join(', ') : '0 seconds';
    }
  };

  const handleCreatePlan = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!monthlyContribution || isNaN(monthlyContribution) || parseFloat(monthlyContribution) <= 0) {
      setError('Please enter a valid monthly contribution amount');
      return;
    }

    // Check if user has enough balance (real or mock)
    let hasEnoughBalance = false;
    let currentBalance = "0";

    if (useMockBalance) {
      // Use mock balance
      currentBalance = mockBalance;
      hasEnoughBalance = parseFloat(currentBalance) >= parseFloat(monthlyContribution);
    } else if (usdcContract) {
      // Try to use real balance
      try {
        const realBalance = await usdcContract.balanceOf(account);
        currentBalance = formatAmount(realBalance);
        hasEnoughBalance = parseFloat(currentBalance) >= parseFloat(monthlyContribution);
      } catch (error) {
        console.error("Error checking real balance:", error);
        // Fall back to mock balance
        currentBalance = mockBalance;
        hasEnoughBalance = parseFloat(currentBalance) >= parseFloat(monthlyContribution);
        setUseMockBalance(true);
      }
    }

    if (!hasEnoughBalance) {
      setError(`Insufficient USDC balance. You have ${currentBalance} USDC but need ${monthlyContribution} USDC.`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const totalSeconds = calculateTotalSeconds();
      const endDate = calculateEndDate();
      
      // If using mock balance, update it
      if (useMockBalance) {
        const newBalance = (parseFloat(mockBalance) - parseFloat(monthlyContribution)).toString();
        setMockBalance(newBalance);
        setDisplayBalance(newBalance);
        
        // Notify parent component
        if (onMockBalanceUpdate) {
          onMockBalanceUpdate(newBalance);
        }
      } else {
        // Try to use real contract (this might fail if there's no allowance)
        try {
          const parsedContribution = parseAmount(monthlyContribution);
          
          // First approve the contract to spend USDC
          const approveTx = await usdcContract.approve('0xB8a3a6f0d02a73771C7A75E006E834ad46292887', parsedContribution);
          await approveTx.wait();
          
          // Then transfer USDC to the contract
          const transferTx = await usdcContract.transfer('0xB8a3a6f0d02a73771C7A75E006E834ad46292887', parsedContribution);
          await transferTx.wait();
        } catch (error) {
          console.error("Error in blockchain transaction:", error);
          
          // If real transaction fails, fall back to mock
          const newBalance = (parseFloat(mockBalance) - parseFloat(monthlyContribution)).toString();
          setMockBalance(newBalance);
          setDisplayBalance(newBalance);
          setUseMockBalance(true);
          
          // Notify parent component
          if (onMockBalanceUpdate) {
            onMockBalanceUpdate(newBalance);
          }
        }
      }
      
      // Create plan object
      const plan = {
        id: Date.now(), // Use timestamp as ID for now
        name: `Plan ${new Date().toLocaleDateString()}`,
        contribution: parseFloat(monthlyContribution),
        startDate: new Date(),
        endDate: endDate,
        totalContributed: parseFloat(monthlyContribution),
        duration: formatTime()
      };
      
      // Call the onPlanCreated callback with the plan data
            // Call the onPlanCreated callback with the plan data
      if (onPlanCreated) {
        onPlanCreated(plan);
      }
      
      setSuccess(`Plan created successfully! You've committed to contributing ${monthlyContribution} USDC for ${formatTime()}.`);
    } catch (error) {
      console.error('Error creating plan:', error);
      setError(error.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Your Retirement Plan
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
        
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Typography variant="subtitle1" gutterBottom>
            USDC Balance: <strong>{displayBalance} USDC</strong> {useMockBalance ? "(Mock)" : ""}
          </Typography>
        </Box>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab label="Standard" />
          <Tab label="Testing Mode" />
        </Tabs>
        
        {tabValue === 0 ? (
          // Standard mode
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Time Unit</InputLabel>
                <Select
                  value={timeUnit}
                  label="Time Unit"
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <MenuItem value="months">Months</MenuItem>
                  <MenuItem value="years">Years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>
                Contribution Period ({timeUnit}): {timeValue}
              </Typography>
              <Slider
                value={timeValue}
                onChange={(e, newValue) => setTimeValue(newValue)}
                min={1}
                max={timeUnit === 'months' ? 60 : 5}
                valueLabelDisplay="auto"
                marks={timeUnit === 'months' ? [
                  { value: 1, label: '1' },
                  { value: 12, label: '12' },
                  { value: 24, label: '24' },
                  { value: 36, label: '36' },
                  { value: 48, label: '48' },
                  { value: 60, label: '60' }
                ] : [
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' }
                ]}
              />
            </Grid>
          </Grid>
        ) : (
          // Testing mode with seconds, minutes, hours, days
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Days"
                type="number"
                fullWidth
                value={days}
                onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Hours"
                type="number"
                fullWidth
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                InputProps={{ inputProps: { min: 0, max: 23 } }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Minutes"
                type="number"
                fullWidth
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                label="Seconds"
                type="number"
                fullWidth
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
              />
            </Grid>
          </Grid>
        )}
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Monthly Contribution (USDC)"
              variant="outlined"
              fullWidth
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              type="number"
              InputProps={{
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ bgcolor: 'primary.light', color: 'white', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Plan Summary
              </Typography>
              <Typography variant="body2">
                You'll contribute <strong>{monthlyContribution} USDC</strong> for <strong>{formatTime()}</strong>.
              </Typography>
              {tabValue === 0 && (
                <Typography variant="body2">
                  Total commitment: <strong>{parseFloat(monthlyContribution) * timeValue} USDC</strong>
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Plan will end on: <strong>{calculateEndDate().toLocaleString()}</strong>
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            {useMockBalance && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Hackathon Mode:</strong> Using simulated USDC balance for testing purposes.
                </Typography>
              </Alert>
            )}
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreatePlan}
              disabled={loading || !account || (tabValue === 1 && calculateTotalSeconds() <= 0)}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Plan'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlanCreationForm;
// src/components/ChainlinkAutomation.jsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Switch, 
  FormControlLabel, 
  Divider, 
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const ChainlinkAutomation = ({ account, plans, onMockBalanceUpdate }) => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [simulationTime, setSimulationTime] = useState(null);

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

  // Load automations from localStorage
  useEffect(() => {
    const loadAutomations = () => {
      const storedAutomations = localStorage.getItem(`chainlink_automations_${account}`);
      if (storedAutomations) {
        setAutomations(JSON.parse(storedAutomations));
      }
    };

    if (account) {
      loadAutomations();
    }

    // Set default selected plan if available
    if (plans && plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0].id.toString());
    }
  }, [account, plans, selectedPlan]);

  // Simulate Chainlink Automation running periodically
  useEffect(() => {
    if (!account || automations.length === 0) return;

    const runAutomations = async () => {
      console.log('Running Chainlink Automations...');
      
      // Get current time
      const now = new Date().getTime();
      
      // Check each automation
      for (const automation of automations) {
        if (!automation.active) continue;
        
        const lastRun = automation.lastRun || 0;
        let shouldRun = false;
        
        // Check if it's time to run based on frequency
        switch (automation.frequency) {
          case 'hourly':
            shouldRun = now - lastRun >= 60 * 60 * 1000;
            break;
          case 'daily':
            shouldRun = now - lastRun >= 24 * 60 * 60 * 1000;
            break;
          case 'weekly':
            shouldRun = now - lastRun >= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'monthly':
            shouldRun = now - lastRun >= 30 * 24 * 60 * 60 * 1000;
            break;
          default:
            shouldRun = false;
        }
        
        // For hackathon, we'll simulate faster time
        if (simulationTime) {
          shouldRun = true;
        }
        
        if (shouldRun) {
          try {
            // Get current balance
            const currentBalance = getMockBalance(account);
            
            // Check if user has enough balance
            if (parseFloat(currentBalance) < parseFloat(automation.amount)) {
              console.log(`Insufficient balance for automation: ${automation.id}`);
              continue;
            }
            
            // Update mock balance
            const newBalance = (parseFloat(currentBalance) - parseFloat(automation.amount)).toString();
            setMockBalance(account, newBalance);
            
            // Update plan with new contribution
            const storedPlans = localStorage.getItem('unisurancePlans');
            if (storedPlans) {
              const allPlans = JSON.parse(storedPlans);
              const updatedPlans = allPlans.map(plan => {
                if (plan.id.toString() === automation.planId.toString()) {
                  return {
                    ...plan,
                    totalContributed: plan.totalContributed + parseFloat(automation.amount)
                  };
                }
                return plan;
              });
              
              localStorage.setItem('unisurancePlans', JSON.stringify(updatedPlans));
              
              // Trigger plan update event
              window.dispatchEvent(new CustomEvent('plan-update'));
            }
            
            // Update automation's last run time
            const updatedAutomations = automations.map(a => {
              if (a.id === automation.id) {
                return {
                  ...a,
                  lastRun: now,
                  executionCount: (a.executionCount || 0) + 1
                };
              }
              return a;
            });
            
            setAutomations(updatedAutomations);
            localStorage.setItem(`chainlink_automations_${account}`, JSON.stringify(updatedAutomations));
            
            // Notify parent component
            if (onMockBalanceUpdate) {
              onMockBalanceUpdate();
            }
            
            console.log(`Automation executed: ${automation.id}`);
            setSimulationTime(null);
          } catch (error) {
            console.error('Error executing automation:', error);
          }
        }
      }
    };
    
    // Run automations immediately
    runAutomations();
    
    // Set up interval to check automations every minute
    const interval = setInterval(runAutomations, 60000);
    
    return () => clearInterval(interval);
  }, [account, automations, simulationTime]);

  const handleCreateAutomation = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    if (!contributionAmount || isNaN(contributionAmount) || parseFloat(contributionAmount) <= 0) {
      setError('Please enter a valid contribution amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Simulate a delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new automation
      const newAutomation = {
        id: Date.now().toString(),
        planId: selectedPlan,
        amount: parseFloat(contributionAmount),
        frequency,
        active: true,
        createdAt: new Date().getTime(),
        lastRun: null,
        executionCount: 0
      };
      
      const updatedAutomations = [...automations, newAutomation];
      
      // Save to localStorage
      localStorage.setItem(`chainlink_automations_${account}`, JSON.stringify(updatedAutomations));
      setAutomations(updatedAutomations);
      
      // Get plan name for success message
      const plan = plans.find(p => p.id.toString() === selectedPlan.toString());
      
      setSuccess(`Successfully created automated contribution of ${contributionAmount} USDC ${frequency} to ${plan?.name || 'your plan'}`);
      
      // Reset form
      setContributionAmount('');
    } catch (error) {
      console.error('Error creating automation:', error);
      setError(error.message || 'Failed to create automation');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutomation = async (id) => {
    try {
      setLoading(true);
      
      // Toggle automation active status
      const updatedAutomations = automations.map(automation => {
        if (automation.id === id) {
          return {
            ...automation,
            active: !automation.active
          };
        }
        return automation;
      });
      
      // Save to localStorage
      localStorage.setItem(`chainlink_automations_${account}`, JSON.stringify(updatedAutomations));
      setAutomations(updatedAutomations);
      
      setSuccess('Automation updated successfully');
    } catch (error) {
      console.error('Error toggling automation:', error);
      setError(error.message || 'Failed to update automation');
        } finally {
      setLoading(false);
    }
  };

  const handleDeleteAutomation = async (id) => {
    try {
      setLoading(true);
      
      // Remove the automation
      const updatedAutomations = automations.filter(automation => automation.id !== id);
      
      // Save to localStorage
      localStorage.setItem(`chainlink_automations_${account}`, JSON.stringify(updatedAutomations));
      setAutomations(updatedAutomations);
      
      setSuccess('Automation removed successfully');
    } catch (error) {
      console.error('Error removing automation:', error);
      setError(error.message || 'Failed to remove automation');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateRun = async (id) => {
    setSimulationTime(Date.now());
  };

  const getFrequencyLabel = (freq) => {
    switch (freq) {
      case 'hourly': return 'Every hour';
      case 'daily': return 'Every day';
      case 'weekly': return 'Every week';
      case 'monthly': return 'Every month';
      default: return freq;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Chainlink Automation
        </Typography>
        <Chip 
          icon={<AutorenewIcon />}
          label={`${automations.filter(a => a.active).length} Active`} 
          color="primary" 
          size="small" 
          variant="outlined" 
        />
      </Box>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Set up automatic contributions to your retirement plans using Chainlink Automation.
        These reliable, decentralized automations will execute even if you're offline.
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
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Create New Automation
        </Typography>
        
        <Box component="form" noValidate>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Plan</InputLabel>
            <Select
              value={selectedPlan}
              label="Select Plan"
              onChange={(e) => setSelectedPlan(e.target.value)}
              disabled={loading || plans.length === 0}
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
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            InputProps={{
              inputProps: { min: 0, step: 0.01 }
            }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Frequency</InputLabel>
            <Select
              value={frequency}
              label="Frequency"
              onChange={(e) => setFrequency(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="hourly">Hourly (Demo Only)</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleCreateAutomation}
            disabled={loading || plans.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Automation'}
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Active Automations
        </Typography>
        
        {automations.length === 0 ? (
          <Alert severity="info">
            You don't have any active automations. Create one to automate your contributions.
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Plan</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {automations.map((automation) => {
                  const plan = plans.find(p => p.id.toString() === automation.planId.toString());
                  return (
                    <TableRow key={automation.id}>
                      <TableCell>{plan?.name || 'Unknown Plan'}</TableCell>
                      <TableCell align="right">{automation.amount} USDC</TableCell>
                      <TableCell>{getFrequencyLabel(automation.frequency)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={automation.active ? 'Active' : 'Paused'} 
                          color={automation.active ? 'success' : 'default'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {automation.lastRun 
                          ? new Date(automation.lastRun).toLocaleString() 
                          : 'Never'}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color={automation.active ? 'warning' : 'success'}
                            onClick={() => handleToggleAutomation(automation.id)}
                          >
                            {automation.active ? 'Pause' : 'Resume'}
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleDeleteAutomation(automation.id)}
                          >
                            Delete
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            onClick={() => handleSimulateRun(automation.id)}
                          >
                            Test Run
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
};

export default ChainlinkAutomation;
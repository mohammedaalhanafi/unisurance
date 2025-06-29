// src/components/ChainlinkVRF.jsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Divider, 
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CasinoIcon from '@mui/icons-material/Casino';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

const ChainlinkVRF = ({ account, plans, onMockBalanceUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rewards, setRewards] = useState([]);
  const [eligibility, setEligibility] = useState({
    isEligible: false,
    reason: '',
    nextRewardDate: null
  });
  const [vrfRequestInProgress, setVrfRequestInProgress] = useState(false);
  const [vrfResult, setVrfResult] = useState(null);

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

  // Load rewards from localStorage
  useEffect(() => {
    const loadRewards = () => {
      const storedRewards = localStorage.getItem(`chainlink_vrf_rewards_${account}`);
      if (storedRewards) {
        setRewards(JSON.parse(storedRewards));
      }
    };

    if (account) {
      loadRewards();
    }
  }, [account]);

  // Check eligibility for rewards
  useEffect(() => {
    const checkEligibility = () => {
      if (!account || !plans || plans.length === 0) {
        setEligibility({
          isEligible: false,
          reason: 'No active plans found',
          nextRewardDate: null
        });
        return;
      }

      // Check if user has made at least 3 contributions
      const totalContributions = plans.reduce((sum, plan) => {
        // Each plan should have at least 3 contributions
        return sum + (plan.totalContributed >= plan.contribution * 3 ? 1 : 0);
      }, 0);

      if (totalContributions === 0) {
        setEligibility({
          isEligible: false,
          reason: 'Make at least 3 contributions to a plan to be eligible',
          nextRewardDate: null
        });
        return;
      }

      // Check if user has claimed a reward in the last 7 days
      const lastReward = rewards.length > 0 ? 
        rewards.sort((a, b) => b.date - a.date)[0] : null;
      
      if (lastReward) {
        const daysSinceLastReward = (Date.now() - lastReward.date) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastReward < 7) {
          const nextRewardDate = new Date(lastReward.date + 7 * 24 * 60 * 60 * 1000);
          
          setEligibility({
            isEligible: false,
            reason: `You can claim your next reward on ${nextRewardDate.toLocaleDateString()}`,
            nextRewardDate
          });
          return;
        }
      }

      // User is eligible
      setEligibility({
        isEligible: true,
        reason: 'You are eligible for a reward!',
        nextRewardDate: null
      });
    };

    checkEligibility();
  }, [account, plans, rewards]);

  const handleClaimReward = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!eligibility.isEligible) {
      setError(eligibility.reason);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setVrfRequestInProgress(true);
      setVrfResult(null);

      // Simulate Chainlink VRF request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random number (in a real implementation, this would come from Chainlink VRF)
      const randomNumber = Math.floor(Math.random() * 100);
      setVrfResult(randomNumber);
      
      // Simulate VRF fulfillment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Determine reward based on random number
            // Determine reward based on random number
      let rewardAmount;
      let rewardType;
      
      if (randomNumber < 5) {
        // 5% chance for large reward (50-100 USDC)
        rewardAmount = 50 + Math.floor(Math.random() * 51);
        rewardType = 'jackpot';
      } else if (randomNumber < 25) {
        // 20% chance for medium reward (10-25 USDC)
        rewardAmount = 10 + Math.floor(Math.random() * 16);
        rewardType = 'large';
      } else {
        // 75% chance for small reward (1-5 USDC)
        rewardAmount = 1 + Math.floor(Math.random() * 5);
        rewardType = 'small';
      }
      
      // Update user's balance
      const currentBalance = getMockBalance(account);
      const newBalance = (parseFloat(currentBalance) + rewardAmount).toString();
      setMockBalance(account, newBalance);
      
      // Record the reward
      const newReward = {
        id: Date.now().toString(),
        amount: rewardAmount,
        type: rewardType,
        date: Date.now(),
        randomNumber
      };
      
      const updatedRewards = [...rewards, newReward];
      localStorage.setItem(`chainlink_vrf_rewards_${account}`, JSON.stringify(updatedRewards));
      setRewards(updatedRewards);
      
      // Notify parent component
      if (onMockBalanceUpdate) {
        onMockBalanceUpdate();
      }
      
      setSuccess(`Congratulations! You received a reward of ${rewardAmount} USDC!`);
      setVrfRequestInProgress(false);
    } catch (error) {
      console.error('Error claiming reward:', error);
      setError(error.message || 'Failed to claim reward');
      setVrfRequestInProgress(false);
    } finally {
      setLoading(false);
    }
  };

  const getRewardTypeLabel = (type) => {
    switch (type) {
      case 'jackpot': return 'Jackpot Reward';
      case 'large': return 'Large Reward';
      case 'small': return 'Small Reward';
      default: return 'Reward';
    }
  };

  const getRewardTypeColor = (type) => {
    switch (type) {
      case 'jackpot': return 'error';
      case 'large': return 'warning';
      case 'small': return 'success';
      default: return 'primary';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Chainlink VRF Rewards
        </Typography>
        <Chip 
          icon={<CasinoIcon />}
          label="Provably Fair" 
          color="primary" 
          size="small" 
          variant="outlined" 
        />
      </Box>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Earn random rewards for consistent contributions to your retirement plans.
        Chainlink VRF (Verifiable Random Function) ensures fair and transparent reward distribution.
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
          Reward Eligibility
        </Typography>
        
        <Alert severity={eligibility.isEligible ? "success" : "info"} sx={{ mb: 2 }}>
          {eligibility.reason}
        </Alert>
        
        {eligibility.nextRewardDate && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Next reward available in:
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, ((Date.now() - (rewards[rewards.length - 1]?.date || 0)) / (7 * 24 * 60 * 60 * 1000)) * 100)} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="caption" align="right" display="block" sx={{ mt: 0.5 }}>
              {new Date(eligibility.nextRewardDate).toLocaleDateString()}
            </Typography>
          </Box>
        )}
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleClaimReward}
          disabled={loading || !eligibility.isEligible}
          startIcon={<EmojiEventsIcon />}
        >
          {loading ? <CircularProgress size={24} /> : 'Claim Random Reward'}
        </Button>
      </Box>
      
      {vrfRequestInProgress && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>
            Requesting Random Number from Chainlink VRF
          </Typography>
          <CircularProgress sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            Waiting for secure, verifiable randomness...
          </Typography>
          
          {vrfResult !== null && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Random Number: <strong>{vrfResult}</strong>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Determining your reward...
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
      <Divider sx={{ mb: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Reward History
        </Typography>
        
        {rewards.length === 0 ? (
          <Alert severity="info">
            You haven't claimed any rewards yet. Make consistent contributions to become eligible.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {rewards.slice().reverse().map((reward) => (
              <Grid item xs={12} sm={6} key={reward.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {new Date(reward.date).toLocaleDateString()}
                      </Typography>
                      <Chip 
                        label={getRewardTypeLabel(reward.type)} 
                        color={getRewardTypeColor(reward.type)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      +{reward.amount} USDC
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1}>
                      <CasinoIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="textSecondary">
                        VRF Result: {reward.randomNumber}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default ChainlinkVRF;
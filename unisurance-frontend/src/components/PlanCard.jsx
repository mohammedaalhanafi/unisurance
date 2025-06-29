// src/components/PlanCard.jsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  LinearProgress, 
  Grid,
  Button
} from '@mui/material';
import CountdownTimer from './CountdownTimer';

const PlanCard = ({ plan, onContribute }) => {
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalExpected = plan.contribution * (plan.duration.includes('month') ? 
      parseInt(plan.duration) : 12); // Default to 12 if not in months
    
    return Math.min(100, (plan.totalContributed / totalExpected) * 100);
  };

  const progress = calculateProgress();

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">
          {plan.name}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          size="small"
          onClick={onContribute}
        >
          Contribute
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Monthly Contribution
            </Typography>
            <Typography variant="h6">
              {plan.contribution} USDC
            </Typography>
          </Box>
          
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Duration
            </Typography>
            <Typography variant="body1">
              {plan.duration}
            </Typography>
          </Box>
          
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Total Contributed
            </Typography>
            <Typography variant="h6">
              {plan.totalContributed} USDC
            </Typography>
          </Box>
          
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
              {progress.toFixed(1)}%
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Start Date
            </Typography>
            <Typography variant="body1">
              {new Date(plan.startDate).toLocaleDateString()}
            </Typography>
          </Box>
          
                    <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              End Date
            </Typography>
            <Typography variant="body1">
              {new Date(plan.endDate).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Time Remaining
            </Typography>
            <CountdownTimer 
              targetDate={plan.endDate} 
              compact={true}
            />
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Plan Summary
        </Typography>
        <Typography variant="body2">
          You've contributed <strong>{plan.totalContributed} USDC</strong> out of your 
          <strong> {plan.contribution * (plan.duration.includes('month') ? 
            parseInt(plan.duration) : 12)} USDC</strong> goal.
        </Typography>
        {progress < 100 ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Keep going! Continue contributing to reach your retirement goal.
          </Typography>
        ) : (
          <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
            Congratulations! You've reached your contribution goal.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PlanCard;
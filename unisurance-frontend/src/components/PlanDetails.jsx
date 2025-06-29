import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Divider,
  Chip
} from '@mui/material';
import { formatNumber } from '../utils/helpers';
import CountdownTimer from './CountdownTimer';

const PlanDetails = ({ plan, onComplete }) => {
  const isActive = new Date(plan.endDate) > new Date();
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          {plan.name}
        </Typography>
        
        <Chip 
          label={isActive ? "Active" : "Completed"} 
          color={isActive ? "success" : "default"}
          variant="outlined"
        />
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="textSecondary">
            Contribution
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatNumber(plan.contribution)} USDC
          </Typography>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="textSecondary">
            Start Date
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {new Date(plan.startDate).toLocaleDateString()}
          </Typography>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="textSecondary">
            End Date
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {new Date(plan.endDate).toLocaleDateString()}
          </Typography>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <Typography variant="body2" color="textSecondary">
            Total Contributed
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatNumber(plan.totalContributed)} USDC
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {isActive ? (
        <CountdownTimer 
          targetDate={plan.endDate} 
          onComplete={() => onComplete && onComplete(plan.id)}
          title="Time Remaining"
        />
      ) : (
        <Box sx={{ bgcolor: 'success.light', color: 'white', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" align="center">
            Plan Completed! You can now start receiving your retirement income.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PlanDetails;
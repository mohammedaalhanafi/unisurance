import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Slider, 
  Grid,
  Box,
  Paper
} from '@mui/material';
import { formatNumber } from '../utils/helpers';

const RetirementCalculator = () => {
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [contributionPeriod, setContributionPeriod] = useState(12);
  const [apy, setApy] = useState(5);
  const [projectedYield, setProjectedYield] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  useEffect(() => {
    // Calculate projected yield
    const principal = monthlyContribution * contributionPeriod;
    const annualYield = principal * (apy / 100);
    setProjectedYield(annualYield);
    setMonthlyIncome(annualYield / 12);
  }, [monthlyContribution, contributionPeriod, apy]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Retirement Calculator
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom>
              Monthly Contribution (USDC)
            </Typography>
            <TextField
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
              fullWidth
              InputProps={{
                inputProps: { min: 0, step: 10 }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>
              Contribution Period (Months): {contributionPeriod}
            </Typography>
            <Slider
              value={contributionPeriod}
              onChange={(e, newValue) => setContributionPeriod(newValue)}
              min={1}
              max={60}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1' },
                { value: 12, label: '12' },
                { value: 24, label: '24' },
                { value: 36, label: '36' },
                { value: 48, label: '48' },
                { value: 60, label: '60' }
              ]}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>
              Estimated APY (%): {apy}%
            </Typography>
            <Slider
              value={apy}
              onChange={(e, newValue) => setApy(newValue)}
              min={1}
              max={15}
              valueLabelDisplay="auto"
              marks={[
                { value: 1, label: '1%' },
                { value: 5, label: '5%' },
                { value: 10, label: '10%' },
                { value: 15, label: '15%' }
              ]}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    Total Contribution:
                  </Typography>
                  <Typography variant="h6">
                    {formatNumber(monthlyContribution * contributionPeriod)} USDC
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    Annual Yield:
                  </Typography>
                  <Typography variant="h6">
                    {formatNumber(projectedYield)} USDC
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Estimated Monthly Income:
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(monthlyIncome)} USDC
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RetirementCalculator;
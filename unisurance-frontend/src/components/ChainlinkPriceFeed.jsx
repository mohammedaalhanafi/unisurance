// src/components/ChainlinkPriceFeed.jsx
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider,
  Grid,
  Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Mock Chainlink price feed data for hackathon
const MOCK_PRICE_FEEDS = {
  'USDC/USD': {
    price: 1.0002,
    lastUpdated: new Date().getTime(),
    change24h: 0.0001,
    address: '0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7'
  },
  'ETH/USD': {
    price: 3245.67,
    lastUpdated: new Date().getTime(),
    change24h: 2.34,
    address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
  },
  'BTC/USD': {
    price: 42567.89,
    lastUpdated: new Date().getTime(),
    change24h: -1.23,
    address: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c'
  },
  'LINK/USD': {
    price: 14.32,
    lastUpdated: new Date().getTime(),
    change24h: 3.45,
    address: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c'
  }
};

const ChainlinkPriceFeed = () => {
  const [priceFeeds, setPriceFeeds] = useState(MOCK_PRICE_FEEDS);
  const [loading, setLoading] = useState(false);

  // Simulate fetching updated price data
  useEffect(() => {
    const updatePrices = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, we would fetch from Chainlink here
        // For the hackathon, we'll simulate price changes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedFeeds = { ...priceFeeds };
        
        // Update each price with small random changes
        Object.keys(updatedFeeds).forEach(feed => {
          const randomChange = (Math.random() - 0.5) * 0.01; // Small random change
          updatedFeeds[feed] = {
            ...updatedFeeds[feed],
            price: updatedFeeds[feed].price * (1 + randomChange),
            lastUpdated: new Date().getTime(),
            change24h: updatedFeeds[feed].change24h + randomChange * 10
          };
        });
        
        setPriceFeeds(updatedFeeds);
      } catch (error) {
        console.error('Error fetching price feeds:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial update
    updatePrices();
    
    // Update every 30 seconds
    const interval = setInterval(updatePrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Chainlink Price Feeds
        </Typography>
        <Chip 
          label="Live Data" 
          color="primary" 
          size="small" 
          variant="outlined" 
          icon={loading ? <CircularProgress size={16} /> : null}
        />
      </Box>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Real-time price data powered by Chainlink decentralized oracles.
        These secure price feeds are used to calculate the value of your portfolio.
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        {Object.entries(priceFeeds).map(([name, data]) => (
          <Grid item xs={12} sm={6} key={name}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 1
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  {name}
                </Typography>
                <Chip 
                  icon={data.change24h >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${data.change24h >= 0 ? '+' : ''}${data.change24h.toFixed(2)}%`}
                  size="small"
                  color={data.change24h >= 0 ? 'success' : 'error'}
                />
              </Box>
              
              <Typography variant="h5" sx={{ my: 1 }}>
                ${data.price.toFixed(4)}
              </Typography>
              
              <Typography variant="caption" color="textSecondary" display="block">
                Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
              </Typography>
              
              <Typography variant="caption" color="textSecondary" display="block">
                Oracle: {data.address.substring(0, 6)}...{data.address.substring(data.address.length - 4)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ChainlinkPriceFeed;
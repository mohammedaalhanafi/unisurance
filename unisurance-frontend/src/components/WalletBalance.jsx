// src/components/WalletBalance.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Divider, Chip, Button, ButtonGroup } from '@mui/material';
import { formatAmount } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';

const WalletBalance = ({ usdcContract, account, onMockBalanceUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [useMockBalance, setUseMockBalance] = useState(true); // Default to mock for hackathon
  const [addingMockTokens, setAddingMockTokens] = useState(false);
  
  // Use our custom hook for the balance
  const [mockBalance, setMockBalance] = useLocalStorage(`mock_usdc_${account || 'default'}`, "0");
  const [displayBalance, setDisplayBalance] = useState("0");

  // Function to add mock USDC
  const addMockUSDC = async (amount) => {
    if (!account) return;

    try {
      setAddingMockTokens(true);
      
      // Simulate a delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the balance
      const newBalance = (parseFloat(mockBalance) + amount).toString();
      setMockBalance(newBalance);
      setDisplayBalance(newBalance);
      
      // Notify parent component
      if (onMockBalanceUpdate) {
        onMockBalanceUpdate(newBalance);
      }
    } catch (error) {
      console.error("Error adding mock USDC:", error);
    } finally {
      setAddingMockTokens(false);
    }
  };

  // Fetch balance when component mounts or account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) {
        setDisplayBalance("0");
        return;
      }
      
      setLoading(true);
      
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
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Set up an interval to refresh the balance every 3 seconds
    const interval = setInterval(fetchBalance, 3000);
    
    return () => clearInterval(interval);
  }, [account, usdcContract, useMockBalance, mockBalance]);

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">
          Wallet Balance
        </Typography>
        {useMockBalance && (
          <Chip 
            label="Mock" 
            color="secondary" 
            size="small" 
            variant="outlined" 
          />
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {!account ? (
        <Typography variant="body2" color="textSecondary">
          Connect your wallet to view your balance
        </Typography>
      ) : loading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="textSecondary">
            USDC Balance {useMockBalance ? "(Mock)" : ""}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
            {displayBalance} USDC
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block" mb={2}>
            Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Test USDC Faucet
          </Typography>
          
          <ButtonGroup variant="outlined" disabled={addingMockTokens} fullWidth>
            <Button 
              onClick={() => addMockUSDC(100)}
              color="primary"
            >
              +100
            </Button>
            <Button 
              onClick={() => addMockUSDC(500)}
              color="primary"
            >
              +500
            </Button>
            <Button 
              onClick={() => addMockUSDC(1000)}
              color="primary"
            >
              +1000
            </Button>
          </ButtonGroup>
          
          {addingMockTokens && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default WalletBalance;
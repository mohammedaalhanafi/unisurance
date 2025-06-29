// src/components/MockUSDCButton.jsx
import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';

const MockUSDCButton = ({ account, onBalanceUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const addMockUSDC = async () => {
    if (!account) {
      setNotification({
        open: true,
        message: 'Please connect your wallet first',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate a delay for realism
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current mock balance from localStorage
      const currentBalance = localStorage.getItem(`mock_usdc_${account}`) || "0";
      
      // Add 100 USDC
      const newBalance = (parseFloat(currentBalance) + 100).toString();
      
      // Store in localStorage
      localStorage.setItem(`mock_usdc_${account}`, newBalance);
      
      // Trigger balance update in parent component
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
      
      setNotification({
        open: true,
        message: 'Successfully added 100 USDC for testing!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error adding mock USDC:", error);
      setNotification({
        open: true,
        message: `Failed to add USDC: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={addMockUSDC}
        disabled={loading || !account}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Get Test USDC'}
      </Button>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MockUSDCButton;
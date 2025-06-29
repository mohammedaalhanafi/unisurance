// src/components/AddMockUSDCButton.jsx
import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert, Box, ButtonGroup } from '@mui/material';

const AddMockUSDCButton = ({ account, onBalanceUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const addMockUSDC = async (amount) => {
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get current mock balance from localStorage
      const currentBalance = localStorage.getItem(`mock_usdc_${account}`) || "0";
      
      // Add the specified amount of USDC
      const newBalance = (parseFloat(currentBalance) + amount).toString();
      
      // Store in localStorage
      localStorage.setItem(`mock_usdc_${account}`, newBalance);
      
      // Trigger balance update in parent component
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalance);
      }
      
      setNotification({
        open: true,
        message: `Successfully added ${amount} USDC for testing!`,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <ButtonGroup variant="outlined" disabled={loading || !account}>
          <Button 
            onClick={() => addMockUSDC(100)}
            color="primary"
          >
            +100 USDC
          </Button>
          <Button 
            onClick={() => addMockUSDC(500)}
            color="primary"
          >
            +500 USDC
          </Button>
          <Button 
            onClick={() => addMockUSDC(1000)}
            color="primary"
          >
            +1000 USDC
          </Button>
        </ButtonGroup>
        
        {loading && (
          <Box display="flex" justifyContent="center" my={1}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      
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

export default AddMockUSDCButton;
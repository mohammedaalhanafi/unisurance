// src/components/USDCFaucetButton.jsx
import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ethers } from 'ethers';

const USDCFaucetButton = ({ account }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const mintTestUSDC = async () => {
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
      
      // Get the provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // USDC contract address (this should be your testnet USDC address)
      const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
      
      // USDC contract ABI (simplified for mint function)
      const usdcAbi = [
        "function mint(address to, uint256 amount) returns (bool)"
      ];
      
      // Create contract instance
      const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
      
      // Amount to mint (100 USDC with 6 decimals)
      const amount = ethers.utils.parseUnits("100", 6);
      
      // Call mint function
      const tx = await usdcContract.mint(account, amount);
      await tx.wait();
      
      setNotification({
        open: true,
        message: 'Successfully minted 100 USDC for testing!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Error minting USDC:", error);
      
      // Check if the contract doesn't have a mint function
      if (error.message.includes("mint is not a function") || 
          error.message.includes("function selector was not recognized")) {
        setNotification({
          open: true,
          message: 'This USDC contract does not have a mint function. Please use a faucet or transfer tokens manually.',
          severity: 'error'
        });
      } else {
        setNotification({
          open: true,
          message: `Failed to mint USDC: ${error.message}`,
          severity: 'error'
        });
      }
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
        onClick={mintTestUSDC}
        disabled={loading || !account}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Minting...' : 'Get Test USDC'}
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

export default USDCFaucetButton;
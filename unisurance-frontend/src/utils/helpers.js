import { ethers } from 'ethers';

// Format address to shorter version
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format amount with proper decimals
export const formatAmount = (amount, decimals = 6) => {
  if (!amount) return '0';
  return ethers.utils.formatUnits(amount, decimals);
};

// Parse amount to BigNumber with proper decimals
export const parseAmount = (amount, decimals = 6) => {
  if (!amount) return ethers.BigNumber.from(0);
  return ethers.utils.parseUnits(amount.toString(), decimals);
};

// Format date from timestamp
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleDateString();
};

// Calculate progress percentage
export const calculateProgress = (current, target) => {
  if (!current || !target) return 0;
  return Math.min(100, (current / target) * 100);
};

// Format number with commas
export const formatNumber = (value) => {
  if (!value) return '0';
  return parseFloat(value).toLocaleString('en-US', {
    maximumFractionDigits: 2
  });
};
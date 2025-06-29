import { ethers } from 'ethers';
import { UNISURANCE_ADDRESS, USDC_ADDRESS, UNISURANCE_ABI, USDC_ABI } from '../contracts/config';

// Get provider
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

// Connect wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask!");
  }
  
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  return { provider, signer, address };
};

// Get contract instances
export const getContracts = (signer) => {
  const unisuranceContract = new ethers.Contract(UNISURANCE_ADDRESS, UNISURANCE_ABI, signer);
  const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
  
  return { unisuranceContract, usdcContract };
};

// Get USDC balance
export const getUSDCBalance = async (usdcContract, address) => {
  try {
    const balance = await usdcContract.balanceOf(address);
    return balance;
  } catch (error) {
    console.error("Error getting USDC balance:", error);
    return ethers.BigNumber.from(0);
  }
};

// Approve USDC spending
export const approveUSDC = async (usdcContract, spenderAddress, amount) => {
  try {
    const tx = await usdcContract.approve(spenderAddress, amount);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error approving USDC:", error);
    throw error;
  }
};

// Transfer USDC
export const transferUSDC = async (usdcContract, toAddress, amount) => {
  try {
    const tx = await usdcContract.transfer(toAddress, amount);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error transferring USDC:", error);
    throw error;
  }
};

// Check USDC allowance
export const checkAllowance = async (usdcContract, ownerAddress, spenderAddress) => {
  try {
    const allowance = await usdcContract.allowance(ownerAddress, spenderAddress);
    return allowance;
  } catch (error) {
    console.error("Error checking allowance:", error);
    return ethers.BigNumber.from(0);
  }
};
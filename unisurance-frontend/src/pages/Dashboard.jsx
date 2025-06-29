// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Alert, 
  Button, 
  Divider,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress,
  Badge
} from '@mui/material';
import { motion } from 'framer-motion';
import PlanCard from '../components/PlanCard';
import WalletBalance from '../components/WalletBalance';
import ContributeForm from '../components/ContributeForm';
import ChainlinkPriceFeed from '../components/ChainlinkPriceFeed';
import ChainlinkAutomation from '../components/ChainlinkAutomation';
import ChainlinkVRF from '../components/ChainlinkVRF';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CasinoIcon from '@mui/icons-material/Casino';
import DataObjectIcon from '@mui/icons-material/DataObject';
import InfoIcon from '@mui/icons-material/Info';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link } from 'react-router-dom';

// Wrap components with motion for animations
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Dashboard = ({ usdcContract, account }) => {
  const [plans, setPlans] = useState([]);
  const [mockBalanceUpdated, setMockBalanceUpdated] = useState(0);
  const [activeChainlinkFeature, setActiveChainlinkFeature] = useState('pricefeed');
  const theme = useTheme();

  useEffect(() => {
    // Load plans from localStorage
    const loadPlans = () => {
      const storedPlans = localStorage.getItem('unisurancePlans');
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      }
    };

    loadPlans();
    
    // Listen for plan updates
    const handlePlanUpdate = () => {
      loadPlans();
    };
    
    window.addEventListener('plan-update', handlePlanUpdate);
    
    return () => {
      window.removeEventListener('plan-update', handlePlanUpdate);
    };
  }, []);

  const handleMockBalanceUpdate = () => {
    setMockBalanceUpdated(prev => prev + 1); // Increment to force re-render
  };

  const handleContributionSuccess = (plan, amount) => {
    // Reload plans after contribution
    const storedPlans = localStorage.getItem('unisurancePlans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    }
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('plan-update'));
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    if (!plans || plans.length === 0) return 0;
    return plans.reduce((total, plan) => total + parseFloat(plan.totalContributed || 0), 0);
  };

  // Get a random growth percentage for demo purposes
  const getRandomGrowth = () => {
    return (Math.random() * 10 + 5).toFixed(2); // Random between 5% and 15%
  };

  return (
    <Container maxWidth="lg">
      <MotionBox 
        py={4}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dashboard Header */}
        <MotionBox
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Your Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {account ? 
                `Welcome back, ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 
                'Connect your wallet to view your personalized dashboard'}
            </Typography>
          </Box>
          
          {account && (
            <Chip 
              icon={<AccountBalanceWalletIcon />}
              label={`Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              color="primary"
              variant="outlined"
              sx={{ 
                borderRadius: '16px', 
                px: 1,
                background: alpha(theme.palette.primary.main, 0.1)
              }}
            />
          )}
        </MotionBox>
        
        {!account && (
          <MotionPaper
            elevation={3}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.3)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                <AccountBalanceWalletIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Wallet Not Connected
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please connect your wallet to access your retirement plans and Chainlink-powered features.
                </Typography>
              </Box>
            </Box>
          </MotionPaper>
        )}
        
        {account && (
          <>
            {/* Portfolio Overview */}
            <MotionPaper
              elevation={3}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Portfolio Value
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                      ${calculateTotalValue().toFixed(2)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        icon={<TrendingUpIcon />} 
                        label={`+${getRandomGrowth()}%`} 
                        size="small" 
                        color="success"
                        sx={{ borderRadius: '8px' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last 30 days
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Active Plans
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                      {plans.length}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, plans.length * 20)} 
                        sx={{ 
                          width: '100%', 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }} 
                      />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Retirement Readiness
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                      {plans.length > 0 ? `${Math.min(100, plans.length * 25)}%` : '0%'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        component={Link} 
                        to="/create-plan"
                        sx={{ 
                          borderRadius: '8px',
                          textTransform: 'none'
                        }}
                      >
                        Improve Score
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </MotionPaper>
            
            {/* Chainlink Features */}
            <MotionPaper
              elevation={3}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '4px', 
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` 
                }} 
              />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <img 
                    src="https://cdn.prod.website-files.com/5f6b7190899f41fb70882d08/665705c1f3833b5b5d8f4ffb_logo-chainlink-blue.svg" 
                    alt="Chainlink Logo" 
                    style={{ width: 28, height: 28 }} 
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Chainlink Powered Features
                  </Typography>
                </Box>
                
                <Tooltip title="Learn more about Chainlink integration">
                  <IconButton 
                    component={Link} 
                    to="/chainlink-info" 
                    color="primary" 
                    sx={{ 
                      background: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <MotionCard 
                    variant={activeChainlinkFeature === 'pricefeed' ? 'elevation' : 'outlined'} 
                    elevation={activeChainlinkFeature === 'pricefeed' ? 4 : 1}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveChainlinkFeature('pricefeed')}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: '12px',
                      height: '100%',
                      border: activeChainlinkFeature === 'pricefeed' 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      background: activeChainlinkFeature === 'pricefeed'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`
                        : 'transparent'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          mx: 'auto', 
                          mb: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: activeChainlinkFeature === 'pricefeed' 
                            ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}` 
                            : 'none'
                        }}
                      >
                        <DataObjectIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Price Feeds
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Real-time market data for accurate portfolio valuation
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <MotionCard 
                    variant={activeChainlinkFeature === 'automation' ? 'elevation' : 'outlined'} 
                    elevation={activeChainlinkFeature === 'automation' ? 4 : 1}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveChainlinkFeature('automation')}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: '12px',
                      height: '100%',
                      border: activeChainlinkFeature === 'automation' 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                           background: activeChainlinkFeature === 'automation'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`
                        : 'transparent'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          mx: 'auto', 
                          mb: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: activeChainlinkFeature === 'automation' 
                            ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}` 
                            : 'none'
                        }}
                      >
                        <AutorenewIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Automation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Set up recurring contributions that run automatically
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <MotionCard 
                    variant={activeChainlinkFeature === 'vrf' ? 'elevation' : 'outlined'} 
                    elevation={activeChainlinkFeature === 'vrf' ? 4 : 1}
                    whileHover={{ 
                      y: -8,
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveChainlinkFeature('vrf')}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: '12px',
                      height: '100%',
                      border: activeChainlinkFeature === 'vrf' 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      background: activeChainlinkFeature === 'vrf'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`
                        : 'transparent'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          mx: 'auto', 
                          mb: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          boxShadow: activeChainlinkFeature === 'vrf' 
                            ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}` 
                            : 'none'
                        }}
                      >
                        <CasinoIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        VRF Rewards
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Earn random rewards for consistent contributions
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                sx={{ mt: 3 }}
              >
                {activeChainlinkFeature === 'pricefeed' && (
                  <ChainlinkPriceFeed />
                )}
                
                {activeChainlinkFeature === 'automation' && (
                  <ChainlinkAutomation 
                    account={account}
                    plans={plans}
                    onMockBalanceUpdate={handleMockBalanceUpdate}
                  />
                )}
                
                {activeChainlinkFeature === 'vrf' && (
                  <ChainlinkVRF 
                    account={account}
                    plans={plans}
                    onMockBalanceUpdate={handleMockBalanceUpdate}
                  />
                )}
              </MotionBox>
            </MotionPaper>
            
            {/* Main Dashboard Content */}
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={4}>
                <MotionBox
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <MotionPaper
                    elevation={3}
                    whileHover={{ y: -5 }}
                    sx={{ 
                      p: 3, 
                      borderRadius: '16px',
                      mb: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.15)} 100%)`,
                    }}
                  >
                    <WalletBalance 
                      usdcContract={usdcContract} 
                      account={account} 
                      onMockBalanceUpdate={handleMockBalanceUpdate}
                    />
                  </MotionPaper>
                  
                  <MotionPaper
                    elevation={3}
                    whileHover={{ y: -5 }}
                    sx={{ 
                      p: 3, 
                      borderRadius: '16px',
                      background: 'white'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Make a Contribution
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <ContributeForm 
                      account={account} 
                      onMockBalanceUpdate={handleMockBalanceUpdate}
                      onContributionSuccess={handleContributionSuccess}
                    />
                  </MotionPaper>
                </MotionBox>
              </Grid>
              
              {/* Right Column */}
              <Grid item xs={12} md={8}>
                <MotionBox
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                      Your Retirement Plans
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={Link}
                      to="/create-plan"
                      sx={{ 
                        borderRadius: '10px',
                        textTransform: 'none',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      }}
                    >
                      Create New Plan
                    </Button>
                  </Box>
                  
                  {plans.length === 0 ? (
                    <MotionPaper
                      elevation={3}
                      whileHover={{ y: -5 }}
                      sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.15)} 100%)`,
                        border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`
                      }}
                    >
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" 
                        alt="No plans" 
                        style={{ width: 100, height: 100, marginBottom: 16, opacity: 0.7 }} 
                      />
                      <Typography variant="h6" gutterBottom>
                        No Active Plans Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Start your journey to a secure retirement by creating your first plan.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary"
                        component={Link}
                        to="/create-plan"
                        sx={{ 
                          borderRadius: '10px',
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        }}
                      >
                        Create Your First Plan
                      </Button>
                    </MotionPaper>
                  ) : (
                    <Grid container spacing={3}>
                      {plans.map((plan, index) => (
                        <Grid item xs={12} key={plan.id}>
                          <MotionPaper
                            elevation={3}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            sx={{ 
                              borderRadius: '16px',
                              overflow: 'hidden',
                              position: 'relative'
                            }}
                          >
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '4px', 
                                height: '100%', 
                                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` 
                              }} 
                            />
                            <PlanCard 
                              plan={plan} 
                              onContribute={() => {
                                // Scroll to contribute form
                                const contributeForm = document.getElementById('contribute-form');
                                if (contributeForm) {
                                  contributeForm.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                            />
                          </MotionPaper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </MotionBox>
              </Grid>
            </Grid>
          </>
        )}
      </MotionBox>
    </Container>
  );
};

export default Dashboard;
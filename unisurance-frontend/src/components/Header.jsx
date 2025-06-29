// src/components/Header.jsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import LinkIcon from '@mui/icons-material/Link';

const Header = ({ account, connectWallet, disconnectWallet }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    handleClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Create Plan', icon: <AddCircleOutlineIcon />, path: '/create-plan' },
    { text: 'Chainlink Integration', icon: <LinkIcon />, path: '/chainlink-info' }
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleMobileMenu}
        onKeyDown={toggleMobileMenu}
      >
        <List>
          <ListItem>
            <Typography variant="h6" color="primary">
              UniSurance
            </Typography>
          </ListItem>
          <Divider />
          {menuItems.map((item) => (
            <ListItem 
              button 
              component={RouterLink} 
              to={item.path} 
              key={item.text}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem>
            {account ? (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={handleDisconnect}
                fullWidth
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={connectWallet}
                fullWidth
              >
                Connect Wallet
              </Button>
            )}
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            UniSurance
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ mx: 1 }}
              >
                Home
              </Button>
              
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/dashboard"
                startIcon={<DashboardIcon />}
                sx={{ mx: 1 }}
              >
                Dashboard
              </Button>
              
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/create-plan"
                startIcon={<AddCircleOutlineIcon />}
                sx={{ mx: 1 }}
              >
                Create Plan
              </Button>
              
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/chainlink-info"
                startIcon={<LinkIcon />}
                sx={{ mx: 1 }}
              >
                Chainlink Integration
              </Button>
            </Box>
          )}
          
          {!isMobile && (
            <Box sx={{ ml: 2 }}>
              {account ? (
                <>
                  <Chip
                    label={formatAddress(account)}
                    color="primary"
                    variant="outlined"
                    onClick={handleMenu}
                    icon={<AccountBalanceWalletIcon />}
                  />
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
      {renderMobileMenu()}
    </AppBar>
  );
};

export default Header;
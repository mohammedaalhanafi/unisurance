// src/pages/ChainlinkInfo.jsx
import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Button,
  Link
} from '@mui/material';
import DataObjectIcon from '@mui/icons-material/DataObject';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CasinoIcon from '@mui/icons-material/Casino';
import SecurityIcon from '@mui/icons-material/Security';

const ChainlinkInfo = () => {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Powered by Chainlink
        </Typography>
        
        <Typography variant="body1" paragraph>
          Our retirement planning platform leverages Chainlink's decentralized oracle network to provide secure, reliable, and tamper-proof data and automation services.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="140"
                image="https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a499b56c47b8fa74fbb_chainlink-data-feeds.svg"
                alt="Chainlink Data Feeds"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Price Feeds
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  We use Chainlink Price Feeds to access accurate, up-to-date market data for cryptocurrencies and traditional assets. This ensures your retirement portfolio is always valued correctly.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <DataObjectIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Decentralized Data" 
                      secondary="Aggregated from many sources for reliability" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Secure & Tamper-proof" 
                      secondary="Protected against manipulation" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="140"
                image="https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a4a9b56c4510fa74fbc_chainlink-keepers.svg"
                alt="Chainlink Automation"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Automation
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Chainlink Automation enables reliable, decentralized execution of your recurring contributions. Set it and forget it - your retirement plan stays on track even if you're offline.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AutorenewIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Automated Contributions" 
                      secondary="Regular deposits without manual intervention" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Decentralized Execution" 
                      secondary="No single point of failure" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="140"
                image="https://assets-global.website-files.com/5f6b7190899f41fb70882d08/5f760a4a9b56c43e8fa74fbd_chainlink-vrf.svg"
                alt="Chainlink VRF"
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  VRF Rewards
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Our reward system uses Chainlink VRF (Verifiable Random Function) to fairly distribute rewards to consistent contributors. This ensures that reward distribution is provably fair and cannot be manipulated.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CasinoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Provably Fair Randomness" 
                      secondary="Cryptographically guaranteed random rewards" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tamper-proof" 
                      secondary="Cannot be manipulated by any party" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            How We Use Chainlink
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Price Feeds Implementation
              </Typography>
              <Typography variant="body2" paragraph>
                Our platform uses Chainlink Price Feeds to:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Get accurate USDC/USD exchange rates" 
                    secondary="Ensures your contributions are valued correctly" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Track the value of your retirement portfolio" 
                    secondary="Real-time valuation of your assets" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Calculate yield farming returns" 
                    secondary="Accurate APY calculations based on market data" 
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed rgba(0, 0, 0, 0.12)' }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Example Price Feed Contract:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ overflowX: 'auto' }}>
                  {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeedConsumer {
    AggregatorV3Interface internal priceFeed;

    constructor() {
        // USDC/USD Price Feed on Sepolia
        priceFeed = AggregatorV3Interface(0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E);
    }

    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return price;
    }
}`}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Automation Implementation
              </Typography>
              <Typography variant="body2" paragraph>
                Our platform uses Chainlink Automation to:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Execute recurring contributions" 
                    secondary="Automatically contribute to your retirement plan on schedule" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Rebalance yield farming positions" 
                    secondary="Optimize your returns by shifting between strategies" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Compound earned interest" 
                    secondary="Maximize growth through automatic reinvestment" 
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed rgba(0, 0, 0, 0.12)' }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Example Automation Contract:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ overflowX: 'auto' }}>
                  {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract RetirementContribution is AutomationCompatibleInterface {
    uint public lastContributionTime;
    uint public contributionInterval;
    address public owner;
    
    constructor(uint _interval) {
        owner = msg.sender;
        lastContributionTime = block.timestamp;
        contributionInterval = _interval;
    }
    
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastContributionTime) > contributionInterval;
        return (upkeepNeeded, "");
    }
    
    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastContributionTime) > contributionInterval) {
            lastContributionTime = block.timestamp;
            // Execute contribution logic here
        }
    }
}`}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                VRF Implementation
              </Typography>
              <Typography variant="body2" paragraph>
                Our platform uses Chainlink VRF to:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Distribute random rewards to consistent contributors" 
                    secondary="Incentivize regular contributions with fair reward distribution" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Select random yield farming strategies" 
                    secondary="Diversify risk through randomized allocation" 
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed rgba(0, 0, 0, 0.12)' }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Example VRF Contract:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ overflowX: 'auto' }}>
                  {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

contract RetirementRewards is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    
    uint64 s_subscriptionId;
    bytes32 keyHash;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    
    mapping(uint256 => address) public s_requestIdToSender;
    mapping(address => uint256) public s_rewards;
    
    event RewardDistributed(address indexed user, uint256 amount);
    
    constructor(uint64 subscriptionId) VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625) {
        COORDINATOR = VRFCoordinatorV2Interface(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625);
        s_subscriptionId = subscriptionId;
        keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    }
    
    function requestRandomReward() external {
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requestIdToSender[requestId] = msg.sender;
    }
    
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address user = s_requestIdToSender[requestId];
        uint256 randomNumber = randomWords[0] % 100;
        
        uint256 rewardAmount;
        if (randomNumber < 5) {
            // 5% chance for large reward
            rewardAmount = 50;
        } else if (randomNumber < 25) {
            // 20% chance for medium reward
            rewardAmount = 20;
        } else {
            // 75% chance for small reward
            rewardAmount = 5;
        }
        
        s_rewards[user] += rewardAmount;
        emit RewardDistributed(user, rewardAmount);
    }
}`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Learn More About Chainlink
          </Typography>
          <Typography variant="body2" paragraph>
            Visit the official Chainlink documentation to learn more about how these decentralized oracle services work.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button 
                variant="outlined" 
                color="primary" 
                component="a" 
                href="https://docs.chain.link/data-feeds" 
                target="_blank"
                startIcon={<DataObjectIcon />}
              >
                Price Feeds Docs
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                color="primary" 
                component="a" 
                href="https://docs.chain.link/chainlink-automation" 
                target="_blank"
                startIcon={<AutorenewIcon />}
              >
                Automation Docs
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                color="primary" 
                component="a" 
                href="https://docs.chain.link/vrf" 
                target="_blank"
                startIcon={<CasinoIcon />}
              >
                VRF Docs
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ChainlinkInfo;
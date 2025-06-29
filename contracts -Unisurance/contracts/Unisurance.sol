// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./interfaces/IYieldStrategy.sol";

contract Unisurance is ReentrancyGuard, AccessControl, VRFConsumerBaseV2 {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Token and price feed configuration
    IERC20 public stablecoin;
    AggregatorV3Interface public priceFeed;
    IYieldStrategy public yieldStrategy;
    uint8 public tokenDecimals;

    // Chainlink VRF configuration
    VRFCoordinatorV2Interface public COORDINATOR;
    uint64 public subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    // System parameters
    uint256 public minimumContribution = 10 * 10**6; // 10 USDC
    uint256 public yieldFee = 500; // 5% fee on yield (basis points)
    uint256 public lotteryProbability = 1000; // 10% chance (basis points)
    uint256 public lotteryBonus = 1000; // 10% bonus (basis points)

    // User retirement plan
    struct RetirementPlan {
        uint256 targetMonths;
        uint256 monthlyContribution;
        uint256 startTime;
        uint256 lastContributionTime;
        uint256 totalContributed;
        uint256 monthsContributed;
        bool inRetirementPhase;
        uint256 lastWithdrawalTime;
    }

    // User data mapping
    mapping(address => RetirementPlan) public retirementPlans;
    
    // VRF request mapping
    mapping(uint256 => address) public vrfRequests;

    // Events
    event PlanCreated(address indexed user, uint256 targetMonths, uint256 monthlyContribution);
    event ContributionMade(address indexed user, uint256 amount);
    event RetirementPhaseStarted(address indexed user);
    event YieldWithdrawn(address indexed user, uint256 amount);
    event LotteryWon(address indexed user, uint256 bonusAmount);
    event VRFRequested(address indexed user, uint256 requestId);

    /**
     * @dev Constructor sets the token, price feed, and VRF coordinator
     */
    constructor(
        address _stablecoin,
        address _priceFeed,
        address _yieldStrategy,
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        stablecoin = IERC20(_stablecoin);
        priceFeed = AggregatorV3Interface(_priceFeed);
        yieldStrategy = IYieldStrategy(_yieldStrategy);
        
        // Set up VRF
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;

        // Get token decimals
        try IERC20Metadata(_stablecoin).decimals() returns (uint8 decimals) {
            tokenDecimals = decimals;
        } catch {
            tokenDecimals = 6; // Default to 6 decimals (USDC)
        }

        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Creates a new retirement plan for the user
     * @param targetMonths The number of months the user plans to contribute
     * @param monthlyContribution The amount the user plans to contribute monthly
     */
    function createPlan(uint256 targetMonths, uint256 monthlyContribution) external {
        require(targetMonths > 0, "Target months must be greater than 0");
        require(monthlyContribution >= minimumContribution, "Contribution below minimum");
        require(retirementPlans[msg.sender].startTime == 0, "Plan already exists");

        retirementPlans[msg.sender] = RetirementPlan({
            targetMonths: targetMonths,
            monthlyContribution: monthlyContribution,
            startTime: block.timestamp,
            lastContributionTime: 0,
            totalContributed: 0,
            monthsContributed: 0,
            inRetirementPhase: false,
            lastWithdrawalTime: 0
        });

        emit PlanCreated(msg.sender, targetMonths, monthlyContribution);
    }

    /**
     * @dev Allows users to contribute to their retirement plan
     * @param amount The amount of stablecoins to contribute
     */
    function contribute(uint256 amount) external nonReentrant {
        RetirementPlan storage plan = retirementPlans[msg.sender];
        require(plan.startTime > 0, "No plan exists");
        require(!plan.inRetirementPhase, "Already in retirement phase");
        require(amount >= minimumContribution, "Contribution below minimum");

        // Transfer tokens from user to contract
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        
        // Approve tokens for yield strategy
        stablecoin.approve(address(yieldStrategy), amount);
        
        // Deposit into yield strategy
        yieldStrategy.deposit(amount);

        // Update contribution data
        plan.totalContributed += amount;
        
        // Check if this is a new month contribution
        if (plan.lastContributionTime == 0 || 
            _getMonthId(block.timestamp) > _getMonthId(plan.lastContributionTime)) {
            plan.monthsContributed += 1;
        }
        
        plan.lastContributionTime = block.timestamp;

        emit ContributionMade(msg.sender, amount);
        
        // Request VRF for lottery
        if (_random(10000) < lotteryProbability) {
            _requestRandomness();
        }
        
        // Check if plan is complete
        if (plan.monthsContributed >= plan.targetMonths) {
            plan.inRetirementPhase = true;
            emit RetirementPhaseStarted(msg.sender);
        }
    }

    /**
     * @dev Allows users in retirement phase to withdraw yield
     */
    function withdrawYield() external nonReentrant {
        RetirementPlan storage plan = retirementPlans[msg.sender];
        require(plan.inRetirementPhase, "Not in retirement phase");
        require(
            plan.lastWithdrawalTime == 0 || 
            block.timestamp >= plan.lastWithdrawalTime + 30 days,
            "Can only withdraw once per month"
        );

        // Calculate available yield
        uint256 availableYield = yieldStrategy.getYield(msg.sender);
        require(availableYield > 0, "No yield available");

        // Calculate fee
        uint256 fee = (availableYield * yieldFee) / 10000;
        uint256 userAmount = availableYield - fee;

        // Withdraw from yield strategy
        yieldStrategy.withdraw(availableYield);

                // Transfer to user
        stablecoin.safeTransfer(msg.sender, userAmount);
        
        // Keep fee in contract
        if (fee > 0) {
            stablecoin.safeTransfer(address(this), fee);
        }

        // Update withdrawal time
        plan.lastWithdrawalTime = block.timestamp;

        emit YieldWithdrawn(msg.sender, userAmount);
    }

    /**
     * @dev Allows users to withdraw their principal after retirement phase
     * @param amount The amount to withdraw
     */
    function withdrawPrincipal(uint256 amount) external nonReentrant {
        RetirementPlan storage plan = retirementPlans[msg.sender];
        require(plan.inRetirementPhase, "Not in retirement phase");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= plan.totalContributed, "Amount exceeds total contribution");

        // Withdraw from yield strategy
        yieldStrategy.withdraw(amount);

        // Update user's total contributed
        plan.totalContributed -= amount;

        // Transfer to user
        stablecoin.safeTransfer(msg.sender, amount);
    }

    /**
     * @dev Gets the current retirement plan status for a user
     * @param user The address of the user
     * @return targetMonths The target months for contribution
     * @return monthlyContribution The monthly contribution amount
     * @return monthsContributed The number of months contributed
     * @return totalContributed The total amount contributed
     * @return inRetirementPhase Whether the user is in retirement phase
     * @return currentYield The current yield available
     * @return projectedMonthlyIncome The projected monthly income in retirement
     */
    function getPlanStatus(address user) external view returns (
        uint256 targetMonths,
        uint256 monthlyContribution,
        uint256 monthsContributed,
        uint256 totalContributed,
        bool inRetirementPhase,
        uint256 currentYield,
        uint256 projectedMonthlyIncome
    ) {
        RetirementPlan storage plan = retirementPlans[user];
        
        targetMonths = plan.targetMonths;
        monthlyContribution = plan.monthlyContribution;
        monthsContributed = plan.monthsContributed;
        totalContributed = plan.totalContributed;
        inRetirementPhase = plan.inRetirementPhase;
        
        // Get current yield
        currentYield = yieldStrategy.getYield(user);
        
        // Calculate projected monthly income based on current APY
        uint256 apy = yieldStrategy.getCurrentAPY();
        projectedMonthlyIncome = (totalContributed * apy) / (12 * 10000);
        
        // Subtract fee
        projectedMonthlyIncome = projectedMonthlyIncome - ((projectedMonthlyIncome * yieldFee) / 10000);
    }

    /**
     * @dev Requests randomness from Chainlink VRF
     */
    function _requestRandomness() internal {
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        
        vrfRequests[requestId] = msg.sender;
        emit VRFRequested(msg.sender, requestId);
    }

    /**
     * @dev Callback function used by VRF Coordinator
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address user = vrfRequests[requestId];
        require(user != address(0), "Unknown request ID");
        
        // Use randomness to determine if user wins lottery
        if (randomWords[0] % 100 < 20) { // 20% chance to win
            // Calculate bonus amount (10% of their last contribution)
            RetirementPlan storage plan = retirementPlans[user];
            uint256 bonusAmount = (plan.monthlyContribution * lotteryBonus) / 10000;
            
            // Mint bonus directly to yield strategy
            stablecoin.safeTransfer(address(yieldStrategy), bonusAmount);
            yieldStrategy.deposit(bonusAmount);
            
            // Update user's total contributed
            plan.totalContributed += bonusAmount;
            
            emit LotteryWon(user, bonusAmount);
        }
        
        // Clean up request
        delete vrfRequests[requestId];
    }

    /**
     * @dev Helper function to get month ID from timestamp (YYYYMM format)
     */
    function _getMonthId(uint256 timestamp) internal pure returns (uint256) {
        // This is a simplified version - in production you'd want a more accurate calculation
        return timestamp / 30 days;
    }

    /**
     * @dev Simple pseudo-random number generator for non-critical randomness
     * @param max The maximum value (exclusive)
     * @return A pseudo-random number between 0 and max-1
     */
    function _random(uint256 max) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % max;
    }

    /**
     * @dev Admin function to update system parameters
     */
    function updateSystemParameters(
        uint256 _minimumContribution,
        uint256 _yieldFee,
        uint256 _lotteryProbability,
        uint256 _lotteryBonus
    ) external onlyRole(ADMIN_ROLE) {
        require(_yieldFee <= 2000, "Fee too high"); // Max 20%
        require(_lotteryProbability <= 5000, "Probability too high"); // Max 50%
        require(_lotteryBonus <= 5000, "Bonus too high"); // Max 50%
        
        minimumContribution = _minimumContribution;
        yieldFee = _yieldFee;
        lotteryProbability = _lotteryProbability;
        lotteryBonus = _lotteryBonus;
    }

    /**
     * @dev Admin function to update VRF parameters
     */
    function updateVRFParameters(
        uint64 _subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations
    ) external onlyRole(ADMIN_ROLE) {
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
    }

    /**
     * @dev Admin function to update yield strategy
     */
    function updateYieldStrategy(address _yieldStrategy) external onlyRole(ADMIN_ROLE) {
        yieldStrategy = IYieldStrategy(_yieldStrategy);
    }

    /**
     * @dev Admin function to withdraw tokens in case of emergency
     */
    function emergencyWithdraw(uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount > 0, "Amount must be greater than 0");
        stablecoin.safeTransfer(msg.sender, amount);
    }
}

// Interface for getting token decimals
interface IERC20Metadata is IERC20 {
    function decimals() external view returns (uint8);
}
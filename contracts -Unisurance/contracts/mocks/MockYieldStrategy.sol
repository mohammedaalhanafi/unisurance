// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IYieldStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockYieldStrategy is IYieldStrategy {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable token;
    uint256 public apy = 500; // 5% APY (with 2 decimals)
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public depositTime;
    
    constructor(address _token) {
        token = IERC20(_token);
    }
    
    function deposit(uint256 amount) external override returns (bool) {
        token.safeTransferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;
        if (depositTime[msg.sender] == 0) {
            depositTime[msg.sender] = block.timestamp;
        }
        return true;
    }
    
    function withdraw(uint256 amount) external override returns (uint256) {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
        return amount;
    }
    
    function getYield(address user) external view override returns (uint256) {
        if (depositTime[user] == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - depositTime[user];
        uint256 secondsInYear = 365 days;
        
        // Calculate yield: principal * rate * time
        return (deposits[user] * apy * timeElapsed) / (secondsInYear * 10000);
    }
    
    function getCurrentAPY() external view override returns (uint256) {
        return apy;
    }
    
    // Admin function to set APY (for testing)
    function setAPY(uint256 _apy) external {
        apy = _apy;
    }
}
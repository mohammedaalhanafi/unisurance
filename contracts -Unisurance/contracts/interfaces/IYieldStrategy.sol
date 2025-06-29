// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IYieldStrategy {
    function deposit(uint256 amount) external returns (bool);
    function withdraw(uint256 amount) external returns (uint256);
    function getYield(address user) external view returns (uint256);
    function getCurrentAPY() external view returns (uint256);
}
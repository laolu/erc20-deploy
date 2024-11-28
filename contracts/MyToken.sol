// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    // 构造函数设置代币的名称和符号
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // 铸造初始代币供应量
        // 这里设置了1000万个代币，小数位是18
        // 1000_0000 * 10**18 表示总供应量
        _mint(msg.sender, 1000_0000 * 10**decimals());
    }
} 
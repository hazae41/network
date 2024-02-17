// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

uint256 constant U256_MAX = (2 ** 256) - 1;

contract Network is ERC20, ERC20Burnable {

    mapping(uint256 => bool) public isClaimed;

    uint256 public count = 0;
    uint256 public average = 0;

    constructor()
        ERC20("Network", "NET")
    {}

    function claim(uint256[] calldata secrets) public {
        uint256 total = 0;

        for (uint256 i = 0; i < secrets.length; i++) {
            uint256 secret = secrets[i];

            if (isClaimed[secret])
                continue;

            /**
             * Zero-knowledge proof
             */
            uint256 proof = uint256(keccak256(abi.encode(secret)));

            /**
             * Value is different for each given chain + contract + receiver
             */
            uint256 divisor = uint256(keccak256(abi.encode(block.chainid, address(this), msg.sender, proof)));

            if (divisor == 0)
                continue;

            uint256 value;

            /**
             * Rarer hashes yield more coins
             */
            unchecked {
                value = U256_MAX / divisor;
            }

            /**
             * Automatic probabilistic halving
             */
            if (value > average) {
                uint256 count2 = count + 1;
                uint256 average2 = ((count * average) + value) / count2;

                value = average;

                count = count2;
                average = average2;
            }

            isClaimed[secret] = true;

            total += value;
        }

        _mint(msg.sender, total);
    }

}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./libraries/Bytes32ToAddressMapUpgradeable.sol";

contract GovernorFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using Bytes32ToAddressMapUpgradeable for Bytes32ToAddressMapUpgradeable.Bytes32ToAddressMap;

    Bytes32ToAddressMapUpgradeable.Bytes32ToAddressMap private governorPresets;
    Bytes32ToAddressMapUpgradeable.Bytes32ToAddressMap private voteTokenPreset;

    // ========== Events ==========

    // ========== Modifiers ==========

    modifier isValidName(string calldata name) {
        require(bytes(name).length <= 32, "GovernorFactory: invalid name");
        _;
    }

    // ========== Gorvernance ==========

    function initialize() public initializer {
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function addGovernorPreset(
        string calldata _name,
        address _governorPreset
    ) external onlyOwner isValidName(_name) {
        uint8 nameLength = uint8(bytes(_name).length);
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        governorPresets.set(bytesName, _governorPreset, nameLength);
    }

    function addVoteTokenPreset(
        string calldata _name,
        address _voteTokenPreset
    ) external onlyOwner isValidName(_name) {
        uint8 nameLength = uint8(bytes(_name).length);
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        voteTokenPreset.set(bytesName, _voteTokenPreset, nameLength);
    }

    // ========== Public functions ==========

    // ========== View functions ==========
    function getAllGovernorPreset() external view returns (string[] memory) {
        bytes[] memory keysBytes = governorPresets.keysPacked();
        string[] memory keys = new string[](keysBytes.length);
        for (uint256 i = 0; i < keysBytes.length; i++) {
            keys[i] = string(keysBytes[i]);
        }
        return keys;
    }

    function getGovernorPresetAddress(
        string calldata _name
    ) external view isValidName(_name) returns (address) {
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        return governorPresets.get(bytesName);
    }

    function getVoteTokenPresetAddress(
        string calldata _name
    ) external view isValidName(_name) returns (address) {
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        return voteTokenPreset.get(bytesName);
    }

    // ========== Private functions ==========
}

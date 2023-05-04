import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import { Config } from "./config";
import { GovernorFactory, TimelockController } from "../typechain-types";

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    //Loading contracts' factory

    const GovernorFactory = await ethers.getContractFactory("GovernorFactory");

    const TimelockControllerFactory = await ethers.getContractFactory(
        "TimelockController",
    );

    // Deploy contracts
    console.log(
        "==================================================================",
    );
    console.log("DEPLOY CONTRACTS");
    console.log(
        "==================================================================",
    );

    console.log("ACCOUNT: " + admin);

    let timelock = await TimelockControllerFactory.deploy();
    await timelock.deployed();
    const governorFactory = await upgrades.deployProxy(
        GovernorFactory,
        [timelock.address],
        {
            kind: "uups",
        },
    );

    await governorFactory.deployed();
    console.log("governorFactory deployed at:", governorFactory.address);
    console.log(
        "governorFactory implementation deployed at,",
        await upgrades.erc1967.getImplementationAddress(
            governorFactory.address,
        ),
    );

    const contractAddress = {
        governor: governorFactory.address,
        implementation: await upgrades.erc1967.getImplementationAddress(
            governorFactory.address,
        ),
        timelock: timelock.address,
    };

    fs.writeFileSync("contracts.json", JSON.stringify(contractAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

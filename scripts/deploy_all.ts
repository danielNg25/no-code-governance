import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import { Config } from "./config";

import { Greeter__factory, Greeter } from "../typechain-types";

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    //Loading contracts' factory

    const Greeter: Greeter__factory = await ethers.getContractFactory(
        "Greeter",
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

    const greeter = await upgrades.deployProxy(Greeter, [], {
        kind: "uups",
    });

    console.log("Greeter deployed at:", greeter.address);
    console.log(
        "Greeter implementation deployed at,",
        await upgrades.erc1967.getImplementationAddress(greeter.address),
    );

    const contractAddress = {
        greeter: greeter.address,
        implementation: await upgrades.erc1967.getImplementationAddress(
            greeter.address,
        ),
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

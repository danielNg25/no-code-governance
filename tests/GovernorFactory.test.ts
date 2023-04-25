import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { GovernorFactory__factory, GovernorFactory } from "../typechain-types";
import * as fs from "fs";
describe("Greater", () => {
    let user: SignerWithAddress;
    let governorFactory: GovernorFactory;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        user = accounts[0];

        const GovernorFactory: GovernorFactory__factory =
            await ethers.getContractFactory("GovernorFactory");
        governorFactory = await GovernorFactory.deploy();

        await governorFactory.initialize();
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {});
    });

    describe("Set governor preset address", () => {
        it("Should set failed", async () => {
            await expect(
                governorFactory.addGovernorPreset(
                    "This is a very long preset name that exceed 32 bytes",
                    governorFactory.address,
                ),
            ).to.revertedWith("GovernorFactory: invalid name");
        });

        it("Should set successfully", async () => {
            await governorFactory.addGovernorPreset(
                "SimpeGovernor",
                governorFactory.address,
            );

            const allPreset = await governorFactory.getAllGovernorPreset();
            expect(allPreset.length).to.equal(1);
            console.log(allPreset[0]);
            expect(allPreset[0]).to.equal("SimpeGovernor");
            console.log(
                await governorFactory.getGovernorPresetAddress("SimpeGovernor"),
            );
        });
    });
});

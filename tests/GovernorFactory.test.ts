import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { GovernorFactory__factory, GovernorFactory } from "../typechain-types";
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
        it("Should deploy successfully", async () => {
            expect(await governorFactory.owner()).to.equal(user.address);
        });
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

        it("Should set governor preset successfully", async () => {
            await governorFactory.addGovernorPreset(
                "SimpeGovernor",
                governorFactory.address,
            );

            const allPreset = await governorFactory.getAllGovernorPresets();
            expect(allPreset.length).to.equal(1);
            console.log(allPreset);
            expect(allPreset[0]).to.equal("SimpeGovernor");
            console.log(
                await governorFactory.getGovernorPresetAddress("SimpeGovernor"),
            );
        });

        it("Should set vote token preset successfully", async () => {
            await governorFactory.addVoteTokenPreset(
                "SimpleVoteToken",
                governorFactory.address,
            );

            const allPreset = await governorFactory.getAllVoteTokenPresets();
            expect(allPreset.length).to.equal(1);
            console.log(allPreset);
            expect(allPreset[0]).to.equal("SimpleVoteToken");
            console.log(
                await governorFactory.getVoteTokenPresetAddress(
                    "SimpleVoteToken",
                ),
            );
        });
    });
});

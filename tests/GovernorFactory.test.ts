import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { GovernorFactory, TimelockController } from "../typechain-types";
describe("Greater", () => {
    let user: SignerWithAddress;
    let governorFactory: GovernorFactory;
    let timelock: TimelockController;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        user = accounts[0];

        const GovernorFactory = await ethers.getContractFactory(
            "GovernorFactory",
        );
        governorFactory = await GovernorFactory.deploy();

        const TimelockControllerFactory = await ethers.getContractFactory(
            "TimelockController",
        );
        timelock = await TimelockControllerFactory.deploy();

        await governorFactory.initialize(timelock.address);
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await governorFactory.owner()).to.equal(user.address);

            expect(await governorFactory.timelockController()).to.equal(
                timelock.address,
            );
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
                "SimpleGovernor",
                governorFactory.address,
            );

            const allPreset = await governorFactory.getAllGovernorPresets();
            expect(allPreset.length).to.equal(1);
            console.log(allPreset);
            expect(allPreset[0]).to.equal("SimpleGovernor");
            console.log(
                await governorFactory.getGovernorPresetAddress(
                    "SimpleGovernor",
                ),
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

    describe("Create governor", () => {
        beforeEach(async () => {
            await governorFactory.addGovernorPreset(
                "SimpleGovernor",
                governorFactory.address,
            );

            await governorFactory.addVoteTokenPreset(
                "SimpleVoteToken",
                governorFactory.address,
            );
        });

        it("Should create governor successfully", async () => {
            const blocknumber = await ethers.provider.getBlockNumber();
            await governorFactory.createGovernor(
                "SimpleGovernor",
                "SimpleVoteToken",
            );

            const governor = governorFactory.governors(0);
            const TimelockControllerFactory = await ethers.getContractFactory(
                "TimelockController",
            );
            const timelockClone = TimelockControllerFactory.attach(
                (await governor).timelock,
            );

            const hello = await timelockClone.hello();

            console.log(hello);
        });
    });
});

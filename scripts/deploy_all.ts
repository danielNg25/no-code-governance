import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
import {
    AccountBalanceQuery,
    AccountId,
    AccountInfoQuery,
    Client,
    ContractCallQuery,
    ContractCreateFlow,
    ContractCreateTransaction,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    FileCreateTransaction,
    Hbar,
    PrivateKey,
} from "@hashgraph/sdk";
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import * as template from "../artifacts/contracts/GovernorTemplates/StandardGovernor.sol/StandardGovernor.json";

async function main() {
    //Loading accounts
    let operatorId = AccountId.fromString(`${process.env.HEDERA_ACCOUNT_ID}`);
    let operatorKey = PrivateKey.fromString(
        `${process.env.HEDERA_PRIVATE_KEY}`,
    );

    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    // await logAccountInfo(operatorId, client);

    //Import the compiled contract from the HelloHedera.json file
    // const bytecode = template.bytecode;

    // const contractTx = new ContractCreateFlow()
    //     //Set the bytecode of Hedera contract
    //     .setBytecode(bytecode)
    //     //Set the gas to instantiate the contract
    //     .setGas(100000);
    // //Provide the constructor parameters for the contract
    // // .setConstructorParameters(
    // //     new ContractFunctionParameters().addString("Hello from Hedera!"),
    // // );

    // //Submit the transaction to the Hedera test network
    // const contractResponse = await contractTx.execute(client);

    // //Get the receipt of the file create transaction
    // const contractReceipt = await contractResponse.getReceipt(client);

    // //Get the smart contract ID
    // const newContractId = contractReceipt.contractId;
    // const newContractAddress = newContractId?.toSolidityAddress();

    // //Log the smart contract ID
    // console.log("The smart contract ID is " + newContractId);
    // console.log("The smart contract address is " + newContractAddress);

    // Calling contract function
    const contractExecTx = await new ContractExecuteTransaction()
        .setContractId("0.0.4616431")
        .setGas(1000000)
        .setFunction(
            "initialize",
            new ContractFunctionParameters()
                .addAddress("0x00000000000000000000000000000000004670ef")
                .addAddress("0x00000000000000000000000000000000004670ef")
                .addUint256(4)
                .addUint256(100)
                .addUint256(100)
                .addUint256(100)
                .addString("DCM"),
        );

    //Submit the transaction to a Hedera network and store the response
    const submitExecTx = await contractExecTx.execute(client);

    //Get the receipt of the transaction
    const receipt2 = await submitExecTx.getReceipt(client);

    //Confirm the transaction was executed successfully
    console.log("The transaction status is " + receipt2.status.toString());

    // Query the contract to check changes in state variable
    const contractQueryTx = new ContractCallQuery()
        .setContractId("0.0.4616431")
        .setGas(100000)
        .setFunction("name");
    const contractQuerySubmit = await contractQueryTx.execute(client);
    const contractQueryResult = contractQuerySubmit.getString(0);
    console.log(
        "🚀 ~ file: deploy_all.ts:67 ~ main ~ contractQueryResult:",
        contractQueryResult,
    );

    // const GovernorFactory = await ethers.getContractFactory("GovernorFactory");

    // const TimelockControllerFactory = await ethers.getContractFactory(
    //     "TimelockController",
    // );

    // // Deploy contracts
    // console.log(
    //     "==================================================================",
    // );
    // console.log("DEPLOY CONTRACTS");
    // console.log(
    //     "==================================================================",
    // );

    // console.log("ACCOUNT: " + admin);

    // const timelock = await TimelockControllerFactory.deploy();
    // await timelock.deployed();
    // const governorFactory = await upgrades.deployProxy(
    //     GovernorFactory,
    //     [timelock.address],
    //     {
    //         kind: "uups",
    //     },
    // );

    // await governorFactory.deployed();
    // console.log("governorFactory deployed at:", governorFactory.address);
    // console.log(
    //     "governorFactory implementation deployed at,",
    //     await upgrades.erc1967.getImplementationAddress(
    //         governorFactory.address,
    //     ),
    // );

    // const contractAddress = {
    //     governor: governorFactory.address,
    //     implementation: await upgrades.erc1967.getImplementationAddress(
    //         governorFactory.address,
    //     ),
    //     timelock: timelock.address,
    // };

    // fs.writeFileSync("contracts.json", JSON.stringify(contractAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const logAccountInfo = async (
    accountId: string | AccountId,
    client: Client,
) => {
    const info = await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(client);

    console.log(`The normal account ID: ${info.accountId}`);
    console.log(`Account Balance: ${info.balance}`);
};

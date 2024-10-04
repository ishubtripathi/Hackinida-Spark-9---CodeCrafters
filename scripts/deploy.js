const { ethers } = require("hardhat");

async function main() {
    // Get the contract to deploy
    const YourContract = await ethers.getContractFactory("UniWork");
    const yourContract = await YourContract.deploy(); // Pass constructor arguments if any

    await yourContract.deployed();

    console.log("Contract deployed to:", yourContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

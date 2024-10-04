const { Alchemy, Network } = require('alchemy-sdk');

// Replace with your Alchemy API key and appropriate network
const settings = {
    apiKey: "2oNNZaOMFBIZpWsRUM-IbjAYikEbkR-D",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

async function checkConnection() {
    try {
        // Fetch the latest block number
        const latestBlock = await alchemy.core.getBlockNumber();
        console.log(`Connected to Alchemy! Latest block number is: ${latestBlock}`);
    } catch (error) {
        console.error('Failed to connect to Alchemy:', error);
    }
}

checkConnection();

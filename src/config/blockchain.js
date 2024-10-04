const { Alchemy, Network } = require('alchemy-sdk');
const dotenv = require('dotenv');

dotenv.config();

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API key
  network: Network.ETH_MAINNET, // Replace with the network you're using
};

const alchemy = new Alchemy(settings);

module.exports = { alchemy };

const multer = require('multer');
const Work = require('../models/Work');
const { alchemy } = require('../config/blockchain');
const ethers = require('ethers');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage }).single('work');

// Function to upload work and mint NFT
exports.uploadWork = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: 'File upload failed' });

    const { ownerName } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    try {
      // Assuming you have a function to mint NFT, modify this as per your contract
      const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
      const mintTx = await alchemy.nft.mint(wallet.address, fileUrl);
      const receipt = await mintTx.wait();
      const tokenId = receipt.events[0].args.tokenId.toString();

      const work = new Work({ ownerName, fileUrl, nftTokenId: tokenId, nftMetadata: receipt });
      await work.save();

      return res.status(200).json({
        message: 'Work uploaded and NFT minted successfully',
        tokenId,
        fileUrl
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to mint NFT' });
    }
  });
};

// Function to get work by NFT token ID
exports.getWorkByTokenId = async (req, res) => {
  const { tokenId } = req.params;
  try {
    const work = await Work.findOne({ nftTokenId: tokenId });
    if (!work) return res.status(404).json({ error: 'Work not found' });

    return res.status(200).json(work);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch work' });
  }
};

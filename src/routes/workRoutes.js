const express = require('express');
const { uploadWork, getWorkByTokenId } = require('../controllers/workController');

const router = express.Router();

router.post('/upload', uploadWork);
router.get('/work/:tokenId', getWorkByTokenId);

module.exports = router;

const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    tokenId: { type: String, required: true },
    file: { type: Buffer, required: true },
    originalName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Work', workSchema);

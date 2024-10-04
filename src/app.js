const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path'); // Import path module

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Add a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve your HTML file here
});

// File Storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Model
const Work = mongoose.model('Work', new mongoose.Schema({
    ownerName: { type: String, required: true },
    tokenId: { type: String, required: true },
    file: { type: Buffer, required: true },
    originalName: { type: String, required: true }
}));

// Upload Endpoint
app.post('/api/upload', upload.single('work'), async (req, res) => {
    try {
        const { ownerName } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Here, you'd normally mint the NFT and get the tokenId
        const tokenId = `token_${Date.now()}`; // Temporary token ID for testing

        const newWork = new Work({
            ownerName,
            tokenId,
            file: file.buffer,
            originalName: file.originalname,
        });

        await newWork.save();
        res.status(201).json({ message: 'File uploaded successfully', tokenId }); // 201 Created status
    } catch (error) {
        console.error('Upload error:', error);  // Detailed error logging
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});

// Get Work by Token ID
app.get('/api/work/:tokenId', async (req, res) => {
    const { tokenId } = req.params;
    try {
        const work = await Work.findOne({ tokenId });

        if (work) {
            // Convert file buffer to base64 string for frontend display
            const fileBase64 = work.file.toString('base64');

            res.json({
                ownerName: work.ownerName,
                tokenId: work.tokenId,
                originalName: work.originalName,
                file: fileBase64, // Include the base64 string of the file
            });
        } else {
            res.status(404).json({ message: 'Work not found' });
        }
    } catch (error) {
        console.error('Get work error:', error);
        res.status(500).json({ message: 'Error retrieving work', error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Initialize Web3
let web3;

// MetaMask Wallet Integration
document.getElementById('connectWalletButton').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        try {
            // Request account access from MetaMask
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum); // Initialize web3 with MetaMask provider

            // Display connected account address and avatar
            const walletAddress = document.getElementById('walletAddress');
            walletAddress.textContent = `Connected Wallet Address: ${accounts[0]}`;
            walletAddress.style.display = 'block';

            // Set MetaMask avatar (basic identicon)
            const avatarElement = document.getElementById('metaMaskAvatar');
            avatarElement.src = `https://identicon-api.herokuapp.com/${accounts[0]}/250`; // Change to a proper avatar service if needed
            avatarElement.style.display = 'block'; // Show avatar when wallet is connected

            // Hide Connect Wallet Button and show Disconnect Wallet Button
            document.getElementById('connectWalletButton').style.display = 'none';
            document.getElementById('disconnectWalletButton').style.display = 'block';

            alert('Wallet connected: ' + accounts[0]);
        } catch (error) {
            console.error('User rejected the connection or other error:', error);
            alert('Could not connect to wallet. Make sure MetaMask is installed.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
    }
});

// Disconnect Wallet
document.getElementById('disconnectWalletButton').addEventListener('click', () => {
    // Clear wallet address and avatar
    document.getElementById('walletAddress').textContent = '';
    document.getElementById('metaMaskAvatar').src = '';
    document.getElementById('metaMaskAvatar').style.display = 'none'; // Hide avatar when wallet is disconnected

    // Show Connect Wallet Button and hide Disconnect Wallet Button
    document.getElementById('connectWalletButton').style.display = 'block';
    document.getElementById('disconnectWalletButton').style.display = 'none';

    alert('Wallet disconnected');
});

// Smart Contract details (replace with your contract address and ABI)
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
const contractABI = [/* Your contract ABI goes here */];

// File Upload with Progress Tracking and NFT Minting
document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target); // Create FormData object
    const progressBar = document.getElementById('progressBar');
    const tokenContainer = document.getElementById('tokenContainer');
    const tokenIdDisplay = document.getElementById('tokenId');
    const uploadProgress = document.getElementById('uploadProgress');

    // Reset progress bar and token container
    progressBar.style.width = '0%';
    tokenContainer.style.display = 'none';
    uploadProgress.style.display = 'block'; // Show the progress bar

    try {
        // Using XMLHttpRequest to track upload progress
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentage = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = `${percentage}%`;
            }
        };

        // On successful upload
        xhr.onload = async function() {
            uploadProgress.style.display = 'none'; // Hide progress bar
            const result = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {
                alert('File uploaded successfully!');
                
                // Mint NFT and associate it with the user's wallet
                const accounts = await web3.eth.getAccounts();
                const ownerAddress = accounts[0];

                // Call mint function of the contract
                const tokenId = await mintNFT(ownerAddress, result.fileHash);

                tokenIdDisplay.textContent = tokenId;
                tokenContainer.style.display = 'block'; // Show token container
            } else {
                alert('Upload failed: ' + result.message);
            }
        };

        // Open and send the request
        xhr.open('POST', 'YOUR_UPLOAD_ENDPOINT', true);
        xhr.send(formData);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file. Please try again.');
    }
});

// Function to mint NFT (replace with your actual minting logic)
async function mintNFT(ownerAddress, fileHash) {
    try {
        // Here you would call your smart contract's mint function
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        // Call the mint function (update 'mint' with your actual function name)
        const result = await contract.methods.mint(ownerAddress, fileHash).send({ from: ownerAddress });
        
        // Return the token ID from the event
        return result.events.Transfer.returnValues.tokenId; // Adjust based on your contract's event
    } catch (error) {
        console.error('Error minting NFT:', error);
        alert('An error occurred while minting the NFT. Please try again.');
    }
}

// Retrieve Uploaded Work
document.getElementById('retrieveButton').addEventListener('click', async () => {
    const tokenId = document.getElementById('tokenIdInput').value;

    // Logic to retrieve the uploaded work by token ID goes here

    // Example display of image (replace with your logic)
    document.getElementById('uploadedImage').src = `YOUR_IMAGE_URL/${tokenId}`; // Update with your logic
});

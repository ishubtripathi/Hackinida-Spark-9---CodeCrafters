// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UniWork is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;

    // Struct to store work information
    struct Work {
        uint256 tokenId;
        string ownerName;
        string tokenURI;
    }

    // Mapping from token ID to Work
    mapping(uint256 => Work) private _works;

    // Event to emit when a new work is created
    event WorkCreated(uint256 indexed tokenId, string ownerName, string tokenURI);

    constructor() ERC721("UniWork", "UWK") {}

    // Function to mint a new token
    function mintWork(string memory ownerName, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId);

        // Store the work information
        _works[tokenId] = Work({
            tokenId: tokenId,
            ownerName: ownerName,
            tokenURI: tokenURI
        });

        emit WorkCreated(tokenId, ownerName, tokenURI);
        _tokenIdCounter.increment();
    }

    // Function to get work information by token ID
    function getWork(uint256 tokenId) public view returns (string memory ownerName, string memory tokenURI) {
        Work memory work = _works[tokenId];
        return (work.ownerName, work.tokenURI);
    }

    // Override _baseURI to return base URI for the token
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://api.uniwork.com/metadata/";
    }

    // Function to set the token URI
    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        _works[tokenId].tokenURI = tokenURI;
    }
}

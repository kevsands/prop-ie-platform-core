// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PropertyToken
 * @dev ERC721 token for tokenizing real estate properties
 * Each token represents a fractional ownership of a property
 */
contract PropertyToken is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    struct Property {
        uint256 id;
        string propertyAddress;
        uint256 totalValue;
        uint256 totalShares;
        uint256 availableShares;
        address owner;
        bool verified;
        uint256 createdAt;
    }
    
    struct TokenMetadata {
        uint256 propertyId;
        uint256 shares;
        uint256 purchasePrice;
        uint256 purchaseDate;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    mapping(uint256 => mapping(address => uint256)) public propertyHoldings;
    
    uint256 public propertyCounter;
    
    event PropertyListed(uint256 indexed propertyId, address indexed owner, uint256 totalValue, uint256 totalShares);
    event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 tokenId);
    event PropertyVerified(uint256 indexed propertyId, bool verified);
    event DividendDistributed(uint256 indexed propertyId, uint256 amount);
    
    constructor() ERC721("Property Token", "PROP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev List a new property for tokenization
     */
    function listProperty(
        string memory propertyAddress,
        uint256 totalValue,
        uint256 totalShares
    ) public returns (uint256) {
        require(totalShares > 0, "Total shares must be greater than 0");
        require(totalValue > 0, "Total value must be greater than 0");
        
        propertyCounter++;
        
        properties[propertyCounter] = Property({
            id: propertyCounter,
            propertyAddress: propertyAddress,
            totalValue: totalValue,
            totalShares: totalShares,
            availableShares: totalShares,
            owner: msg.sender,
            verified: false,
            createdAt: block.timestamp
        });
        
        emit PropertyListed(propertyCounter, msg.sender, totalValue, totalShares);
        
        return propertyCounter;
    }
    
    /**
     * @dev Purchase shares of a property
     */
    function purchaseShares(uint256 propertyId, uint256 shares) public payable {
        Property storage property = properties[propertyId];
        
        require(property.id > 0, "Property does not exist");
        require(property.verified, "Property not verified");
        require(shares > 0, "Shares must be greater than 0");
        require(shares <= property.availableShares, "Not enough shares available");
        
        uint256 sharePrice = property.totalValue / property.totalShares;
        uint256 totalPrice = sharePrice * shares;
        
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Mint NFT token
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _safeMint(msg.sender, tokenId);
        
        // Store token metadata
        tokenMetadata[tokenId] = TokenMetadata({
            propertyId: propertyId,
            shares: shares,
            purchasePrice: totalPrice,
            purchaseDate: block.timestamp
        });
        
        // Update property and holdings
        property.availableShares -= shares;
        propertyHoldings[propertyId][msg.sender] += shares;
        
        // Transfer funds to property owner
        payable(property.owner).transfer(totalPrice);
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit SharesPurchased(propertyId, msg.sender, shares, tokenId);
    }
    
    /**
     * @dev Verify a property (admin only)
     */
    function verifyProperty(uint256 propertyId, bool verified) public onlyRole(ADMIN_ROLE) {
        Property storage property = properties[propertyId];
        require(property.id > 0, "Property does not exist");
        
        property.verified = verified;
        emit PropertyVerified(propertyId, verified);
    }
    
    /**
     * @dev Distribute dividends to property token holders
     */
    function distributeDividend(uint256 propertyId) public payable {
        Property storage property = properties[propertyId];
        require(property.id > 0, "Property does not exist");
        require(msg.value > 0, "Dividend amount must be greater than 0");
        
        // Calculate dividend per share
        uint256 soldShares = property.totalShares - property.availableShares;
        require(soldShares > 0, "No shares sold");
        
        uint256 dividendPerShare = msg.value / soldShares;
        
        // Distribute to all token holders of this property
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            if (_exists(i)) {
                TokenMetadata memory metadata = tokenMetadata[i];
                if (metadata.propertyId == propertyId) {
                    address holder = ownerOf(i);
                    uint256 dividend = dividendPerShare * metadata.shares;
                    payable(holder).transfer(dividend);
                }
            }
        }
        
        emit DividendDistributed(propertyId, msg.value);
    }
    
    /**
     * @dev Get property details
     */
    function getProperty(uint256 propertyId) public view returns (Property memory) {
        return properties[propertyId];
    }
    
    /**
     * @dev Get user's holdings for a property
     */
    function getUserHoldings(uint256 propertyId, address user) public view returns (uint256) {
        return propertyHoldings[propertyId][user];
    }
    
    // Required override functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal whenNotPaused override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
        
        // Update holdings on transfer
        if (from != address(0) && to != address(0)) {
            TokenMetadata memory metadata = tokenMetadata[tokenId];
            propertyHoldings[metadata.propertyId][from] -= metadata.shares;
            propertyHoldings[metadata.propertyId][to] += metadata.shares;
        }
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Admin functions
    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
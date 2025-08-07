// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

contract PetAdoptionNFT {
    using Sapphire for bytes32;
    
    struct Pet {
        uint256 tokenId;
        string name;
        string petType;
        string emoji;
        address owner;
        uint256 totalDonations;
        uint256 donationCount;
        bool isPrivate;
        bytes32 confidentialMetadata; // Encrypted sensitive data
    }
    
    struct ConfidentialDonation {
        bytes32 encryptedAmount;
        bytes32 encryptedDonor;
        uint256 timestamp;
        uint256 petId;
    }
    
    mapping(uint256 => Pet) public pets;
    mapping(uint256 => ConfidentialDonation[]) private confidentialDonations;
    mapping(address => uint256[]) public userPets;
    mapping(address => bool) public authorizedViewers;
    
    uint256 private nextTokenId = 1;
    
    event PetAdopted(uint256 indexed tokenId, address indexed owner, string name);
    event ConfidentialDonationMade(uint256 indexed petId, bytes32 encryptedAmount);
    event PetStatusUpdated(uint256 indexed petId, string newStatus);
    
    modifier onlyAuthorized(uint256 petId) {
        require(
            pets[petId].owner == msg.sender || 
            authorizedViewers[msg.sender],
            "Not authorized to view confidential data"
        );
        _;
    }
    
    function adoptPet(
        string memory name,
        string memory petType,
        string memory emoji,
        bool isPrivate,
        bytes memory sensitiveData
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        
        // Encrypt sensitive metadata using Sapphire
        bytes32 encryptedMetadata = bytes32(0);
        if (sensitiveData.length > 0) {
            encryptedMetadata = keccak256(sensitiveData).encrypt(
                keccak256(abi.encodePacked(msg.sender, tokenId))
            );
        }
        
        pets[tokenId] = Pet({
            tokenId: tokenId,
            name: name,
            petType: petType,
            emoji: emoji,
            owner: msg.sender,
            totalDonations: 0,
            donationCount: 0,
            isPrivate: isPrivate,
            confidentialMetadata: encryptedMetadata
        });
        
        userPets[msg.sender].push(tokenId);
        
        emit PetAdopted(tokenId, msg.sender, name);
        return tokenId;
    }
    
    function makeConfidentialDonation(uint256 petId) external payable {
        require(pets[petId].tokenId != 0, "Pet does not exist");
        
        // Encrypt donation amount and donor address
        bytes32 encryptedAmount = bytes32(msg.value).encrypt(
            keccak256(abi.encodePacked("donation", petId, block.timestamp))
        );
        
        bytes32 encryptedDonor = bytes32(uint256(uint160(msg.sender))).encrypt(
            keccak256(abi.encodePacked("donor", petId, block.timestamp))
        );
        
        confidentialDonations[petId].push(ConfidentialDonation({
            encryptedAmount: encryptedAmount,
            encryptedDonor: encryptedDonor,
            timestamp: block.timestamp,
            petId: petId
        }));
        
        // Update public counters only
        pets[petId].donationCount++;
        
        emit ConfidentialDonationMade(petId, encryptedAmount);
    }
    
    function getConfidentialDonations(uint256 petId) 
        external 
        view 
        onlyAuthorized(petId) 
        returns (ConfidentialDonation[] memory) 
    {
        return confidentialDonations[petId];
    }
    
    function getDecryptedMetadata(uint256 petId) 
        external 
        view 
        onlyAuthorized(petId) 
        returns (bytes32) 
    {
        Pet memory pet = pets[petId];
        if (pet.confidentialMetadata == bytes32(0)) {
            return bytes32(0);
        }
        
        return pet.confidentialMetadata.decrypt(
            keccak256(abi.encodePacked(pet.owner, petId))
        );
    }
    
    function togglePrivacy(uint256 petId) external {
        require(pets[petId].owner == msg.sender, "Not pet owner");
        pets[petId].isPrivate = !pets[petId].isPrivate;
    }
    
    function authorizeViewer(address viewer) external {
        authorizedViewers[viewer] = true;
    }
    
    function getUserPets(address user) external view returns (uint256[] memory) {
        return userPets[user];
    }
    
    function getPetPublicInfo(uint256 petId) external view returns (Pet memory) {
        Pet memory pet = pets[petId];
        if (pet.isPrivate && pet.owner != msg.sender && !authorizedViewers[msg.sender]) {
            // Return limited info for private pets
            pet.confidentialMetadata = bytes32(0);
        }
        return pet;
    }
}

# 🐾 TemanBulus - Malaysia's First TEE-Protected Virtual Pet Care

## 🇲🇾 Privacy-Preserving Virtual Pet Adoption with AI

TemanBulus integrates **Oasis Sapphire** (confidential EVM) and **ROFL** (confidential AI agents) to create Malaysia's first privacy-preserving virtual pet adoption platform.

## 🔒 Confidential Features

### Oasis Sapphire Integration
- **Anonymous Donations**: Donate to pets while hiding amounts and wallet addresses using TEE
- **Confidential Pet Metadata**: Store sensitive pet information (injuries, treatments) visible only to authorized viewers
- **Privacy Toggles**: Users control whether pet profiles and donations are public or private
- **Encrypted Storage**: All sensitive data encrypted using Sapphire's confidential precompiles

### ROFL AI Agent Integration
- **AI Pet Personalities**: Each adopted pet has a ROFL AI agent generating real-time status quotes
- **Dynamic Status Updates**: Pet status changes based on hunger level, last donation, and AI personality
- **Verified AI Responses**: Off-chain AI processing verified on-chain using `roflEnsureAuthorizedOrigin`
- **Personalized Interactions**: AI agents create unique personalities for each virtual pet

## 🏠 Interactive Pet Room
- **Pixel-style Room**: Pets walk around in room-wide patterns (rectangular, figure-8, diagonal)
- **Real-time AI Status**: Each pet displays AI-generated status messages
- **Instant Confidential Donations**: Click "Confidential Care" for anonymous donations
- **Privacy Indicators**: Visual indicators show which pets have private profiles

## 🛡️ Privacy Architecture

### Confidential Smart Contracts
```solidity
// Encrypted donation storage
struct ConfidentialDonation {
    bytes32 encryptedAmount;
    bytes32 encryptedDonor;
    uint256 timestamp;
}

// Privacy-controlled pet metadata
struct Pet {
    bool isPrivate;
    bytes32 confidentialMetadata; // TEE-encrypted sensitive data
}
```

### AI Agent Framework
```typescript
// ROFL service for confidential AI processing
class ROFLService {
  async getPetStatus(petPersonality: PetPersonality): Promise<string>
  async updatePetAfterDonation(petId: string, amount: number): Promise<string>
}
```

## 🚀 Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
# .env
VITE_SAPPHIRE_TESTNET_RPC=https://testnet.sapphire.oasis.dev
VITE_ROFL_AGENT_ENDPOINT=https://rofl-agent.oasis.dev
VITE_ROFL_APP_ID=temanbulus-pets
```

3. **Deploy Confidential Contracts**
```bash
# Deploy to Sapphire testnet
npx hardhat deploy --network sapphire-testnet
```

4. **Start Development Server**
```bash
npm run dev
```

## 🔧 Technical Implementation

### Confidential Donations
- Donation amounts encrypted using Sapphire's TEE
- Donor addresses hidden from public view
- Only authorized viewers can decrypt sensitive data
- Public stats show donation count, not personal details

### AI Pet Personalities
- ROFL agents generate contextual status messages
- Pet mood based on hunger level, last feeding time
- Real-time updates every 30 seconds
- Fallback to local generation if ROFL unavailable

### Privacy Controls
- Individual pet privacy toggles
- Profile-wide privacy settings
- Authorized viewer system for sensitive data
- Visual privacy indicators throughout UI

## 🇲🇾 Malaysia Innovation
- **First TEE-protected virtual care platform**
- **Confidential EVM + AI agent integration**
- **Privacy-preserving donation system**
- **Real-time AI pet interactions**

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Blockchain**: Oasis Sapphire (Confidential EVM)
- **AI Agents**: ROFL (Runtime OFfchain Logic)
- **Privacy**: Trusted Execution Environment (TEE)
- **Web3**: Wagmi, RainbowKit, Ethers.js

## 📱 Features
- 🔒 Anonymous donations with TEE encryption
- 🤖 AI-powered pet personalities via ROFL
- 🏠 Interactive pixel-art pet room
- 🛡️ Privacy toggles for pets and profiles
- 🇲🇾 Malaysia's first confidential virtual care
- ⚡ Real-time status updates
- 🎨 Glassmorphism design system
- 📱 Fully responsive interface

## 🔐 Security
- All sensitive data encrypted in TEE
- ROFL agent responses cryptographically verified
- Authorized viewer access control
- Privacy-first architecture design

---

**🇲🇾 Proudly Malaysia's First TEE-Protected Virtual Pet Care Platform**

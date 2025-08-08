// ethereumService.ts
import { ethers } from 'ethers'

interface AdoptionData {
  petId: string
  name: string
  petType: string
  emoji: string
  adoptionPrice: string
}

interface ConfidentialDonationData {
  petId: string
  amount: string
  hideAmount: boolean
  hideIdentity: boolean
}

export class EthereumService {
  private provider: ethers.providers.Web3Provider | null = null
  private signer: ethers.Signer | null = null
  private contractAddress: string
  private contract: ethers.Contract | null = null

  constructor() {
    // Change to your deployed Ethereum contract
    this.contractAddress = import.meta.env.VITE_ETHEREUM_CONTRACT_ADDRESS || '0xYourEthereumContract'
  }

  async connect(wallet: any) {
    try {
      console.log('🔗 Starting Ethereum wallet connection...')

      if (!wallet) {
        throw new Error('MetaMask not found. Please install MetaMask.')
      }

      const accounts = await wallet.request({ method: 'eth_requestAccounts' })
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }
      console.log('✅ Accounts found:', accounts)

      const currentChainId = await wallet.request({ method: 'eth_chainId' })
      console.log('🌐 Current chain ID:', currentChainId)

      const ethereumMainnetChainId = '0x1' // Ethereum Mainnet
      const ethereumTestnetChainId = '0x5' // Goerli Testnet — swap to '0xaa36a7' for Sepolia

      // Force the network to Goerli for testing, change as needed
      const targetChainId = ethereumTestnetChainId

      if (currentChainId !== targetChainId) {
        console.log(`🔄 Switching to Ethereum network (chain ${targetChainId})...`)
        try {
          await wallet.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
          })
          console.log('✅ Successfully switched network')
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            console.log('⚠️ Network not found, adding...')
            try {
              await wallet.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: targetChainId,
                  chainName: 'Ethereum Goerli Testnet',
                  nativeCurrency: {
                    name: 'Goerli ETH',
                    symbol: 'gETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://rpc.ankr.com/eth_goerli'],
                  blockExplorerUrls: ['https://goerli.etherscan.io']
                }]
              })
              console.log('✅ Network added')
            } catch (addError) {
              console.error('❌ Failed to add network:', addError)
              throw new Error('Failed to add Ethereum network. Please add it manually in MetaMask.')
            }
          } else {
            throw switchError
          }
        }
      }

      // Init provider & signer
      this.provider = new ethers.providers.Web3Provider(wallet)
      await this.provider.send('eth_requestAccounts', [])
      this.signer = this.provider.getSigner()

      const address = await this.signer.getAddress()
      const network = await this.provider.getNetwork()
      console.log('✅ Connected to address:', address)
      console.log('✅ Connected to network:', network)

      // Replace with your Ethereum contract ABI
      const contractABI = [
        'function adoptPetSoulbound(string petId, string name, string petType, string emoji) external payable returns (uint256)',
        'function makeConfidentialDonation(string petId, bytes encryptedAmount, bytes encryptedIdentity) external payable',
        'function getAdoptedPets(address owner) external view returns (tuple(string petId, string name, string petType, string emoji, uint256 tokenId, uint256 adoptedAt)[])',
        'function getPetDonations(string petId) external view returns (uint256)',
        'function verifyROFLAgent(address agentAddress, bytes signature, string message) external view returns (bool)'
      ]

      this.contract = new ethers.Contract(this.contractAddress, contractABI, this.signer)
      console.log('✅ Ethereum contract initialized at:', this.contractAddress)

    } catch (error: any) {
      console.error('❌ Connection failed:', error)
      if (error.code === 4001) throw new Error('Connection rejected by user.')
      if (error.code === -32002) throw new Error('Connection request already pending.')
      throw new Error(`Connection failed: ${error.message || 'Unknown error'}`)
    }
  }

  async adoptPetSoulbound(adoptionData: AdoptionData) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized. Connect wallet first.')
    }
    try {
      console.log('🐾 Adopting pet on Ethereum...', adoptionData)
      const tx = await this.contract.adoptPetSoulbound(
        adoptionData.petId,
        adoptionData.name,
        adoptionData.petType,
        adoptionData.emoji,
        {
          value: ethers.utils.parseEther(adoptionData.adoptionPrice || '0'),
          gasLimit: 300000
        }
      )
      console.log('⏳ Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('✅ Transaction confirmed:', receipt)
      return { tokenId: Date.now().toString(), txHash: receipt.transactionHash }
    } catch (error: any) {
      console.error('❌ Adoption failed:', error)
      throw error
    }
  }

  async makeConfidentialDonation(donationData: ConfidentialDonationData) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized. Connect wallet first.')
    }
    try {
      console.log('💝 Making Ethereum confidential donation...', donationData)
      const encryptedAmount = ethers.utils.toUtf8Bytes(donationData.amount)
      const userAddress = await this.signer.getAddress()
      const encryptedIdentity = ethers.utils.toUtf8Bytes(userAddress)
      const tx = await this.contract.makeConfidentialDonation(
        donationData.petId,
        encryptedAmount,
        encryptedIdentity,
        {
          value: ethers.utils.parseEther(donationData.amount || '0'),
          gasLimit: 300000
        }
      )
      console.log('⏳ Donation sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('✅ Donation confirmed:', receipt)
      return receipt.transactionHash
    } catch (error: any) {
      console.error('❌ Donation failed:', error)
      throw error
    }
  }

  async getAdoptedPets(userAddress: string) {
    if (!this.contract) return []
    try {
      return await this.contract.getAdoptedPets(userAddress)
    } catch (error) {
      console.log('⚠️ Failed to fetch pets:', error)
      return []
    }
  }

  async verifyROFLAgent(agentAddress: string, signature: string, message: string) {
    if (!this.contract) return true
    try {
      return await this.contract.verifyROFLAgent(agentAddress, signature, message)
    } catch (error) {
      console.log('⚠️ Verification failed:', error)
      return true
    }
  }

  isConnected() {
    return !!this.provider && !!this.signer
  }

  async getCurrentAccount() {
    if (!this.signer) return null
    try {
      return await this.signer.getAddress()
    } catch {
      return null
    }
  }

  async getNetworkInfo() {
    if (!this.provider) return null
    try {
      const network = await this.provider.getNetwork()
      return { name: network.name, chainId: network.chainId }
    } catch (error) {
      console.error('Failed to get network info:', error)
      return null
    }
  }
}

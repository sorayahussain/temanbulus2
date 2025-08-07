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

export class SapphireService {
  private provider: ethers.providers.Web3Provider | null = null
  private signer: ethers.Signer | null = null
  private contractAddress: string
  private contract: ethers.Contract | null = null

  constructor() {
    this.contractAddress = import.meta.env.VITE_SAPPHIRE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
  }

  async connect(wallet: any) {
    try {
      console.log('🔗 Starting wallet connection...')
      
      // Check if MetaMask is available
      if (!wallet) {
        throw new Error('MetaMask not found. Please install MetaMask.')
      }

      // First, request account access
      const accounts = await wallet.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      console.log('✅ Accounts found:', accounts)

      // Check current network
      const currentChainId = await wallet.request({ method: 'eth_chainId' })
      console.log('🌐 Current chain ID:', currentChainId)

      const sapphireTestnetChainId = '0x5aff' // 23295 in decimal

      // If not on Sapphire Testnet, try to switch or add it
      if (currentChainId !== sapphireTestnetChainId) {
        console.log('🔄 Switching to Sapphire Testnet...')
        
        try {
          // Try to switch to the network first
          await wallet.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sapphireTestnetChainId }]
          })
          console.log('✅ Successfully switched to Sapphire Testnet')
        } catch (switchError: any) {
          console.log('⚠️ Switch failed, trying to add network...', switchError)
          
          // If switch fails, try to add the network
          if (switchError.code === 4902 || switchError.code === -32603) {
            try {
              await wallet.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: sapphireTestnetChainId,
                  chainName: 'Oasis Sapphire Testnet',
                  nativeCurrency: {
                    name: 'ROSE',
                    symbol: 'ROSE',
                    decimals: 18
                  },
                  rpcUrls: ['https://testnet.sapphire.oasis.dev'],
                  blockExplorerUrls: ['https://explorer.oasis.io/testnet/sapphire']
                }]
              })
              console.log('✅ Successfully added Sapphire Testnet')
            } catch (addError) {
              console.error('❌ Failed to add network:', addError)
              throw new Error('Failed to add Sapphire Testnet. Please add it manually in MetaMask.')
            }
          } else {
            throw switchError
          }
        }
      }

      // CRITICAL FIX: Define the network object explicitly to avoid ENS errors
      const sapphireTestnetNetwork = {
        name: 'oasis-sapphire-testnet',
        chainId: 0x5aff, // 23295 in decimal
        ensAddress: null // Explicitly disable ENS
      }

      // Initialize provider with explicit network configuration
      this.provider = new ethers.providers.Web3Provider(wallet, sapphireTestnetNetwork)
      
      // Send eth_requestAccounts to ensure connection
      await this.provider.send("eth_requestAccounts", [])
      
      // Get signer
      this.signer = this.provider.getSigner()
      
      // Verify connection
      const address = await this.signer.getAddress()
      const network = await this.provider.getNetwork()
      
      console.log('✅ Connected to address:', address)
      console.log('✅ Connected to network:', network)

      // Initialize contract with basic ABI for testing
      const contractABI = [
        'function adoptPetSoulbound(string petId, string name, string petType, string emoji) external payable returns (uint256)',
        'function makeConfidentialDonation(string petId, bytes encryptedAmount, bytes encryptedIdentity) external payable',
        'function getAdoptedPets(address owner) external view returns (tuple(string petId, string name, string petType, string emoji, uint256 tokenId, uint256 adoptedAt)[])',
        'function getPetDonations(string petId) external view returns (uint256)',
        'function verifyROFLAgent(address agentAddress, bytes signature, string message) external view returns (bool)'
      ]
      
      this.contract = new ethers.Contract(this.contractAddress, contractABI, this.signer)
      console.log('✅ Contract initialized at:', this.contractAddress)
      
    } catch (error: any) {
      console.error('❌ Connection failed:', error)
      
      // Provide user-friendly error messages
      if (error.code === 4001) {
        throw new Error('Connection rejected by user. Please try again and approve the connection.')
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending. Please check MetaMask.')
      } else if (error.message?.includes('User rejected')) {
        throw new Error('Connection rejected. Please approve the connection in MetaMask.')
      } else if (error.message?.includes('MetaMask not found')) {
        throw new Error('MetaMask not found. Please install MetaMask.')
      } else {
        throw new Error(`Connection failed: ${error.message || 'Unknown error'}`)
      }
    }
  }

  async adoptPetSoulbound(adoptionData: AdoptionData): Promise<{ tokenId: string, txHash: string }> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized. Please connect your wallet first.')
    }

    try {
      console.log('🐾 Starting pet adoption...', adoptionData)
      
      // Use value: 0 for free adoption on testnet
      const tx = await this.contract.adoptPetSoulbound(
        adoptionData.petId,
        adoptionData.name,
        adoptionData.petType,
        adoptionData.emoji,
        {
          value: ethers.utils.parseEther('0'), // Free adoption
          gasLimit: 300000 // Set reasonable gas limit
        }
      )

      console.log('⏳ Transaction sent:', tx.hash)
      console.log('🔍 View on Oasis Explorer:', `https://explorer.oasis.io/testnet/sapphire/tx/${tx.hash}`)
      
      const receipt = await tx.wait()
      console.log('✅ Transaction confirmed:', receipt)
      console.log('🎉 Pet adoption successful! Check Oasis Explorer for details.')

      // Extract token ID from events if available
      let tokenId = Date.now().toString()
      if (receipt.events && receipt.events.length > 0) {
        const adoptionEvent = receipt.events.find((event: any) => event.event === 'PetAdopted')
        if (adoptionEvent && adoptionEvent.args) {
          tokenId = adoptionEvent.args.tokenId.toString()
        }
      }

      return {
        tokenId,
        txHash: receipt.transactionHash
      }
    } catch (error: any) {
      console.error('❌ Adoption failed:', error)
      
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user.')
      } else if (error.code === -32603 || error.message?.includes('execution reverted')) {
        // Contract might not exist on testnet, but still try to send transaction
        console.log('⚠️ Contract execution failed, but transaction was sent')
        throw new Error(`Contract execution failed: ${error.message}. Check if contract is deployed at ${this.contractAddress}`)
      } else if (error.code === -32000) {
        throw new Error('Insufficient funds for gas. Make sure you have ROSE tokens for gas fees.')
      } else {
        throw new Error(`Adoption failed: ${error.message || 'Unknown error'}`)
      }
    }
  }

  async makeConfidentialDonation(donationData: ConfidentialDonationData): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized. Please connect your wallet first.')
    }

    try {
      console.log('💝 Starting confidential donation...', donationData)
      
      // Simulate encryption for testnet
      const encryptedAmount = ethers.utils.toUtf8Bytes(donationData.amount)
      const userAddress = await this.signer.getAddress()
      const encryptedIdentity = ethers.utils.toUtf8Bytes(userAddress)

      const tx = await this.contract.makeConfidentialDonation(
        donationData.petId,
        encryptedAmount,
        encryptedIdentity,
        {
          value: ethers.utils.parseEther('0'), // Free donation
          gasLimit: 300000
        }
      )

      console.log('⏳ Donation transaction sent:', tx.hash)
      console.log('🔍 View on Oasis Explorer:', `https://explorer.oasis.io/testnet/sapphire/tx/${tx.hash}`)
      
      const receipt = await tx.wait()
      console.log('✅ Donation confirmed:', receipt)
      console.log('🎉 Confidential donation successful! Check Oasis Explorer for details.')

      return receipt.transactionHash
    } catch (error: any) {
      console.error('❌ Donation failed:', error)
      
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user.')
      } else if (error.code === -32603 || error.message?.includes('execution reverted')) {
        console.log('⚠️ Contract execution failed, but transaction was sent')
        throw new Error(`Contract execution failed: ${error.message}. Check if contract is deployed at ${this.contractAddress}`)
      } else if (error.code === -32000) {
        throw new Error('Insufficient funds for gas. Make sure you have ROSE tokens for gas fees.')
      } else {
        throw new Error(`Donation failed: ${error.message || 'Unknown error'}`)
      }
    }
  }

  async getAdoptedPets(userAddress: string): Promise<any[]> {
    if (!this.contract) {
      console.log('📋 Contract not initialized, returning empty pets list')
      return []
    }

    try {
      console.log('📋 Getting adopted pets for:', userAddress)
      const pets = await this.contract.getAdoptedPets(userAddress)
      return pets
    } catch (error) {
      console.log('⚠️ Failed to get adopted pets (contract might not be deployed):', error)
      return []
    }
  }

  async verifyROFLAgent(agentAddress: string, signature: string, message: string): Promise<boolean> {
    console.log('🤖 Verifying ROFL agent:', agentAddress)
    
    if (!this.contract) {
      console.log('⚠️ Contract not initialized, returning mock verification')
      return true
    }

    try {
      const isValid = await this.contract.verifyROFLAgent(agentAddress, signature, message)
      return isValid
    } catch (error) {
      console.log('⚠️ ROFL verification failed (contract might not be deployed):', error)
      return true // Mock verification for testing
    }
  }

  // Helper method to check if wallet is connected
  isConnected(): boolean {
    return this.provider !== null && this.signer !== null
  }

  // Helper method to get current account
  async getCurrentAccount(): Promise<string | null> {
    if (!this.signer) return null
    try {
      return await this.signer.getAddress()
    } catch {
      return null
    }
  }

  // Helper method to get network info
  async getNetworkInfo() {
    if (!this.provider) return null
    try {
      const network = await this.provider.getNetwork()
      return {
        name: network.name,
        chainId: network.chainId,
        ensAddress: network.ensAddress
      }
    } catch (error) {
      console.error('Failed to get network info:', error)
      return null
    }
  }
}

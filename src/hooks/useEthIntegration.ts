import { useState, useEffect } from 'react'
import { EthereumService } from '../services/ethereumService'
import { Pet, AdoptedPet } from '../types/Pet'

declare global {
  interface Window {
    ethereum?: any
  }
}

export const useEthereumIntegration = () => {
  const [ethereumService] = useState(() => new EthereumService(
    import.meta.env.VITE_ETHEREUM_CONTRACT_ADDRESS,
    import.meta.env.VITE_ETHEREUM_RPC_URL
  ))
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adoptedPets, setAdoptedPets] = useState<AdoptedPet[]>([])
  const [userAddress, setUserAddress] = useState<string>('')
  const [error, setError] = useState<string>('')

  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  const connectWallet = async () => {
    if (!isMetaMaskAvailable()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
    }

    setLoading(true)
    setError('')
    
    try {
      console.log('🚀 Connecting to Ethereum...')
      
      await ethereumService.connect(window.ethereum, {
        chainId: import.meta.env.VITE_ETHEREUM_CHAIN_ID,
        rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL
      })
      
      const address = await ethereumService.getCurrentAccount()
      if (!address) {
        throw new Error('Failed to get wallet address')
      }
      
      setUserAddress(address)
      setIsConnected(true)
      
      console.log('✅ Wallet connected successfully:', address)
      
      await loadAdoptedPets(address)
      
    } catch (error: any) {
      console.error('❌ Ethereum wallet connection failed:', error)
      setError(error.message || 'Failed to connect wallet')
      setIsConnected(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loadAdoptedPets = async (address: string) => {
    try {
      console.log('📋 Loading adopted pets for:', address)
      const pets = await ethereumService.getAdoptedPets(address)
      setAdoptedPets(pets)
    } catch (error) {
      console.error('Failed to load adopted pets:', error)
    }
  }

  const adoptPetVirtually = async (pet: Pet) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet first')
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('🐾 Adopting pet on Ethereum:', pet.name)
      
      const result = await ethereumService.adoptPetSoulbound({
        petId: pet.id,
        name: pet.name,
        petType: pet.type,
        emoji: pet.emoji || (pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : pet.type === 'rabbit' ? '🐰' : '🐦'),
        adoptionPrice: '0'
      })

      const newAdoptedPet: AdoptedPet = {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        emoji: pet.emoji || (pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : pet.type === 'rabbit' ? '🐰' : '🐦'),
        adoptedDate: new Date().toISOString(),
        nftTokenId: result.tokenId,
        mood: 'happy'
      }

      setAdoptedPets(prev => [...prev, newAdoptedPet])
      
      console.log('✅ Pet adopted successfully:', result)
      console.log(`🔍 Check Ethereum Explorer: ${import.meta.env.VITE_ETHEREUM_EXPLORER_URL}/tx/${result.txHash}`)
      
      return result
      
    } catch (error: any) {
      console.error('❌ Pet adoption on Ethereum failed:', error)
      setError(error.message || 'Failed to adopt pet')
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskAvailable() && ethereumService.isConnected()) {
        try {
          const address = await ethereumService.getCurrentAccount()
          if (address) {
            setUserAddress(address)
            setIsConnected(true)
            await loadAdoptedPets(address)
          }
        } catch {
          console.log('No existing Ethereum connection found')
        }
      }
    }
    checkConnection()
  }, [])

  return {
    ethereumService,
    isConnected,
    loading,
    adoptedPets,
    userAddress,
    error,
    isMetaMaskAvailable,
    connectWallet,
    adoptPetVirtually,
    loadAdoptedPets
  }
}

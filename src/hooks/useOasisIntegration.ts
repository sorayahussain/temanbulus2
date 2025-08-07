import { useState, useEffect } from 'react'
import { SapphireService } from '../services/sapphireService'
import { ROFLService } from '../services/roflService'
import { Pet, AdoptedPet } from '../types/Pet'

declare global {
  interface Window {
    ethereum?: any
  }
}

export const useOasisIntegration = () => {
  const [sapphireService] = useState(() => new SapphireService())
  const [roflService] = useState(() => new ROFLService())
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adoptedPets, setAdoptedPets] = useState<AdoptedPet[]>([])
  const [userAddress, setUserAddress] = useState<string>('')
  const [error, setError] = useState<string>('')

  // Check if MetaMask is available
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
      console.log('🚀 Connecting to MetaMask...')
      
      await sapphireService.connect(window.ethereum)
      
      const address = await sapphireService.getCurrentAccount()
      if (!address) {
        throw new Error('Failed to get wallet address')
      }
      
      setUserAddress(address)
      setIsConnected(true)
      
      console.log('✅ Wallet connected successfully:', address)
      
      // Get network info for debugging
      const networkInfo = await sapphireService.getNetworkInfo()
      console.log('🌐 Network info:', networkInfo)
      
      // Load adopted pets
      await loadAdoptedPets(address)
      
    } catch (error: any) {
      console.error('❌ Wallet connection failed:', error)
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
      const pets = await sapphireService.getAdoptedPets(address)
      setAdoptedPets(pets)
    } catch (error) {
      console.error('Failed to load adopted pets:', error)
      // Don't throw here, just log the error
    }
  }

  const adoptPetVirtually = async (pet: Pet) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet first')
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('🐾 Adopting pet:', pet.name)
      
      const result = await sapphireService.adoptPetSoulbound({
        petId: pet.id,
        name: pet.name,
        petType: pet.type,
        emoji: pet.emoji || (pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : pet.type === 'rabbit' ? '🐰' : '🐦'),
        adoptionPrice: '0' // Free on testnet
      })

      // Add to local state
      const newAdoptedPet: AdoptedPet = {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        emoji: pet.emoji || (pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : pet.type === 'rabbit' ? '🐰' : '🐦'),
        adoptedDate: new Date().toISOString(),
        nftTokenId: result.tokenId,
        roflAgentId: `rofl-${pet.id}-${Date.now()}`,
        mood: 'happy'
      }

      setAdoptedPets(prev => [...prev, newAdoptedPet])
      
      console.log('✅ Pet adopted successfully:', result)
      console.log('🔍 Transaction hash:', result.txHash)
      console.log('🎉 Check Oasis Explorer: https://explorer.oasis.io/testnet/sapphire/tx/' + result.txHash)
      
      return result
      
    } catch (error: any) {
      console.error('❌ Pet adoption failed:', error)
      setError(error.message || 'Failed to adopt pet')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const makeConfidentialDonation = async (petId: string, amount: number, hideAmount: boolean, hideIdentity: boolean) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet first')
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('💝 Making confidential donation:', { petId, amount, hideAmount, hideIdentity })
      
      const result = await sapphireService.makeConfidentialDonation({
        petId,
        amount: '0', // Free on testnet
        hideAmount,
        hideIdentity
      })

      // Update pet's donation info
      setAdoptedPets(prev => prev.map(pet => 
        pet.id === petId 
          ? { 
              ...pet, 
              lastDonationDate: new Date().toISOString(),
              totalDonations: (pet.totalDonations || 0) + amount
            }
          : pet
      ))

      console.log('✅ Donation successful:', result)
      console.log('🔍 Transaction hash:', result)
      console.log('🎉 Check Oasis Explorer: https://explorer.oasis.io/testnet/sapphire/tx/' + result)
      
      return result
      
    } catch (error: any) {
      console.error('❌ Donation failed:', error)
      setError(error.message || 'Failed to make donation')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updatePetMood = (petId: string, mood: string) => {
    setAdoptedPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, mood } : pet
    ))
  }

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskAvailable() && sapphireService.isConnected()) {
        try {
          const address = await sapphireService.getCurrentAccount()
          if (address) {
            setUserAddress(address)
            setIsConnected(true)
            await loadAdoptedPets(address)
          }
        } catch (error) {
          console.log('No existing connection found')
        }
      }
    }

    checkConnection()
  }, [])

  return {
    sapphireService,
    roflService,
    isConnected,
    loading,
    adoptedPets,
    userAddress,
    error,
    isMetaMaskAvailable,
    connectWallet,
    adoptPetVirtually,
    makeConfidentialDonation,
    updatePetMood,
    loadAdoptedPets
  }
}

// src/hooks/useEthereumIntegration.ts
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Pet, AdoptedPet } from '../types/Pet'

// You need to replace these with your Ethereum smart contract details
const ETH_CONTRACT_ADDRESS = '0xYourEthereumContractAddress'
const ETH_CONTRACT_ABI = [
  // Your ABI here
]

declare global {
  interface Window {
    ethereum?: any
  }
}

export const useEthereumIntegration = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
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
      console.log('🚀 Connecting to Ethereum via MetaMask...')
      const ethProvider = new ethers.BrowserProvider(window.ethereum)
      await ethProvider.send('eth_requestAccounts', [])
      const ethSigner = await ethProvider.getSigner()
      const address = await ethSigner.getAddress()

      setProvider(ethProvider)
      setSigner(ethSigner)
      setUserAddress(address)
      setIsConnected(true)

      const ethContract = new ethers.Contract(
        ETH_CONTRACT_ADDRESS,
        ETH_CONTRACT_ABI,
        ethSigner
      )
      setContract(ethContract)

      console.log('✅ Connected to Ethereum:', address)

      await loadAdoptedPets(address, ethContract)
    } catch (error: any) {
      console.error('❌ Ethereum wallet connection failed:', error)
      setError(error.message || 'Failed to connect wallet')
      setIsConnected(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loadAdoptedPets = async (address: string, instance: ethers.Contract | null = contract) => {
    if (!instance) return
    try {
      console.log('📋 Loading adopted pets from Ethereum for:', address)
      // TODO: Replace with your contract’s read method
      const pets: AdoptedPet[] = [] // mock or fetched data
      setAdoptedPets(pets)
    } catch (error) {
      console.error('Failed to load Ethereum adopted pets:', error)
    }
  }

  const adoptPetVirtually = async (pet: Pet) => {
    if (!isConnected || !contract) {
      throw new Error('Please connect your Ethereum wallet first')
    }

    setLoading(true)
    setError('')

    try {
      console.log('🐾 Adopting pet on Ethereum:', pet.name)
      // TODO: Replace with your contract's write method
      // Example:
      // const tx = await contract.adoptPet(pet.id, pet.name, { value: ethers.parseEther("0.01") })
      // await tx.wait()

      const newPet: AdoptedPet = {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        emoji: pet.emoji || '🐾',
        adoptedDate: new Date().toISOString(),
        nftTokenId: 'mock-token-id',
        roflAgentId: `rofl-${pet.id}-${Date.now()}`,
        mood: 'happy'
      }

      setAdoptedPets(prev => [...prev, newPet])
      console.log('✅ Pet adopted successfully on Ethereum')
    } catch (error: any) {
      console.error('❌ Ethereum pet adoption failed:', error)
      setError(error.message || 'Failed to adopt pet')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const makeDonation = async (petId: string, amountEth: string) => {
    if (!isConnected || !contract) {
      throw new Error('Please connect your Ethereum wallet first')
    }

    setLoading(true)
    setError('')

    try {
      console.log('💝 Making Ethereum donation:', { petId, amountEth })
      // TODO: Replace with your contract's donation method
      // const tx = await contract.donateToPet(petId, { value: ethers.parseEther(amountEth) })
      // await tx.wait()

      setAdoptedPets(prev =>
        prev.map(pet =>
          pet.id === petId
            ? {
                ...pet,
                lastDonationDate: new Date().toISOString(),
                totalDonations: (pet.totalDonations || 0) + parseFloat(amountEth)
              }
            : pet
        )
      )

      console.log('✅ Donation successful on Ethereum')
    } catch (error: any) {
      console.error('❌ Ethereum donation failed:', error)
      setError(error.message || 'Failed to make donation')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updatePetMood = (petId: string, mood: string) => {
    setAdoptedPets(prev =>
      prev.map(pet => (pet.id === petId ? { ...pet, mood } : pet))
    )
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskAvailable()) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await ethProvider.listAccounts()
          if (accounts.length > 0) {
            const ethSigner = await ethProvider.getSigner()
            const address = await ethSigner.getAddress()
            setProvider(ethProvider)
            setSigner(ethSigner)
            setUserAddress(address)
            setIsConnected(true)

            const ethContract = new ethers.Contract(
              ETH_CONTRACT_ADDRESS,
              ETH_CONTRACT_ABI,
              ethSigner
            )
            setContract(ethContract)
            await loadAdoptedPets(address, ethContract)
          }
        } catch {
          console.log('No existing Ethereum connection found')
        }
      }
    }

    checkConnection()
  }, [])

  return {
    provider,
    signer,
    contract,
    isConnected,
    loading,
    adoptedPets,
    userAddress,
    error,
    isMetaMaskAvailable,
    connectWallet,
    adoptPetVirtually,
    makeDonation,
    updatePetMood,
    loadAdoptedPets
  }
}

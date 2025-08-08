// App.tsx
import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PetGallery from './components/PetGallery'
import ProfileRoom from './components/ProfileRoom'
import { useOasisIntegration } from './hooks/useOasisIntegration'
import { useEthereumIntegration } from './hooks/useEthereumIntegration' // NEW
import { Pet } from './types/Pet'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'browse' | 'profile'>('home')
  const [selectedNetwork, setSelectedNetwork] = useState<'oasis' | 'ethereum'>('oasis') // NEW

  // Hooks for both networks
  const oasis = useOasisIntegration()
  const ethereum = useEthereumIntegration()

  // Pick active integration based on selected network
  const activeIntegration = selectedNetwork === 'oasis' ? oasis : ethereum

  const {
    isConnected,
    loading,
    adoptedPets,
    error,
    userAddress,
    isMetaMaskAvailable,
    connectWallet,
    adoptPetVirtually,
    makeConfidentialDonation,
    updatePetMood
  } = activeIntegration

  const handleWalletConnect = async () => {
    try {
      if (!isMetaMaskAvailable()) {
        alert('MetaMask is not installed. Please install MetaMask from https://metamask.io/')
        return
      }
      await connectWallet()
    } catch (error: any) {
      console.error('Wallet connection failed:', error)
      let errorMessage = 'Failed to connect wallet. Please try again.'
      if (error.message?.includes('rejected')) {
        errorMessage = 'Connection was rejected. Please approve the connection in MetaMask.'
      } else if (error.message?.includes('pending')) {
        errorMessage = 'Connection request is pending. Please check MetaMask.'
      } else if (error.message?.includes('install')) {
        errorMessage = error.message
      }
      alert(errorMessage)
    }
  }

  const handlePetAdopt = async (pet: Pet) => {
    try {
      const result = await adoptPetVirtually(pet)
      alert(`🎉 You adopted ${pet.name}! NFT Token ID: ${result.tokenId}\n\nTransaction: ${result.txHash}`)
      setCurrentPage('profile')
    } catch (error: any) {
      alert(`Adoption failed: ${error.message || 'Please try again.'}`)
    }
  }

  const handlePetDonate = async (petId: string, amount: number, hideAmount: boolean, hideIdentity: boolean) => {
    try {
      await makeConfidentialDonation(petId, amount, hideAmount, hideIdentity)
      alert(`🔒 Confidential donation successful!\nPrivacy: Amount hidden: ${hideAmount ? 'Yes' : 'No'}, Identity hidden: ${hideIdentity ? 'Yes' : 'No'}`)
    } catch (error: any) {
      alert(`Donation failed: ${error.message || 'Please try again.'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      <Navbar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isConnected={isConnected}
        onWalletConnect={handleWalletConnect}
        loading={loading}
        selectedNetwork={selectedNetwork} // NEW
        onNetworkChange={setSelectedNetwork} // NEW
      />
      
      <main className="relative">
        {currentPage === 'home' && <Hero onGetStarted={() => setCurrentPage('browse')} />}
        {currentPage === 'browse' && (
          <PetGallery 
            onPetAdopt={handlePetAdopt}
            onPetDonate={handlePetDonate}
          />
        )}
        {currentPage === 'profile' && (
          <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
            {isConnected && userAddress && (
              <ProfileRoom 
                adoptedPets={adoptedPets}
                onUpdatePetMood={updatePetMood}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App

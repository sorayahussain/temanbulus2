import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PetGallery from './components/PetGallery'
import ProfileRoom from './components/ProfileRoom'
import { useOasisIntegration } from './hooks/useOasisIntegration'
import { Pet } from './types/Pet'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'browse' | 'profile'>('home')
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
  } = useOasisIntegration()

  const handleWalletConnect = async () => {
    try {
      if (!isMetaMaskAvailable()) {
        alert('MetaMask is not installed. Please install MetaMask from https://metamask.io/')
        return
      }
      
      await connectWallet()
      
    } catch (error: any) {
      console.error('Wallet connection failed:', error)
      
      // Show user-friendly error messages
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
      console.log('🐾 Starting pet adoption for:', pet.name)
      const result = await adoptPetVirtually(pet)
      console.log('✅ Adoption successful:', result)
      
      alert(`🎉 You adopted ${pet.name}! NFT Token ID: ${result.tokenId}\n\nTransaction: ${result.txHash}`)
      
      // Switch to profile to see the new pet
      setCurrentPage('profile')
    } catch (error: any) {
      console.error('❌ Adoption failed:', error)
      alert(`Adoption failed: ${error.message || 'Please try again.'}`)
    }
  }

  const handlePetDonate = async (petId: string, amount: number, hideAmount: boolean, hideIdentity: boolean) => {
    try {
      console.log('💝 Starting donation for pet:', petId)
      await makeConfidentialDonation(petId, amount, hideAmount, hideIdentity)
      console.log('✅ Donation successful')
      
      alert(`🔒 Confidential donation successful!\n\nPrivacy settings:\n• Amount hidden: ${hideAmount ? 'Yes' : 'No'}\n• Identity hidden: ${hideIdentity ? 'Yes' : 'No'}`)
    } catch (error: any) {
      console.error('❌ Donation failed:', error)
      alert(`Donation failed: ${error.message || 'Please try again.'}`)
    }
  }

  // Debug logging
  console.log('🔍 App State:', {
    currentPage,
    isConnected,
    userAddress,
    adoptedPetsCount: adoptedPets.length,
    loading,
    error
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100">
      <Navbar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isConnected={isConnected}
        onWalletConnect={handleWalletConnect}
        loading={loading}
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
          <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Virtual Pet Room</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Watch your adopted pets with AI personalities powered by ROFL agents
                </p>
                
                {/* Connection Status */}
                {!isMetaMaskAvailable() && (
                  <div className="mt-6 p-4 bg-red-100/50 border border-red-300/50 rounded-xl max-w-md mx-auto">
                    <p className="text-red-700 font-medium">MetaMask Required</p>
                    <p className="text-red-600 text-sm mt-1">
                      Please install MetaMask to connect your wallet
                    </p>
                    <a 
                      href="https://metamask.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-red-600 underline hover:text-red-700"
                    >
                      Download MetaMask →
                    </a>
                  </div>
                )}
                
                {isMetaMaskAvailable() && !isConnected && (
                  <div className="mt-6">
                    <button
                      onClick={handleWalletConnect}
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Connecting...' : 'Connect Wallet to View Pets'}
                    </button>
                    
                    {error && (
                      <div className="mt-4 p-3 bg-red-100/50 border border-red-300/50 rounded-xl max-w-md mx-auto">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {isConnected && userAddress && (
                  <div className="mt-6 p-4 bg-green-100/50 border border-green-300/50 rounded-xl max-w-md mx-auto">
                    <p className="text-green-700 font-medium">✅ Connected to Sapphire Testnet</p>
                    <p className="text-green-600 text-sm mt-1">
                      Wallet: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
              
              {isConnected && (
                <ProfileRoom 
                  adoptedPets={adoptedPets}
                  onUpdatePetMood={updatePetMood}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

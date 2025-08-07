import React, { useState } from 'react'
import { Heart, Shield, Zap } from 'lucide-react'
import { Pet } from '../types/Pet'

interface AdoptionModalProps {
  pet: Pet
  onConfirm: (pet: Pet) => Promise<void>
  onClose: () => void
}

const AdoptionModal: React.FC<AdoptionModalProps> = ({ pet, onConfirm, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm(pet)
    } catch (error) {
      console.error('Adoption failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{pet.emoji}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Adopt {pet.name} Virtually
          </h2>
          <p className="text-gray-600">
            Mint a soulbound NFT and add {pet.name} to your Profile Room
          </p>
        </div>

        {/* FREE Testnet Mode Notice */}
        <div className="mb-6 p-4 bg-green-100/50 border border-green-300/50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-green-800">🧪 Sapphire Testnet - FREE Testing</span>
            <span className="text-2xl font-bold text-green-600">FREE</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>• Zero cost adoption (no TEST tokens needed)</p>
            <p>• Soulbound NFT (non-transferable)</p>
            <p>• AI-powered pet with ROFL agents</p>
            <p>• Appears in your Profile Room immediately</p>
            <p>• Chain ID: 0x5aff (23295)</p>
          </div>
        </div>

        {/* Blockchain Features */}
        <div className="mb-6 p-4 bg-purple-50/50 rounded-xl">
          <h4 className="font-medium text-purple-800 mb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>🇲🇾 Powered by Oasis Sapphire Testnet</span>
          </h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Soulbound NFT minted on Sapphire Testnet</li>
            <li>• AI personality powered by ROFL agents</li>
            <li>• Confidential pet data protection (TEE)</li>
            <li>• RPC: testnet.sapphire.oasis.dev</li>
            <li>• FREE testing environment</li>
          </ul>
        </div>

        {/* Pet Story Preview */}
        <div className="mb-6 p-4 bg-gray-50/50 rounded-xl">
          <h4 className="font-medium text-gray-800 mb-2">{pet.name}'s Story</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{pet.story}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>Adopt FREE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdoptionModal

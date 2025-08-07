import React, { useState } from 'react'
import { Shield, Heart, Lock, Eye, EyeOff } from 'lucide-react'

interface ConfidentialDonationProps {
  petId: string
  petName: string
  onDonate: (petId: string, amount: number, hideAmount: boolean, hideIdentity: boolean) => Promise<void>
  onClose: () => void
}

const ConfidentialDonation: React.FC<ConfidentialDonationProps> = ({
  petId,
  petName,
  onDonate,
  onClose
}) => {
  const [hideAmount, setHideAmount] = useState<boolean>(true)
  const [hideIdentity, setHideIdentity] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleDonate = async () => {
    setIsLoading(true)
    try {
      // Always donate 0 for testing
      await onDonate(petId, 0, hideAmount, hideIdentity)
    } catch (error) {
      console.error('Donation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🇲🇾 Confidential Donation
          </h2>
          <p className="text-gray-600">
            Help <span className="font-semibold">{petName}</span> with privacy-preserving donations
          </p>
        </div>

        {/* FREE Testnet Mode Notice */}
        <div className="mb-6 p-4 bg-green-100/50 border border-green-300/50 rounded-2xl">
          <h3 className="font-medium text-green-800 mb-2">🧪 Sapphire Testnet - FREE Testing</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>• Zero cost donations (no TEST tokens needed)</p>
            <p>• Chain ID: <strong>0x5aff</strong> (23295)</p>
            <p>• RPC: testnet.sapphire.oasis.dev</p>
            <p>• All privacy features fully functional</p>
          </div>
        </div>

        {/* Privacy Toggles */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-2xl space-y-4">
          <h3 className="font-medium text-gray-800 mb-3">Privacy Settings</h3>
          
          {/* Hide Amount Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">Hide Amount</span>
            </div>
            <button
              onClick={() => setHideAmount(!hideAmount)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${hideAmount 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : 'bg-gray-300'
                }
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  flex items-center justify-center
                  ${hideAmount ? 'translate-x-6' : 'translate-x-1'}
                `}
              >
                {hideAmount ? (
                  <EyeOff className="w-2 h-2 text-blue-500" />
                ) : (
                  <Eye className="w-2 h-2 text-gray-500" />
                )}
              </span>
            </button>
          </div>

          {/* Hide Identity Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">Hide Identity</span>
            </div>
            <button
              onClick={() => setHideIdentity(!hideIdentity)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${hideIdentity 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : 'bg-gray-300'
                }
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  flex items-center justify-center
                  ${hideIdentity ? 'translate-x-6' : 'translate-x-1'}
                `}
              >
                {hideIdentity ? (
                  <Lock className="w-2 h-2 text-blue-500" />
                ) : (
                  <Eye className="w-2 h-2 text-gray-500" />
                )}
              </span>
            </button>
          </div>

          <p className="text-xs text-gray-600">
            {(hideAmount || hideIdentity) ? (
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-blue-500" />
                <span>Protected by Sapphire Testnet TEE</span>
              </span>
            ) : (
              <span>Public donation - visible on testnet explorer</span>
            )}
          </p>
        </div>

        {/* Amount Display - Fixed at FREE for testing */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Donation Amount (Testnet Mode)
          </label>
          
          <div className="p-4 bg-green-50/50 rounded-xl border border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
              <p className="text-sm text-green-700">Zero cost testnet testing - no tokens needed</p>
            </div>
          </div>
        </div>

        {/* Confidential Features Info */}
        <div className="mb-6 p-3 bg-purple-50/50 rounded-xl">
          <h4 className="font-medium text-purple-800 mb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>🇲🇾 TEE-Protected Donations on Testnet</span>
          </h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Donation metadata encrypted in Trusted Execution Environment</li>
            <li>• Privacy preferences stored confidentially on Sapphire Testnet</li>
            <li>• Powered by Oasis Sapphire precompiles</li>
            <li>• Full confidential computing features available for testing</li>
          </ul>
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
            onClick={handleDonate}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4" />
                <span>
                  Donate FREE
                  {(hideAmount || hideIdentity) ? ' 🔒' : ''}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfidentialDonation

import React from 'react'
import { Heart, Shield, Zap, Wallet } from 'lucide-react'

interface NavbarProps {
  currentPage: 'home' | 'browse' | 'profile'
  onPageChange: (page: 'home' | 'browse' | 'profile') => void
  isConnected: boolean
  onWalletConnect: () => void
  loading: boolean
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onPageChange, 
  isConnected, 
  onWalletConnect, 
  loading 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                TemanBulus
              </h1>
              <p className="text-xs text-gray-600">🇲🇾 Malaysia's First Virtual Care</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onPageChange('home')}
              className={`px-4 py-2 rounded-xl transition-all ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onPageChange('browse')}
              className={`px-4 py-2 rounded-xl transition-all ${
                currentPage === 'browse'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Browse Pets
            </button>
            <button
              onClick={() => onPageChange('profile')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                currentPage === 'profile'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>My Pets</span>
            </button>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Oasis Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Powered by Oasis</span>
            </div>

            {/* Wallet Button */}
            <button
              onClick={onWalletConnect}
              disabled={loading}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all
                ${isConnected
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {loading ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

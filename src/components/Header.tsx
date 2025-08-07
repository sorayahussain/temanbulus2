import React from 'react'
import { Heart, User, Home, Grid3X3 } from 'lucide-react'

interface HeaderProps {
  currentPage: string
  setCurrentPage: (page: 'landing' | 'gallery' | 'detail' | 'profile') => void
  user: any
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, user }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TemanBulus</h1>
                <p className="text-sm text-gray-600">Virtual Pet Adoption</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage('landing')}
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === 'landing'
                    ? 'bg-white/20 text-gray-800 shadow-lg'
                    : 'text-gray-600 hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setCurrentPage('gallery')}
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === 'gallery'
                    ? 'bg-white/20 text-gray-800 shadow-lg'
                    : 'text-gray-600 hover:bg-white/10'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Browse Pets</span>
              </button>
              <button
                onClick={() => setCurrentPage('profile')}
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                  currentPage === 'profile'
                    ? 'bg-white/20 text-gray-800 shadow-lg'
                    : 'text-gray-600 hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-600">${user.totalDonations} donated</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

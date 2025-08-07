import React from 'react'
import { Heart, Sparkles, Shield, Users } from 'lucide-react'

interface LandingPageProps {
  onBrowsePets: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onBrowsePets }) => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-gray-700 font-medium">Adopt a Pet Now!</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Save Lives Through
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> Virtual Care</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join our Gen Z community in virtually adopting and caring for stray cats and injured pets. 
            Every NFT donation creates real-world impact while building your digital pet family.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onBrowsePets}
              className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <Heart className="w-6 h-6 group-hover:animate-pulse" />
              <span>Browse Pets</span>
            </button>
            
            <button className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Floating Pet Characters */}
        <div className="relative h-96 overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-purple-100/20"></div>
          
          {/* Animated pet characters would go here - using placeholder divs */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl animate-bounce delay-100 flex items-center justify-center">
            <span className="text-2xl">🐱</span>
          </div>
          <div className="absolute top-32 right-32 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl animate-bounce delay-300 flex items-center justify-center">
            <span className="text-3xl">🐶</span>
          </div>
          <div className="absolute bottom-24 left-1/3 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl animate-bounce delay-500 flex items-center justify-center">
            <span className="text-2xl">🐰</span>
          </div>
          <div className="absolute bottom-32 right-20 w-18 h-18 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl animate-bounce delay-700 flex items-center justify-center">
            <span className="text-2xl">🐦</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">NFT Adoption</h3>
            <p className="text-gray-600 leading-relaxed">
              Adopt pets through blockchain-backed NFTs. Your digital certificate represents real-world impact and creates lasting bonds.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">
              Choose to keep your donations private with Oasis Sapphire's confidential smart contracts. Your generosity, your choice.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Community Driven</h3>
            <p className="text-gray-600 leading-relaxed">
              Join a vibrant community of pet lovers. Earn badges, showcase your adopted pets, and make lasting friendships.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

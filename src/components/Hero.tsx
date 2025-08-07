import React from 'react'
import { Heart, Sparkles, Shield, Users, ArrowRight } from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-gray-700 font-medium">🇲🇾 Malaysia's First Virtual Pet Care Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Save Lives Through
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"> Virtual Care</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join our Gen Z community in virtually adopting and caring for stray cats and injured pets. 
            Every soulbound NFT adoption creates real-world impact while building your digital pet family with AI personalities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <Heart className="w-6 h-6 group-hover:animate-pulse" />
              <span>Browse Pets</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center space-x-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 font-medium">Powered by Oasis Sapphire & ROFL</span>
            </div>
          </div>
        </div>

        {/* Floating Pet Characters */}
        <div className="relative h-96 overflow-hidden rounded-3xl backdrop-blur-xl bg-white/5 border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 to-purple-100/20"></div>
          
          {/* Animated pet characters */}
          <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl animate-bounce delay-100 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐱</span>
          </div>
          <div className="absolute top-32 right-32 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl animate-bounce delay-300 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🐶</span>
          </div>
          <div className="absolute bottom-24 left-1/3 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl animate-bounce delay-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐰</span>
          </div>
          <div className="absolute bottom-32 right-20 w-18 h-18 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl animate-bounce delay-700 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐦</span>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-10 animate-pulse">
            💖
          </div>
          <div className="absolute top-16 left-1/2 text-2xl opacity-20 animate-bounce delay-200">✨</div>
          <div className="absolute bottom-16 right-1/4 text-2xl opacity-20 animate-bounce delay-600">🌟</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">TemanBulus</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of pet care with cutting-edge blockchain technology and AI companions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Soulbound NFT Adoption</h3>
            <p className="text-gray-600 leading-relaxed">
              Adopt pets through blockchain-backed soulbound NFTs. Your non-transferable digital certificate represents real-world impact and creates lasting bonds with AI-powered personalities.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-sm text-purple-600">
              <Shield className="w-4 h-4" />
              <span>Powered by Oasis Sapphire</span>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🇲🇾 Privacy-First Donations</h3>
            <p className="text-gray-600 leading-relaxed">
              Malaysia's first TEE-protected confidential donations. Choose to keep your donations private with Oasis Sapphire's confidential smart contracts. Your generosity, your choice.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600">
              <Shield className="w-4 h-4" />
              <span>Confidential Computing</span>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Pet Companions</h3>
            <p className="text-gray-600 leading-relaxed">
              Each adopted pet comes with a unique AI personality powered by ROFL agents. Watch them walk around your virtual room with dynamic moods and interactive responses.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
              <Sparkles className="w-4 h-4" />
              <span>ROFL AI Agents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <div className="text-gray-600">Pets Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1,200+</div>
              <div className="text-gray-600">Virtual Adopters</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">RM50K+</div>
              <div className="text-gray-600">Donations Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Privacy Protected</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero

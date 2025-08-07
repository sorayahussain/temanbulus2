import React, { useState } from 'react'
import { ArrowLeft, Heart, MapPin, Clock, Shield, Users, Award, MessageCircle } from 'lucide-react'
import { Pet } from '../types/Pet'

interface PetDetailProps {
  pet: Pet
  onAdopt: (pet: Pet) => void
  onBack: () => void
}

const PetDetail: React.FC<PetDetailProps> = ({ pet, onAdopt, onBack }) => {
  const [donationAmount, setDonationAmount] = useState(50)
  const [isPrivate, setIsPrivate] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'from-red-400 to-red-600'
      case 'recovering': return 'from-yellow-400 to-orange-500'
      case 'healthy': return 'from-green-400 to-emerald-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  const handleDonate = () => {
    // Simulate donation process
    onAdopt(pet)
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-gray-700 hover:bg-white/20 transition-all duration-200 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Gallery</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Pet Image and Info */}
          <div>
            <div className="relative rounded-3xl overflow-hidden mb-6">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-6 left-6">
                <div className={`px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getHealthStatusColor(pet.healthStatus)}`}>
                  {pet.healthStatus}
                </div>
              </div>
            </div>

            {/* Pet Basic Info */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{pet.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-5 h-5" />
                      <span>{pet.age}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-5 h-5" />
                      <span>{pet.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-6xl">
                  {pet.type === 'cat' ? '🐱' : pet.type === 'dog' ? '🐶' : pet.type === 'rabbit' ? '🐰' : '🐦'}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Condition</h3>
                <p className="text-gray-700 bg-white/10 rounded-xl p-4">{pet.condition}</p>
              </div>

              {/* Personality */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Personality</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.personality.map((trait, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-pink-400/20 to-purple-500/20 text-gray-700 rounded-xl font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl px-3 py-2">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700 font-medium">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Adoption Panel */}
          <div>
            {/* Pet Story */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{pet.name}'s Story</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{pet.story}</p>
              
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${pet.currentDonations} raised</span>
                  <span>${pet.donationGoal} goal</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(pet.currentDonations, pet.donationGoal)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{pet.adopters} adopters</span>
                </div>
                <span>{Math.round(getProgressPercentage(pet.currentDonations, pet.donationGoal))}% funded</span>
              </div>
            </div>

            {/* Donation Panel */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Raise {pet.name} 🐾</h3>
              
              {/* Donation Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Donation Amount (USDC)</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`py-3 rounded-xl font-medium transition-all duration-200 ${
                        donationAmount === amount
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'bg-white/10 text-gray-700 hover:bg-white/20'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Custom amount"
                />
              </div>

              {/* Privacy Option */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Keep donation private (Oasis Sapphire)</span>
                  </div>
                </label>
              </div>

              {/* Adopt Button */}
              <button
                onClick={handleDonate}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Heart className="w-6 h-6" />
                <span>Adopt {pet.name} for ${donationAmount}</span>
              </button>
            </div>

            {/* Chat with Pet */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-200"
              >
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700 font-medium">Chat with {pet.name}</span>
              </button>
              
              {showChat && (
                <div className="mt-6 space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-gray-700 italic">"{pet.name} just had surgery! Thank you for your support! 🩺"</p>
                    <span className="text-xs text-gray-500 mt-2 block">- {pet.name}'s NFA Agent</span>
                  </div>
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-2xl p-4">
                    <p className="text-gray-700">Recovery is going well! I'm feeling much better and can't wait to play again! 🎾</p>
                    <span className="text-xs text-gray-500 mt-2 block">- {pet.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetDetail

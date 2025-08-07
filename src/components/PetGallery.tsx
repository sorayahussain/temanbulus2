import React, { useState } from 'react'
import { Heart, MapPin, Clock, Filter, Shield } from 'lucide-react'
import { Pet } from '../types/Pet'
import AdoptionModal from './AdoptionModal'
import ConfidentialDonation from './ConfidentialDonation'

interface PetGalleryProps {
  onPetAdopt: (pet: Pet) => Promise<void>
  onPetDonate: (petId: string, amount: number, hideAmount: boolean, hideIdentity: boolean) => Promise<void>
}

const PetGallery: React.FC<PetGalleryProps> = ({ onPetAdopt, onPetDonate }) => {
  const [filter, setFilter] = useState<'all' | 'cat' | 'dog' | 'rabbit' | 'bird'>('all')
  const [showAdoptionModal, setShowAdoptionModal] = useState<Pet | null>(null)
  const [showDonationModal, setShowDonationModal] = useState<Pet | null>(null)

  const pets: Pet[] = [
    {
      id: '1',
      name: 'Snowy',
      type: 'cat',
      age: '2 years',
      condition: 'Broken leg - recovering well',
      personality: ['Gentle', 'Playful', 'Loves cuddles'],
      story: 'Found injured on a busy street, Snowy has shown incredible resilience. Despite her broken leg, she purrs constantly and loves gentle pets. She dreams of a warm home where she can safely play and recover.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      donationGoal: 0,
      currentDonations: 0,
      adopters: 12,
      badges: ['Survivor', 'Gentle Soul'],
      healthStatus: 'recovering',
      location: 'Jakarta Shelter',
      adoptionPrice: 0,
      emoji: '🐱'
    },
    {
      id: '2',
      name: 'Milo',
      type: 'dog',
      age: '1 year',
      condition: 'Malnourished - gaining weight',
      personality: ['Energetic', 'Loyal', 'Loves treats'],
      story: 'Milo was found as a tiny puppy, severely malnourished. Thanks to dedicated care, he\'s growing stronger every day. His tail never stops wagging, and he brings joy to everyone at the shelter.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      donationGoal: 0,
      currentDonations: 0,
      adopters: 18,
      badges: ['Fighter', 'Joy Bringer'],
      healthStatus: 'recovering',
      location: 'Bandung Rescue',
      adoptionPrice: 0,
      emoji: '🐶'
    },
    {
      id: '3',
      name: 'Luna',
      type: 'cat',
      age: '3 years',
      condition: 'Eye infection - treated successfully',
      personality: ['Independent', 'Curious', 'Night owl'],
      story: 'Luna arrived with a severe eye infection that threatened her sight. After weeks of treatment, she\'s made a full recovery. She\'s incredibly smart and loves exploring every corner of her space.',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      donationGoal: 0,
      currentDonations: 0,
      adopters: 8,
      badges: ['Survivor', 'Explorer'],
      healthStatus: 'healthy',
      location: 'Surabaya Care',
      adoptionPrice: 0,
      emoji: '🐱'
    },
    {
      id: '4',
      name: 'Buddy',
      type: 'dog',
      age: '4 years',
      condition: 'Heartworm treatment completed',
      personality: ['Calm', 'Protective', 'Loves children'],
      story: 'Buddy overcame a serious heartworm infection with determination and excellent veterinary care. He\'s now healthy and ready to be someone\'s loyal companion and protector.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      donationGoal: 0,
      currentDonations: 0,
      adopters: 15,
      badges: ['Warrior', 'Guardian'],
      healthStatus: 'healthy',
      location: 'Yogya Sanctuary',
      adoptionPrice: 0,
      emoji: '🐶'
    },
    {
      id: '5',
      name: 'Coco',
      type: 'rabbit',
      age: '1.5 years',
      condition: 'Dental surgery recovery',
      personality: ['Gentle', 'Quiet', 'Loves vegetables'],
      story: 'Coco needed emergency dental surgery due to overgrown teeth. She\'s recovering beautifully and has learned to trust humans again. Her favorite treats are fresh carrots and leafy greens.',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      donationGoal: 0,
      currentDonations: 0,
      adopters: 6,
      badges: ['Brave Heart', 'Veggie Lover'],
      healthStatus: 'recovering',
      location: 'Bali Rescue',
      adoptionPrice: 0,
      emoji: '🐰'
    },
    {
      id: '6',
      name: 'Tweety',
      type: 'bird',
      age: '6 months',
      condition: 'Wing injury - learning to fly again',
      personality: ['Cheerful', 'Vocal', 'Social'],
      story: 'Tweety was found with a damaged wing after a storm. With physical therapy and lots of encouragement, she\'s learning to fly again. Her cheerful chirping brightens everyone\'s day.',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      donationGoal: 0,
      currentDonations: 0,
      adopters: 4,
      badges: ['Songbird', 'Resilient'],
      healthStatus: 'recovering',
      location: 'Medan Aviary',
      adoptionPrice: 0,
      emoji: '🐦'
    }
  ]

  const filteredPets = filter === 'all' ? pets : pets.filter(pet => pet.type === filter)

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'from-red-400 to-red-600'
      case 'recovering': return 'from-yellow-400 to-orange-500'
      case 'healthy': return 'from-green-400 to-emerald-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const handleAdopt = (pet: Pet) => {
    setShowAdoptionModal(pet)
  }

  const handleDonate = (pet: Pet) => {
    setShowDonationModal(pet)
  }

  const handleConfirmAdoption = async (pet: Pet) => {
    await onPetAdopt(pet)
    setShowAdoptionModal(null)
  }

  const handleConfirmDonation = async (petId: string, amount: number, hideAmount: boolean, hideIdentity: boolean) => {
    await onPetDonate(petId, amount, hideAmount, hideIdentity)
    setShowDonationModal(null)
  }

  return (
    <>
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Your Perfect <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Companion</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every pet has a unique story and deserves a loving home. Adopt virtually or donate confidentially.
            </p>
            
            {/* Testnet Mode Indicator */}
            <div className="inline-flex items-center space-x-2 backdrop-blur-xl bg-blue-100/50 border border-blue-300/50 rounded-full px-4 py-2 mt-4">
              <span className="text-blue-700 font-medium text-sm">🧪 Sapphire Testnet: FREE testing with 0 cost transactions</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filter by type:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'cat', 'dog', 'rabbit', 'bird'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 capitalize ${
                      filter === type
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pet Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 hover:scale-105 transition-all duration-300"
              >
                {/* Pet Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getHealthStatusColor(pet.healthStatus)}`}>
                      {pet.healthStatus}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="backdrop-blur-xl bg-white/20 rounded-full p-2">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {/* FREE Badge */}
                  <div className="absolute bottom-4 right-4">
                    <div className="backdrop-blur-xl bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-bold">
                      FREE
                    </div>
                  </div>
                </div>

                {/* Pet Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
                    <span className="text-2xl">{pet.emoji}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{pet.age}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{pet.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{pet.condition}</p>

                  {/* Personality Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pet.personality.slice(0, 2).map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Zero Cost Notice */}
                  <div className="mb-6 p-3 bg-green-100/50 border border-green-300/50 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">FREE</div>
                      <p className="text-xs text-green-700">Zero cost testnet adoption</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Adopt Virtually Button - FREE */}
                    <button
                      onClick={() => handleAdopt(pet)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>{pet.emoji}</span>
                      <span>Adopt FREE - Testnet</span>
                    </button>

                    {/* Donate Confidentially Button - FREE */}
                    <button
                      onClick={() => handleDonate(pet)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>🇲🇾 Donate FREE - Testnet</span>
                    </button>
                  </div>

                  {/* Adopters */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-sm text-gray-600">{pet.adopters} adopters</span>
                    <div className="flex space-x-1">
                      {pet.badges.slice(0, 2).map((badge, index) => (
                        <span key={index} className="text-xs">🏆</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adoption Modal */}
      {showAdoptionModal && (
        <AdoptionModal
          pet={showAdoptionModal}
          onConfirm={handleConfirmAdoption}
          onClose={() => setShowAdoptionModal(null)}
        />
      )}

      {/* Confidential Donation Modal */}
      {showDonationModal && (
        <ConfidentialDonation
          petId={showDonationModal.id}
          petName={showDonationModal.name}
          onDonate={handleConfirmDonation}
          onClose={() => setShowDonationModal(null)}
        />
      )}
    </>
  )
}

export default PetGallery

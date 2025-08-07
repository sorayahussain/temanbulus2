import React, { useState, useEffect } from 'react'
import { Heart, Shield, Lock, Zap } from 'lucide-react'
import { AdoptedPet } from '../types/Pet'
import { ROFLService } from '../services/roflService'

interface ProfileRoomProps {
  adoptedPets: AdoptedPet[]
  onUpdatePetMood?: (petId: string, mood: string) => void
}

const ProfileRoom: React.FC<ProfileRoomProps> = ({ adoptedPets, onUpdatePetMood }) => {
  const [roflService] = useState(() => new ROFLService())
  const [petMoods, setPetMoods] = useState<Record<string, string>>({})
  const [moodUpdateTime, setMoodUpdateTime] = useState<Record<string, number>>({})

  // Update pet moods using ROFL AI agents
  useEffect(() => {
    const updatePetMoods = async () => {
      const moodUpdates: Record<string, string> = {}
      const timeUpdates: Record<string, number> = {}
      const now = Date.now()
      
      for (const pet of adoptedPets) {
        try {
          // Check if mood needs refresh (24 hours)
          const lastUpdate = moodUpdateTime[pet.id] || 0
          const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60)
          
          if (hoursSinceUpdate >= 24 || !petMoods[pet.id]) {
            const personality = {
              id: pet.id,
              name: pet.name,
              type: pet.type,
              lastDonationDate: pet.lastDonationDate,
              totalDonations: pet.totalDonations
            }
            
            const aiMood = await roflService.getPetMood(personality)
            moodUpdates[pet.id] = aiMood
            timeUpdates[pet.id] = now
            
            // Notify parent component
            if (onUpdatePetMood) {
              onUpdatePetMood(pet.id, aiMood)
            }
          } else {
            // Keep existing mood
            moodUpdates[pet.id] = petMoods[pet.id]
          }
        } catch (error) {
          console.error(`Failed to get AI mood for pet ${pet.id}:`, error)
          moodUpdates[pet.id] = roflService.getMoodUnavailable()
        }
      }
      
      setPetMoods(prev => ({ ...prev, ...moodUpdates }))
      setMoodUpdateTime(prev => ({ ...prev, ...timeUpdates }))
    }

    if (adoptedPets.length > 0) {
      updatePetMoods()
    }
  }, [adoptedPets, roflService, onUpdatePetMood])

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-sky-200/30 to-green-200/30 rounded-2xl overflow-hidden border-4 border-pink-300/50 shadow-xl">
      {/* Room Background Elements */}
      <div className="absolute inset-0 pixel-room-bg"></div>
      
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-100/40 to-transparent"></div>
      
      {/* Room Decorations */}
      <div className="absolute top-4 left-4 text-2xl opacity-60">🪟</div>
      <div className="absolute top-4 right-4 text-2xl opacity-60">🌱</div>
      <div className="absolute bottom-6 left-6 text-3xl opacity-50">🏠</div>
      <div className="absolute bottom-6 right-6 text-2xl opacity-50">🎾</div>
      <div className="absolute top-1/3 left-1/4 text-xl opacity-40">🧸</div>
      <div className="absolute top-1/2 right-1/3 text-xl opacity-40">🍽️</div>
      <div className="absolute bottom-1/3 left-1/3 text-lg opacity-30">🛏️</div>
      
      {/* ROFL Agent Indicator */}
      <div className="absolute top-4 right-1/2 transform translate-x-1/2">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-300/30">
          <div className="flex items-center space-x-2 text-xs">
            <Zap className="w-3 h-3 text-purple-600" />
            <span className="text-purple-700 font-medium">🇲🇾 ROFL AI Agents Active</span>
          </div>
        </div>
      </div>
      
      {/* Walking Adopted Pets with AI Moods */}
      {adoptedPets.map((pet, index) => (
        <WalkingAdoptedPet 
          key={pet.id} 
          pet={pet} 
          index={index} 
          aiMood={petMoods[pet.id] || "Loading mood... 🤔"}
        />
      ))}
      
      {/* Empty State */}
      {adoptedPets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-lg font-medium">Your virtual pet room is ready!</p>
            <p className="text-sm">Adopt pets from the Browse Pets page to see them here</p>
            <p className="text-xs text-purple-600 mt-2">🤖 Powered by ROFL AI agents</p>
          </div>
        </div>
      )}
    </div>
  )
}

const WalkingAdoptedPet: React.FC<{ 
  pet: AdoptedPet
  index: number
  aiMood: string
}> = ({ pet, index, aiMood }) => {
  // Room-wide walking patterns for adopted pets
  const walkingPatterns = [
    { path: 'rectangularWalk1', duration: '25s' },
    { path: 'figure8Walk', duration: '30s' },
    { path: 'diagonalWalk', duration: '28s' },
    { path: 'circularWalk', duration: '22s' }
  ]
  
  const pattern = walkingPatterns[index % walkingPatterns.length]
  
  // Check if pet is happy (donated today)
  const isHappy = aiMood.includes('purrfect') || 
                  aiMood.includes('Thanks') || 
                  aiMood.includes('grateful') ||
                  aiMood.includes('best') ||
                  aiMood.includes('amazing') ||
                  aiMood.includes('happy')

  return (
    <div className="absolute">
      <div
        className={`walking-pet-room ${pattern.path}`}
        style={{
          '--duration': pattern.duration,
          animationDelay: `${index * 4}s`
        } as React.CSSProperties}
      >
        <div className="pet-sprite-room">
          <div className="text-4xl mb-2 transition-all duration-500 hover:scale-110 relative">
            {pet.emoji}
            {/* Soulbound NFT Indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Lock className="w-2 h-2 text-white" />
            </div>
            {/* Happy indicator */}
            {isHappy && (
              <div className="absolute -top-2 -left-2 text-lg animate-bounce">✨</div>
            )}
          </div>
          
          {/* AI-Generated Mood Message */}
          <div className="status-message-room bg-white/95 backdrop-blur-sm text-xs px-3 py-2 rounded-lg shadow-lg border border-white/30 min-w-max text-center relative max-w-[200px]">
            <div className="font-semibold text-gray-800 flex items-center space-x-1">
              <span>{pet.name}</span>
              <Lock className="w-3 h-3 text-purple-500" title="Soulbound NFT" />
              {pet.roflAgentId && <Zap className="w-3 h-3 text-yellow-500" title="ROFL Agent" />}
            </div>
            <div className="text-gray-600 mt-1 text-left leading-relaxed">
              {aiMood}
            </div>
            
            {/* NFT Token ID */}
            {pet.nftTokenId && (
              <div className="mt-1 text-xs text-purple-600">
                NFT #{pet.nftTokenId}
              </div>
            )}
            
            {/* Adoption Date */}
            <div className="mt-1 text-xs text-gray-500">
              Adopted {new Date(pet.adoptedDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Walking shadow */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black/10 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

export default ProfileRoom

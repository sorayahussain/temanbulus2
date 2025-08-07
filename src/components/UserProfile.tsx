import React, { useState, useEffect } from 'react'
import { Award, Heart, TrendingUp, Star, MapPin, Sparkles, Shield, Lock, Eye } from 'lucide-react'
import ProfileRoom from './ProfileRoom'
import PrivacyToggle from './PrivacyToggle'
import { SapphireService } from '../services/sapphireService'
import { ROFLService } from '../services/roflService'

interface UserProfileProps {
  user: {
    name: string
    adoptedPets: any[]
    badges: string[]
    totalDonations: number
  }
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [adoptedPets, setAdoptedPets] = useState([
    {
      id: '1',
      name: 'Snowy',
      type: 'cat' as const,
      emoji: '🐱',
      status: 'I\'m getting hungry 😿 It\'s been 4 hours since my last meal!',
      adoptedDate: '2024-01-15',
      nftTokenId: '001',
      isHungry: true,
      isPrivate: true,
      lastFed: Date.now() - (4 * 60 * 60 * 1000), // 4 hours ago
      hungerLevel: 7,
      mood: 'hungry' as const
    },
    {
      id: '2',
      name: 'Rex',
      type: 'dog' as const,
      emoji: '🐶',
      status: 'Thanks for the delicious meal! 🍗 I\'m so happy!',
      adoptedDate: '2024-02-03',
      nftTokenId: '002',
      isHungry: false,
      isPrivate: false,
      lastFed: Date.now() - (30 * 60 * 1000), // 30 minutes ago
      hungerLevel: 2,
      mood: 'happy' as const
    },
    {
      id: '3',
      name: 'Luna',
      type: 'rabbit' as const,
      emoji: '🐰',
      status: 'Missing you... 💔 Could use some company',
      adoptedDate: '2024-02-10',
      nftTokenId: '003',
      isHungry: true,
      isPrivate: true,
      lastFed: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
      hungerLevel: 8,
      mood: 'lonely' as const
    }
  ])

  const [totalDonated, setTotalDonated] = useState(user.totalDonations)
  const [confidentialDonations, setConfidentialDonations] = useState(0)
  const [sapphireService] = useState(() => new SapphireService())
  const [roflService] = useState(() => new ROFLService())
  const [profilePrivacy, setProfilePrivacy] = useState(false)

  const handleConfidentialDonate = async (petId: string, amount: number, isAnonymous: boolean = true) => {
    try {
      if (isAnonymous) {
        // Use Sapphire for confidential donation
        await sapphireService.makeConfidentialDonation(parseInt(petId), amount.toString())
        setConfidentialDonations(prev => prev + 1)
      } else {
        // Regular public donation
        setTotalDonated(prev => prev + amount)
      }

      // Update pet status using ROFL AI agent
      const thankYouMessage = await roflService.updatePetAfterDonation(petId, amount)
      
      setAdoptedPets(prev => prev.map(pet => {
        if (pet.id === petId) {
          return {
            ...pet,
            status: thankYouMessage,
            isHungry: false,
            lastFed: Date.now(),
            hungerLevel: 1,
            mood: 'happy' as const
          }
        }
        return pet
      }))

      // Reset pet status after some time (simulate getting hungry again)
      setTimeout(() => {
        setAdoptedPets(prev => prev.map(pet => {
          if (pet.id === petId) {
            return {
              ...pet,
              status: 'Getting hungry again 😿',
              isHungry: true,
              hungerLevel: 6,
              mood: 'hungry' as const
            }
          }
          return pet
        }))
      }, 45000) // Reset after 45 seconds for demo

    } catch (error) {
      console.error('Donation failed:', error)
      alert('Donation failed. Please try again.')
    }
  }

  const togglePetPrivacy = async (petId: string) => {
    try {
      await sapphireService.togglePetPrivacy(parseInt(petId))
      
      setAdoptedPets(prev => prev.map(pet => {
        if (pet.id === petId) {
          return { ...pet, isPrivate: !pet.isPrivate }
        }
        return pet
      }))
    } catch (error) {
      console.error('Failed to toggle privacy:', error)
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header with Privacy Controls */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center relative">
              <span className="text-5xl text-white font-bold">{user.name.charAt(0)}</span>
              {profilePrivacy && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-600 bg-red-100/50 px-3 py-1 rounded-full">
                  🇲🇾 Malaysia's First TEE-Protected Virtual Care
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-xl text-gray-600 mb-4">Confidential Pet Guardian & NFT Collector</p>
              
              {/* Privacy Toggle */}
              <div className="mb-4">
                <PrivacyToggle
                  isPrivate={profilePrivacy}
                  onToggle={() => setProfilePrivacy(!profilePrivacy)}
                  label="Profile Privacy"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{adoptedPets.length}</div>
                  <div className="text-sm text-gray-600">Virtual Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {profilePrivacy ? '🔒' : `RM${totalDonated}`}
                  </div>
                  <div className="text-sm text-gray-600">Public Care</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{confidentialDonations}</div>
                  <div className="text-sm text-gray-600">Private Care</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{user.badges.length}</div>
                  <div className="text-sm text-gray-600">Care Badges</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Virtual Pet Room with AI & Privacy */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <Sparkles className="w-7 h-7 text-purple-500" />
                <span>My Confidential Pet Room</span>
                <div className="text-sm bg-gradient-to-r from-purple-100/50 to-pink-100/50 text-purple-700 px-3 py-1 rounded-full font-medium flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>🇲🇾 TEE + AI First!</span>
                </div>
              </h2>
              
              {/* AI-Powered Pet Room with Confidential Donations */}
              <ProfileRoom pets={adoptedPets} onDonate={handleConfidentialDonate} />
              
              {/* Pet Collection List with Privacy Controls */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span>My Confidential NFT Pet Collection</span>
                </h3>
                
                {adoptedPets.map((pet) => (
                  <div key={pet.id} className="flex items-center space-x-4 bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center relative">
                      <span className="text-3xl">{pet.emoji}</span>
                      {pet.isPrivate && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <Lock className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{pet.name}</h3>
                        <span className="text-xs bg-purple-100/50 text-purple-700 px-2 py-1 rounded-full">
                          NFT #{pet.nftTokenId}
                        </span>
                        {pet.isHungry && (
                          <span className="text-xs bg-red-100/50 text-red-700 px-2 py-1 rounded-full animate-pulse">
                            Needs Care
                          </span>
                        )}
                        {pet.isPrivate && (
                          <span className="text-xs bg-purple-100/50 text-purple-700 px-2 py-1 rounded-full flex items-center space-x-1">
                            <Shield className="w-2 h-2" />
                            <span>Private</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Virtual care since {new Date(pet.adoptedDate).toLocaleDateString()}</p>
                      <p className="text-sm text-blue-600 font-medium italic">"{pet.status}"</p>
                      
                      {/* Privacy Toggle for Individual Pet */}
                      <div className="mt-2">
                        <button
                          onClick={() => togglePetPrivacy(pet.id)}
                          className="text-xs text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                        >
                          {pet.isPrivate ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{pet.isPrivate ? 'Make Public' : 'Make Private'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {pet.emoji}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy & Care Achievements */}
          <div className="space-y-8">
            {/* Malaysia TEE Pioneer Badge */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-100/20 to-pink-100/20 border border-purple-200/30 rounded-3xl p-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🇲🇾</div>
                <h3 className="font-bold text-gray-800 mb-2">TEE Pioneer</h3>
                <p className="text-sm text-gray-600">First confidential virtual care platform in Malaysia</p>
                <div className="mt-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Oasis Sapphire + ROFL</span>
                </div>
              </div>
            </div>

            {/* Confidential Care Stats */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-500" />
                <span>Privacy Stats</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confidential Donations</span>
                  <span className="font-bold text-purple-600">{confidentialDonations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Private Pets</span>
                  <span className="font-bold text-purple-600">
                    {adoptedPets.filter(p => p.isPrivate).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">TEE Transactions</span>
                  <span className="font-bold text-green-600">{confidentialDonations + 3}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">AI Status Updates</span>
                  <span className="font-bold text-blue-600">Real-time</span>
                </div>
              </div>
            </div>

            {/* Care Badges */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-500" />
                <span>Care Achievements</span>
              </h3>
              
              <div className="space-y-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{badge}</h4>
                      <p className="text-xs text-gray-600">Confidential care milestone</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Confidential Activity */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent TEE Activity</h3>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-purple-500" />
                  <span className="font-medium">Anonymous donation to Luna 🔒</span>
                  <span>- 2 hours ago</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <Lock className="w-3 h-3 text-purple-500" />
                  <span className="font-medium">Made Snowy's profile private</span>
                  <span>- 4 hours ago</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span className="font-medium">AI status update for Rex</span>
                  <span>- 6 hours ago</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <Award className="w-3 h-3 text-yellow-500" />
                  <span className="font-medium">Earned "TEE Pioneer" badge</span>
                  <span>- 1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

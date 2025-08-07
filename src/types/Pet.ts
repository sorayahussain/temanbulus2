export interface Pet {
  id: string
  name: string
  type: 'cat' | 'dog' | 'rabbit' | 'bird'
  age: string
  condition: string
  personality: string[]
  story: string
  image: string
  donationGoal: number
  currentDonations: number
  adopters: number
  badges: string[]
  healthStatus: 'critical' | 'recovering' | 'healthy'
  location: string
  adoptionPrice?: number
  emoji?: string
}

export interface AdoptedPet {
  id: string
  name: string
  type: 'cat' | 'dog' | 'rabbit' | 'bird'
  emoji: string
  adoptedDate: string
  nftTokenId?: string
  lastDonationDate?: string
  totalDonations?: number
  mood?: string
  roflAgentId?: string
}

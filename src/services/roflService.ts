interface PetPersonality {
  id: string
  name: string
  type: string
  lastDonationDate?: string
  totalDonations?: number
}

interface ROFLAgentResponse {
  petId: string
  mood: string
  message: string
  timestamp: number
  signature: string
  agentAddress: string
}

export class ROFLService {
  private endpoint: string
  private appId: string
  
  constructor() {
    this.endpoint = import.meta.env.VITE_ROFL_AGENT_ENDPOINT || 'https://rofl-agent.oasis.io'
    this.appId = import.meta.env.VITE_ROFL_APP_ID || 'temanbulus-nfa'
  }
  
  async getPetMood(petPersonality: PetPersonality): Promise<string> {
    try {
      // For testing, use simplified local mood generation
      return this.generateSimplifiedMood(petPersonality)
      
    } catch (error) {
      console.warn('ROFL service unavailable, using local generation:', error)
      return this.generateSimplifiedMood(petPersonality)
    }
  }
  
  private async callROFLAgent(request: any): Promise<ROFLAgentResponse> {
    // Use proxy server for ROFL agent calls
    const proxyResponse = await fetch('undefined', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PROXY_SERVER_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        url: `${this.endpoint}/mood?petId=${request.params.petId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-ROFL-Origin': window.location.origin,
          'X-ROFL-App-ID': this.appId
        },
        body: {}
      })
    })
    
    if (!proxyResponse.ok) {
      throw new Error('ROFL agent request failed')
    }
    
    return await proxyResponse.json()
  }
  
  private async verifyAgentResponse(response: ROFLAgentResponse): Promise<boolean> {
    try {
      // In production, verify using roflEnsureAuthorizedOrigin on-chain
      // For now, implement basic signature verification
      if (!response.signature || !response.agentAddress) {
        return false
      }
      
      // This would call the Sapphire contract to verify the ROFL agent
      // const sapphireService = new SapphireService()
      // return await sapphireService.verifyROFLAgent(
      //   response.agentAddress,
      //   response.signature,
      //   response.message
      // )
      
      return true // Simplified for demo
    } catch (error) {
      console.error('ROFL response verification failed:', error)
      return false
    }
  }
  
  // Simplified mood generation for better UX testing
  private generateSimplifiedMood(pet: PetPersonality): string {
    const now = new Date()
    const lastDonation = pet.lastDonationDate ? new Date(pet.lastDonationDate) : null
    const daysSinceLastDonation = lastDonation 
      ? Math.floor((now.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24))
      : 999
    
    // Simplified mood logic - only two states
    if (daysSinceLastDonation === 0) {
      // Donated today - always show this happy quote
      return "Feeling purrfect! 🐾"
    } else {
      // Default state - always show this hungry quote
      return "I'm hungry 😿"
    }
  }
  
  // Fallback when ROFL agent is unavailable
  getMoodUnavailable(): string {
    return "I'm hungry 😿" // Default to hungry state
  }
}

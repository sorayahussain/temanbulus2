import React from 'react'
import { Shield, Eye, Lock } from 'lucide-react'

interface PrivacyToggleProps {
  isPrivate: boolean
  onToggle: () => void
  label: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const PrivacyToggle: React.FC<PrivacyToggleProps> = ({ 
  isPrivate, 
  onToggle, 
  label, 
  size = 'md',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  }

  const dotSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className="flex items-center space-x-3">
      {showIcon && (
        <div className={`${isPrivate ? 'text-purple-600' : 'text-gray-400'} transition-colors`}>
          {isPrivate ? (
            <Shield className={iconSizeClasses[size]} />
          ) : (
            <Eye className={iconSizeClasses[size]} />
          )}
        </div>
      )}
      
      <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
        {label}
      </span>
      
      <button
        onClick={onToggle}
        className={`
          ${sizeClasses[size]} 
          relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          ${isPrivate 
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25' 
            : 'bg-gray-300 hover:bg-gray-400'
          }
        `}
        role="switch"
        aria-checked={isPrivate}
        aria-label={`Toggle ${label.toLowerCase()}`}
      >
        <span
          className={`
            ${dotSizeClasses[size]}
            inline-block rounded-full bg-white shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center
            ${isPrivate ? 'translate-x-6' : 'translate-x-1'}
          `}
        >
          {isPrivate ? (
            <Lock className="w-2 h-2 text-purple-600" />
          ) : (
            <Eye className="w-2 h-2 text-gray-400" />
          )}
        </span>
      </button>
      
      <span className={`${textSizeClasses[size]} text-gray-500`}>
        {isPrivate ? 'Private' : 'Public'}
      </span>
    </div>
  )
}

export default PrivacyToggle

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  isProducer: boolean
  checkProducerStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  isProducer: false,
  checkProducerStatus: async () => false
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isProducer, setIsProducer] = useState(false)

  const checkProducerStatus = async () => {
    try {
      const token = localStorage.getItem('jwt')
      if (!token) return false

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) return false
      
      const userData = await response.json()
      setIsProducer(!!userData.isProducer)
      return !!userData.isProducer
    } catch (error) {
      console.error('Failed to check producer status:', error)
      return false
    }
  }

  useEffect(() => {
    checkProducerStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ isProducer, checkProducerStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { User } from '../types/user'

interface AuthContextValue {
  user: User | null
  token: string | null
  setAuth: (nextUser: User, nextToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(() => {
    const rawUser = localStorage.getItem('user')
    return rawUser ? (JSON.parse(rawUser) as User) : null
  })

  const setAuth = (nextUser: User, nextToken: string) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('user', JSON.stringify(nextUser))
    localStorage.setItem('token', nextToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value = useMemo(
    () => ({
      user,
      token,
      setAuth,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

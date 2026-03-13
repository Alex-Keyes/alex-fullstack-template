import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User, AuthResponse, AuthError, UserAttributes, UserResponse } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  hasSupabaseConfig: boolean
  signUp: (email: string, password: string, metadata?: object) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<UserResponse>
  updateUser: (attributes: UserAttributes) => Promise<UserResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const hasSupabaseConfig = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(err => {
      console.error('Supabase auth initialization error:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email: string, password: string, metadata?: any) => 
    supabase.auth.signUp({ email, password, options: { data: metadata } })

  const signIn = (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  const resetPassword = (email: string) => 
    supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })

  const updatePassword = (newPassword: string) => 
    supabase.auth.updateUser({ password: newPassword })

  const updateUser = (attributes: UserAttributes) =>
    supabase.auth.updateUser(attributes)

  return (
    <AuthContext.Provider value={{ user, session, loading, hasSupabaseConfig, signUp, signIn, signOut, resetPassword, updatePassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

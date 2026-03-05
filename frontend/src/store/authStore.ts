import { create } from 'zustand'
import api from '@/lib/api'

interface User {
  _id: string
  username: string
  email: string
  fullName: string
  avatar: string
  coverImage?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
    fullName: string,
    avatar: File,
    coverImage?: File
  ) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  clearError: () => set({ error: null }),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/users/login', { email, password })
      const { user, accessToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  register: async (
    username: string,
    email: string,
    password: string,
    fullName: string,
    avatar: File,
    coverImage?: File
  ) => {
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('fullName', fullName)
      formData.append('avatar', avatar)
      if (coverImage) {
        formData.append('coverImage', coverImage)
      }

      const response = await api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const { user, accessToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await api.post('/users/logout')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Logout failed'
      set({ error: errorMessage, isLoading: false })
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/users/current-user')
      const user = response.data.data
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error: any) {
      localStorage.removeItem('accessToken')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

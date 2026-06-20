import { create } from 'zustand'
import { messaging } from '../lib/messaging'
import { storage } from '../lib/storage'
import type { AuthState } from '../types/domain'

interface AuthActions {
  hydrate: () => Promise<void>
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signup: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  token: null,
  isLoggedIn: false,
  isHydrated: false,

  hydrate: async () => {
    const token = await storage.getToken()
    set({ token, isLoggedIn: !!token, isHydrated: true })
  },

  login: async (username, password) => {
    try {
      const res = await messaging.login(username, password)
      if (res.ok && res.token) {
        await storage.setToken(res.token)
        set({ token: res.token, isLoggedIn: true })
        return { ok: true }
      }
      if (res.ok) return { ok: false, error: 'No token returned' }
      return { ok: false, error: res.error }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
    }
  },

  signup: async (username, password) => {
    try {
      const res = await messaging.signup(username, password)
      if (res.ok) return { ok: true, error: res.message }
      return { ok: false, error: res.error }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
    }
  },

  logout: async () => {
    await storage.removeToken()
    set({ token: null, isLoggedIn: false })
  },
}))
import type { ChatSource } from './api'

export type PanelKind = 'radial' | 'save' | 'chat' | null

export interface AuthState {
  token: string | null
  isLoggedIn: boolean
  isHydrated: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  sources?: ChatSource[]
  isLoading?: boolean
  createdAt: number
}
import type { ChatResponse, SaveResponse } from './api'

export type MessageType = 'login' | 'signup' | 'save' | 'chat' | 'logout'

export interface LoginMsg {
  type: 'login'
  username: string
  password: string
}

export interface SignupMsg {
  type: 'signup'
  username: string
  password: string
}

export interface SaveMsg {
  type: 'save'
  url: string
}

export interface ChatMsg {
  type: 'chat'
  question: string
  url: string
}

export interface LogoutMsg {
  type: 'logout'
}

export type AppMessage = LoginMsg | SignupMsg | SaveMsg | ChatMsg | LogoutMsg

export type MessageResponse<T = unknown> =
  | { ok: true; data?: T; token?: string; message?: string }
  | { ok: false; error: string }

export type LoginResponse = MessageResponse<{ token: string }>
export type SignupResponse = MessageResponse
export type SaveResponseMsg = MessageResponse<SaveResponse>
export type ChatResponseMsg = MessageResponse<ChatResponse>
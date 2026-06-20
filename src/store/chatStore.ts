import { create } from 'zustand'
import { messaging } from '../lib/messaging'
import type { ChatMessage } from '../types/domain'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  send: (question: string, url: string) => Promise<void>
  reset: () => void
}

let counter = 0
const uid = (): string => `${Date.now()}-${counter++}`

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'ai',
  content: 'Hi! Ask me anything about the content on this page.',
  createdAt: 0,
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [WELCOME],
  isLoading: false,

  send: async (question, url) => {
    if (get().isLoading) return
    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: question,
      createdAt: Date.now(),
    }
    const loadMsg: ChatMessage = {
      id: uid(),
      role: 'ai',
      content: 'Recallr is thinking…',
      isLoading: true,
      createdAt: Date.now(),
    }
    set((s) => ({ messages: [...s.messages, userMsg, loadMsg], isLoading: true }))

    let answerMsg: ChatMessage
    try {
      const res = await messaging.chat(question, url)
      if (res.ok && res.data) {
        answerMsg = {
          id: uid(),
          role: 'ai',
          content: res.data.answer || "I couldn't find an answer.",
          sources: res.data.sources,
          createdAt: Date.now(),
        }
      } else {
        answerMsg = {
          id: uid(),
          role: 'ai',
          content: 'Sorry, something went wrong. Please try again.',
          createdAt: Date.now(),
        }
      }
    } catch {
      answerMsg = {
        id: uid(),
        role: 'ai',
        content: 'Sorry, something went wrong. Please try again.',
        createdAt: Date.now(),
      }
    }

    set((s) => ({
      messages: s.messages.filter((m) => !m.isLoading).concat(answerMsg),
      isLoading: false,
    }))
  },

  reset: () => set({ messages: [WELCOME], isLoading: false }),
}))
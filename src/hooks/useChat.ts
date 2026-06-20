import { useChatStore } from '../store/chatStore'

export function useChat() {
  const messages = useChatStore((s) => s.messages)
  const isLoading = useChatStore((s) => s.isLoading)
  const send = useChatStore((s) => s.send)
  const reset = useChatStore((s) => s.reset)
  return { messages, isLoading, send, reset }
}
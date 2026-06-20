import { useEffect, useRef } from 'react'
import { Message } from './Message'
import type { ChatMessage } from '@/types/domain'

interface Props {
  messages: ChatMessage[]
}

export function MessageList({ messages }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex flex-col gap-2 p-3">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  )
}

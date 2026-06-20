import { usePanelStore } from '@/store/panelStore'
import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/hooks/useChat'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { X, MessageCircle } from 'lucide-react'

export function ChatPanel() {
  const close = usePanelStore((s) => s.close)
  const { isLoggedIn, isHydrated } = useAuth()
  const { messages, isLoading, send } = useChat()

  const onSend = (q: string): void => {
    void send(q, window.location.href)
  }

  return (
    <div className="pointer-events-auto fixed right-5 bottom-5 flex h-[540px] w-[400px] flex-col overflow-hidden rounded-xl border border-[#303046] bg-[#1A1B23] shadow-2xl">
      <header className="flex items-center justify-between border-b border-[#303046] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-[#F0C987]/10">
            <MessageCircle className="size-3.5 text-[#F0C987]" />
          </div>
          <h3 className="text-sm font-semibold text-[#ECEDEE]">Ask Recallr</h3>
        </div>
        <button
          onClick={close}
          aria-label="Close"
          className="flex size-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[#8B8F9E] outline-none transition-colors hover:text-[#ECEDEE] focus-visible:ring-2 focus-visible:ring-[#F0C987]"
        >
          <X />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        {!isHydrated ? null : !isLoggedIn ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-[#ECEDEE]">Not signed in</p>
              <p className="mt-1 text-[11px] text-[#8B8F9E]">
                Sign in from the extension popup to ask questions.
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <MessageList messages={messages} />
            </ScrollArea>
            <ChatInput onSend={onSend} disabled={isLoading} />
          </>
        )}
      </div>
    </div>
  )
}

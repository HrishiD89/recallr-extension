import { usePopupStore } from '@/store/popupStore'
import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/hooks/useChat'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageList } from '@/components/ChatPanel/MessageList'
import { ChatInput } from '@/components/ChatPanel/ChatInput'
import { ArrowLeft, MessageCircle } from 'lucide-react'

export function ChatScreen() {
  const back = usePopupStore((s) => s.back)
  const { isLoggedIn, isHydrated } = useAuth()
  const { messages, isLoading, send } = useChat()

  const onSend = (q: string): void => {
    void send(q, 'popup')
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-border flex items-center gap-2 border-b px-3 py-2.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={back}
          aria-label="Back"
          className="text-muted-foreground size-7"
        >
          <ArrowLeft />
        </Button>
        <div className="bg-primary/10 flex size-6 items-center justify-center rounded-md">
          <MessageCircle className="text-primary size-3.5" />
        </div>
        <h3 className="text-foreground flex-1 text-sm font-semibold">
          Ask Recallr
        </h3>
      </header>

      <div className="flex-1 overflow-hidden">
        {!isHydrated ? null : !isLoggedIn ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-muted-foreground text-center text-xs">
              Sign in from the dashboard to ask questions.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ScrollArea className="flex-1">
              <MessageList messages={messages} />
            </ScrollArea>
            <ChatInput onSend={onSend} disabled={isLoading} />
          </div>
        )}
      </div>
    </div>
  )
}

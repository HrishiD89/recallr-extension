import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoginScreen } from '@/popup/screens/LoginScreen'
import { DashboardScreen } from '@/popup/screens/DashboardScreen'
import { SaveScreen } from '@/popup/screens/SaveScreen'
import { ChatScreen } from '@/popup/screens/ChatScreen'
import { usePopupStore } from '@/store/popupStore'
import { Skeleton } from '@/components/ui/skeleton'

export default function App() {
  const { isLoggedIn, isHydrated, hydrate } = useAuth()
  const currentScreen = usePopupStore((s) => s.currentScreen)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <LoginScreen />
    }

    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />
      case 'save':
        return <SaveScreen />
      case 'chat':
        return <ChatScreen />
      default:
        return <DashboardScreen />
    }
  }

  return (
    <div className="bg-background text-foreground flex h-[600px] w-[320px] flex-col">
      {currentScreen !== 'chat' && (
        <header className="border-border flex items-center gap-2.5 border-b px-4 py-3">
          <div className="bg-primary/20 flex size-6 items-center justify-center rounded-md">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z" />
              <path d="M9 10h6" />
              <path d="M9 6h6" />
              <path d="M9 14h4" />
            </svg>
          </div>
          <h1 className="text-foreground text-sm font-semibold tracking-tight">
            Recallr
          </h1>
        </header>
      )}

      <main className="flex-1 overflow-hidden">
        {!isHydrated ? (
          <div className="space-y-3 p-4">
            <Skeleton className="bg-muted h-4 w-20" />
            <Skeleton className="bg-muted h-9 w-full" />
            <Skeleton className="bg-muted h-9 w-full" />
            <Skeleton className="bg-muted h-9 w-2/3" />
          </div>
        ) : (
          renderScreen()
        )}
      </main>
    </div>
  )
}

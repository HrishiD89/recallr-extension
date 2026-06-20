import { usePopupStore } from '@/store/popupStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageCircle, LogOut, MoreVertical } from 'lucide-react'
import { SaveScreen } from '@/popup/screens/SaveScreen'

export function DashboardScreen() {
  const navigateTo = usePopupStore((s) => s.navigateTo)
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground text-sm font-medium">
          Your library
        </p>
        <p className="text-muted-foreground text-xs">
          Save a page or ask a question.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="bg-card border-border rounded-lg border p-3">
          <SaveScreen />
        </div>
        <Button
          variant="outline"
          onClick={() => navigateTo('chat')}
          className="w-full justify-start gap-2.5 border px-3 py-2.5"
        >
          <div className="bg-primary/10 flex size-7 items-center justify-center rounded-md">
            <MessageCircle className="text-primary size-3.5" />
          </div>
          <div className="flex flex-col items-start gap-0">
            <span className="text-foreground text-sm font-medium">Ask Recallr</span>
            <span className="text-muted-foreground text-[11px]">Search your saved pages</span>
          </div>
        </Button>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 text-xs">
              <MoreVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => void logout()}
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

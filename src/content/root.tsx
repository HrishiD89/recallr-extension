import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { usePanelStore } from '@/store/panelStore'
import { ChatPanel } from '@/components/ChatPanel/ChatPanel'
import { FloatingTrigger } from './FloatingTrigger'

export function ContentRoot() {
  const hydrate = useAuthStore((s) => s.hydrate)
  const open = usePanelStore((s) => s.open)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <>
      <FloatingTrigger />
      {open !== null && <ChatPanel />}
    </>
  )
}

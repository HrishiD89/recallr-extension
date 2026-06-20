import { usePanelStore } from '@/store/panelStore'
import { MessageCircle, X } from 'lucide-react'

export function FloatingTrigger() {
  const open = usePanelStore((s) => s.open)
  const show = usePanelStore((s) => s.show)
  const close = usePanelStore((s) => s.close)
  const isOpen = open !== null

  if (isOpen) {
    return (
      <button
        onClick={close}
        aria-label="Close Recallr"
        className="pointer-events-auto fixed right-5 bottom-5 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full border-0 bg-[#23242E] text-[#ECEDEE] shadow-2xl outline-none transition-all duration-200 hover:brightness-125 focus-visible:ring-2 focus-visible:ring-[#F0C987] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1B23]"
      >
        <X className="size-6" />
      </button>
    )
  }

  return (
    <button
      onClick={() => show('chat')}
      aria-label="Open Recallr"
      className="pointer-events-auto fixed right-5 bottom-5 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full border-0 bg-[#F0C987] text-[#1A1B23] shadow-2xl outline-none transition-all duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#F0C987] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1B23]"
    >
      <MessageCircle className="size-6" />
    </button>
  )
}

import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'

interface Props {
  onSend: (q: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState<string>('')

  const submit = (): void => {
    const t = value.trim()
    if (!t) return
    onSend(t)
    setValue('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    submit()
  }

  return (
    <form
      className="border-border flex items-end gap-2 border-t p-2"
      onSubmit={onSubmit}
    >
      <Textarea
        rows={1}
        placeholder="Ask about this page…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="min-h-9 resize-none text-xs"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="size-9 shrink-0"
      >
        <SendHorizonal />
      </Button>
    </form>
  )
}

import { useEffect, useState } from 'react'
import { messaging } from '@/lib/messaging'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, AlertCircle, Bookmark } from 'lucide-react'

type Status = 'idle' | 'saving' | 'saved' | 'error'

export function SaveScreen() {
  const [url, setUrl] = useState<string>('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setUrl(tabs[0].url)
      }
    })
  }, [])

  const submit = async (): Promise<void> => {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please enter a URL')
      return
    }
    setStatus('saving')
    setError(null)
    try {
      const res = await messaging.save(trimmed)
      if (res.ok) {
        setStatus('saved')
      } else {
        setStatus('error')
        setError(res.error)
      }
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Network error')
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-md">
          <Bookmark className="text-primary size-3.5" />
        </div>
        <p className="text-foreground text-xs font-medium">Save this page</p>
      </div>
      <div className="flex gap-2">
        <Input
          id="save-url-input"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit()
          }}
          autoFocus
          spellCheck={false}
          className="h-8 text-xs"
        />
        <Button
          onClick={() => void submit()}
          disabled={status === 'saving' || status === 'saved'}
          size="sm"
          className="h-8 shrink-0"
        >
          {status === 'saving' ? 'Saving' : status === 'saved' ? 'Saved' : 'Save'}
        </Button>
      </div>

      {status === 'saved' && (
        <div className="bg-primary/10 flex items-center gap-1.5 rounded-md px-2.5 py-2">
          <CheckCircle2 className="text-primary size-3.5 shrink-0" />
          <span className="text-primary text-xs">Page added to your library.</span>
        </div>
      )}

      {status === 'error' && error && (
        <div className="flex items-center gap-1.5 rounded-md bg-red-900/20 px-2.5 py-2">
          <AlertCircle className="size-3.5 shrink-0 text-red-400" />
          <span className="text-xs text-red-400">{error}</span>
        </div>
      )}
    </div>
  )
}

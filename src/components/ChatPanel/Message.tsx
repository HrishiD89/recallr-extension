import { marked } from 'marked'
import { SourceChip } from './SourceChip'
import type { ChatMessage } from '@/types/domain'

interface Props {
  message: ChatMessage
}

marked.setOptions({ breaks: true, gfm: true })

export function Message({ message }: Props) {
  if (message.isLoading) {
    return (
      <div className="bg-card border-border ml-0 mr-auto flex max-w-[80%] items-center gap-2 rounded-lg border px-3 py-3">
        <span className="text-muted-foreground text-xs">Recallr is thinking</span>
        <div className="loader-dots" />
      </div>
    )
  }

  if (message.role === 'user') {
    return (
      <div className="bg-primary/90 text-primary-foreground ml-auto mr-0 max-w-[80%] rounded-lg px-3 py-2.5">
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
      </div>
    )
  }

  const html = marked.parse(message.content, { async: false }) as string
  const uniqueSources = message.sources
    ? Array.from(new Map(message.sources.map((s) => [s.url, s])).values())
    : []

  return (
    <div className="bg-card border-border ml-0 mr-auto max-w-[85%] rounded-lg border px-3 py-3">
      <div
        className="text-foreground text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-2 [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {uniqueSources.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#303046] pt-2">
          <span className="text-muted-foreground mr-0.5 text-[11px]">Sources</span>
          {uniqueSources.map((s, i) => (
            <SourceChip key={s.url + i} url={s.url} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

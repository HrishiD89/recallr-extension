interface Props {
  url: string
  index: number
}

export function SourceChip({ url, index }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={url}
      className="text-primary bg-primary/10 hover:bg-primary/20 inline-flex size-5 items-center justify-center rounded text-[11px] font-medium no-underline transition-colors"
    >
      {index}
    </a>
  )
}

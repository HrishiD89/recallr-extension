export interface SaveResponse {
  id: string
  url: string
  createdAt: string
}

export interface ChatSource {
  url: string
  title?: string
  snippet?: string
}

export interface ChatResponse {
  answer: string
  sources: ChatSource[]
}

export interface ApiError {
  error: string
  status?: number
}

export type ApiResult<T> = T | ApiError
import type {
  AppMessage,
  ChatResponseMsg,
  LoginResponse,
  MessageResponse,
  SaveResponseMsg,
  SignupResponse,
} from '../types/messages'

function sendMessage<R extends MessageResponse = MessageResponse>(
  msg: AppMessage,
): Promise<R> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(msg, (response: R | undefined) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        if (!response) {
          reject(new Error('No response from background'))
          return
        }
        resolve(response)
      })
    } catch (e) {
      reject(e instanceof Error ? e : new Error(String(e)))
    }
  })
}

export const messaging = {
  login(username: string, password: string): Promise<LoginResponse> {
    return sendMessage<LoginResponse>({ type: 'login', username, password })
  },
  signup(username: string, password: string): Promise<SignupResponse> {
    return sendMessage<SignupResponse>({ type: 'signup', username, password })
  },
  save(url: string): Promise<SaveResponseMsg> {
    return sendMessage<SaveResponseMsg>({ type: 'save', url })
  },
  chat(question: string, url: string): Promise<ChatResponseMsg> {
    return sendMessage<ChatResponseMsg>({ type: 'chat', question, url })
  },
  logout(): Promise<MessageResponse> {
    return sendMessage({ type: 'logout' })
  },
}
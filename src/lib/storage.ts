export const storage = {
  getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get('token', (r) => resolve((r.token as string | undefined) ?? null))
    })
  },
  setToken(token: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ token }, () => resolve())
    })
  },
  removeToken(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove('token', () => resolve())
    })
  },
}
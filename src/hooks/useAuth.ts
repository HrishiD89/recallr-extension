import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const login = useAuthStore((s) => s.login)
  const signup = useAuthStore((s) => s.signup)
  const logout = useAuthStore((s) => s.logout)
  const hydrate = useAuthStore((s) => s.hydrate)
  return { isLoggedIn, isHydrated, login, signup, logout, hydrate }
}
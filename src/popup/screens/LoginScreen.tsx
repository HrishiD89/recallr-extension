import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function LoginScreen() {
  const { login, signup } = useAuth()
  const [isRegistering, setIsRegistering] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const submit = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    setNotice(null)
    if (isRegistering) {
      const r = await signup(username, password)
      setLoading(false)
      if (r.ok) {
        setIsRegistering(false)
        setNotice('Account created. Please sign in.')
      } else {
        setError(r.error ?? 'Registration failed.')
      }
    } else {
      const r = await login(username, password)
      setLoading(false)
      if (!r.ok) setError(r.error ?? 'Sign in failed.')
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void submit()
  }

  return (
    <form className="flex h-full flex-col gap-4 p-5" onSubmit={onSubmit}>
      <div className="pt-2 pb-2">
        <div className="bg-primary/10 mx-auto mb-3 flex size-10 items-center justify-center rounded-xl">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z" />
            <path d="M9 10h6" />
            <path d="M9 6h6" />
            <path d="M9 14h4" />
          </svg>
        </div>
        <h2 className="text-foreground text-center text-sm font-semibold">
          {isRegistering ? 'Create your library' : 'Sign in to Recallr'}
        </h2>
        <p className="text-muted-foreground mt-1 text-center text-xs">
          {isRegistering
            ? 'Start saving pages to your personal archive.'
            : 'Access your saved pages and library.'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {notice && (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Done</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-username">Username</Label>
        <Input
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isRegistering ? 'new-password' : 'current-password'}
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !username || !password}
        className="w-full shadow-sm"
      >
        {loading ? 'Please wait' : isRegistering ? 'Register' : 'Sign in'}
      </Button>

      <div className="mt-auto">
        <p className="text-muted-foreground text-center text-xs">
          {isRegistering ? 'Already have an archive? ' : 'New here? '}
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError(null)
              setNotice(null)
            }}
          >
            {isRegistering ? 'Sign in' : 'Register'}
          </button>
        </p>
        <p className="text-muted-foreground mt-2 text-center text-[11px]">
          Demo account: demo / demo
        </p>
      </div>
    </form>
  )
}

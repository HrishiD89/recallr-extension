import { useEffect, useState } from "react"

export default function Popup() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local.get("token", (result) => {
      if (result.token) setIsLoggedIn(true)
    })
  }, [])

  const handleLogin = () => {
    setLoading(true)
    setError(null)
    chrome.runtime.sendMessage(
      { type: "login", username, password },
      (response) => {
        setLoading(false)
        if (response?.ok) {
          setIsLoggedIn(true)
        } else {
          setError("Login failed. Check your credentials.")
        }
      }
    )
  }

  const handleRegister = () => {
    setLoading(true)
    setError(null)
    chrome.runtime.sendMessage(
      { type: "signup", username, password },
      (response) => {
        setLoading(false)
        if (response?.ok) {
          setError(null)
          setIsRegistering(false)
          setError("Registered! Please log in now.")
        } else {
          setError("Registration failed. Try a different username.")
        }
      }
    )
  }

  const handleLogout = () => {
    chrome.storage.local.remove("token", () => {
      setIsLoggedIn(false)
      setUsername("")
      setPassword("")
    })
  }

  if (isLoggedIn) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Recallr</h2>
        <p style={styles.subtitle}>You are logged in ✓</p>
        <button style={styles.btnSecondary} onClick={handleLogout}>
          Logout
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recallr</h2>
      <p style={styles.subtitle}>
        {isRegistering ? "Create an account" : "Sign in to continue"}
      </p>

      {error && <p style={styles.error}>{error}</p>}

      <input
        style={styles.input}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") isRegistering ? handleRegister() : handleLogin()
        }}
      />

      <button
        style={styles.btnPrimary}
        onClick={isRegistering ? handleRegister : handleLogin}
        disabled={loading}
      >
        {loading ? "Please wait..." : isRegistering ? "Register" : "Login"}
      </button>

      <p style={styles.toggle}>
        {isRegistering ? "Already have an account? " : "Don't have an account? "}
        <span
          style={styles.link}
          onClick={() => {
            setIsRegistering(!isRegistering)
            setError(null)
          }}
        >
          {isRegistering ? "Login" : "Register"}
        </span>
      </p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 280,
    padding: 20,
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  title: {
    margin: 0,
    fontSize: 18,
    color: "#5C47E0",
    fontWeight: 700,
  },
  subtitle: {
    margin: 0,
    fontSize: 13,
    color: "#666",
  },
  input: {
    padding: "9px 11px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "10px",
    background: "#5C47E0",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },
  btnSecondary: {
    padding: "10px",
    background: "transparent",
    color: "#5C47E0",
    border: "1.5px solid #5C47E0",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },
  error: {
    margin: 0,
    fontSize: 12,
    color: "#dc2626",
    background: "#fef2f2",
    padding: "8px 10px",
    borderRadius: 6,
  },
  toggle: {
    margin: 0,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  link: {
    color: "#5C47E0",
    cursor: "pointer",
    fontWeight: 600,
  },
}
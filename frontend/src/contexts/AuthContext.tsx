import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { authService } from '@/services/authService'
import type { User, AuthContextData } from '@/types/auth'

const AuthContext = createContext<AuthContextData | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/** Decodifica o payload de um JWT sem verificar a assinatura (só leitura local). */
function decodeJwtPayload(token: string): User | null {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json)
    if (!payload.id || !payload.username || !payload.email) return null
    return { id: payload.id, username: payload.username, email: payload.email }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('token')
    return stored ? decodeJwtPayload(stored) : null
  })
  const isLoading = false

  // Sincroniza o user sempre que o token mudar
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }
    const decoded = decodeJwtPayload(token)
    if (!decoded) {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } else {
      setUser(decoded)
    }
  }, [token])

  async function login(email: string, password: string) {
    const res = await authService.login({ email, password })
    const { accessToken } = res.data
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
  }

  async function register(username: string, email: string, password: string) {
    // Cria a conta e, em seguida, faz login para obter o token
    await authService.register({ username, email, password })
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value: AuthContextData = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextData {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

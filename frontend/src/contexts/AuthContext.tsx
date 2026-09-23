import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import api from '@/lib/api'
import { authService } from '@/services/authService'
import type { User, AuthContextData } from '@/types/auth'

const AuthContext = createContext<AuthContextData | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  // Ao montar, valida o token armazenado buscando o perfil do usuário
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    api
      .get<User>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  async function login(email: string, password: string) {
    const res = await authService.login({ email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  async function register(username: string, email: string, password: string) {
    const res = await authService.register({ username, email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
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

import api from '@/lib/api'
import type { User } from '@/types/auth'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>('/auth/login', payload)
  },

  register(payload: RegisterPayload) {
    return api.post<AuthResponse>('/auth/register', payload)
  },
}

import api from '@/lib/api'

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
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  id: string,
  username: string,
  email: string
}

export const authService = {
  login(payload: LoginPayload) {
    return api.post<AuthResponse>('/users/login', payload)
  },

  register(payload: RegisterPayload) {
    return api.post<RegisterResponse>('/users/create', payload)
  },
}

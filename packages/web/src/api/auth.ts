import { http } from './client'
import type { ApiResponse, AuthUser, LoginPayload, RegisterPayload } from '../types/auth'

export async function login(payload: LoginPayload) {
  return http.post<ApiResponse<AuthUser>>('/auth/login', payload)
}

export async function register(payload: RegisterPayload) {
  return http.post<ApiResponse<AuthUser>>('/auth/register', payload)
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  nickname?: string
  email: string
  password: string
  confirmPassword?: string
}

export type AuthUser = {
  nickname: string
  email: string
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

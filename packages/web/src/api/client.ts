import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

export class HttpError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

function createApiClient() {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 10000
  })

  instance.interceptors.request.use((config) => {
    config.headers.set('Content-Type', 'application/json')
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        '请求失败，请稍后重试'

      return Promise.reject(new HttpError(message, error.response?.status))
    }
  )

  return instance
}

const instance = createApiClient()

async function request<T>(config: AxiosRequestConfig) {
  const response = await instance.request<T>(config)
  return response.data
}

export const apiClient: AxiosInstance = instance

export const http = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: 'GET',
      url
    })
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: 'POST',
      url,
      data
    })
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: 'PUT',
      url,
      data
    })
  },

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: 'PATCH',
      url,
      data
    })
  },

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({
      ...config,
      method: 'DELETE',
      url
    })
  }
}

import axios, { type AxiosError } from 'axios'

export const ACCESS_TOKEN_STORAGE_KEY = 'healthcare_platform_access_token'

type ApiErrorBody = {
  message?: string
}

export type ApiError = AxiosError<ApiErrorBody> & {
  status?: number
  userMessage: string
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status
    const userMessage = error.response?.data?.message ?? error.message

    if (status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    }

    return Promise.reject(
      Object.assign(error, {
        status,
        userMessage,
      } satisfies Pick<ApiError, 'status' | 'userMessage'>),
    )
  },
)

// export const setAccessToken = (token: string) => {
//   localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
// }

// export const clearAccessToken = () => {
//   localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
// }

export default apiClient

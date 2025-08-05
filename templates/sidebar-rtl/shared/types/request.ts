export interface ApiResponseType<T> {
  success: boolean
  status: number
  message: string
  data: T
  redirect_url?: string
}

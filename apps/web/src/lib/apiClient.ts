const BASE_URL = ""

export type ApiError = Error & { status: number }

export function createApiError(status: number, message: string): ApiError {
  const err = new Error(message) as ApiError
  err.name = "ApiError"
  err.status = status
  return err
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      ...init?.headers,
    },
  })

  if (!res.ok) {
    throw createApiError(res.status, `HTTP ${res.status}: ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  post<T>(path: string, body: unknown, init?: Omit<RequestInit, "method" | "body">): Promise<T> {
    return request<T>(path, { ...init, method: "POST", body: JSON.stringify(body) })
  },
}

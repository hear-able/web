import { API_BASE_URL } from '../config'

const ACCESS_KEY = 'hearable.access_token'
const REFRESH_KEY = 'hearable.refresh_token'

export type Role = 'user' | 'volunteer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  created_at: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface Transcription {
  transcription: string
  prompt: string
}

export interface CreatedModule {
  id: string
  type: 'listening' | 'speaking'
  label: string
  title: string
  description: string
  difficulty: number
  difficulty_label: string
  difficulty_explanation: string
  estimated_minutes: number
  item_count: number
}

export interface ListeningQuestionPayload {
  prompt: string
  transcription: string
  type: 'choice' | 'input'
  options?: { text: string; is_correct: boolean }[]
  answer_explanation?: string
  expected_answer?: string
}

export interface ListeningModulePayload {
  title: string
  label: string
  description: string
  questions: ListeningQuestionPayload[]
}

export interface SpeakingModulePayload {
  title: string
  label: string
  description: string
  sentences: { text: string; description?: string }[]
}

/** Error carrying the backend's user-facing Indonesian message. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly retryable: boolean

  constructor(status: number, code: string, message: string, retryable = false) {
    super(message)
    this.status = status
    this.code = code
    this.retryable = retryable
  }
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Storage blocked (private mode); the session just won't persist.
  }
}

export const tokens = {
  access: () => safeGet(ACCESS_KEY),
  refresh: () => safeGet(REFRESH_KEY),
  set(access: string, refresh: string) {
    safeSet(ACCESS_KEY, access)
    safeSet(REFRESH_KEY, refresh)
  },
  clear() {
    safeSet(ACCESS_KEY, null)
    safeSet(REFRESH_KEY, null)
  },
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json()
    if (body?.error?.message) {
      return new ApiError(res.status, body.error.code, body.error.message, Boolean(body.error.retryable))
    }
  } catch {
    // fall through
  }
  return new ApiError(res.status, 'unknown', 'Terjadi kesalahan. Silakan coba lagi.')
}

// One in-flight refresh shared by concurrent 401s, because refresh tokens
// are single use.
let refreshing: Promise<boolean> | null = null

function refreshTokens(): Promise<boolean> {
  const refresh = tokens.refresh()
  if (!refresh) return Promise.resolve(false)
  refreshing ??= fetch(`${API_BASE_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  })
    .then(async (res) => {
      if (!res.ok) {
        tokens.clear()
        return false
      }
      const data = (await res.json()) as AuthResponse
      tokens.set(data.access_token, data.refresh_token)
      return true
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

interface RequestOptions {
  method?: string
  json?: unknown
  form?: FormData
  auth?: boolean
  signal?: AbortSignal
}

async function request<T>(path: string, opts: RequestOptions = {}, retried = false): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  let body: BodyInit | undefined
  if (opts.json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(opts.json)
  } else if (opts.form) {
    body = opts.form
  }
  const access = tokens.access()
  if (opts.auth !== false && access) headers.Authorization = `Bearer ${access}`

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { method: opts.method ?? 'GET', headers, body, signal: opts.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(0, 'network', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', true)
  }

  if (res.status === 401 && opts.auth !== false && !retried && (await refreshTokens())) {
    return request<T>(path, opts, true)
  }
  if (!res.ok) throw await parseError(res)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  register: (input: { name: string; email: string; password: string; accept_terms: boolean; role: Role }) =>
    request<AuthResponse>('/v1/auth/register', { method: 'POST', json: input, auth: false }),
  login: (input: { email: string; password: string }) =>
    request<AuthResponse>('/v1/auth/login', { method: 'POST', json: input, auth: false }),
  logout: () => {
    const refresh = tokens.refresh()
    return request<void>('/v1/auth/logout', { method: 'POST', json: { refresh_token: refresh ?? '' } })
  },
  me: () => request<User>('/v1/me'),

  transcribe: (audio: File, signal?: AbortSignal) => {
    const form = new FormData()
    form.append('audio', audio)
    return request<Transcription>('/v1/volunteer/listening/transcriptions', { method: 'POST', form, signal })
  },
  createListeningModule: (payload: ListeningModulePayload, audios: File[]) => {
    const form = new FormData()
    form.append('payload', JSON.stringify(payload))
    audios.forEach((file, i) => form.append(`audio_${i}`, file))
    return request<CreatedModule>('/v1/volunteer/listening/modules', { method: 'POST', form })
  },
  createSpeakingModule: (payload: SpeakingModulePayload) =>
    request<CreatedModule>('/v1/volunteer/speaking/modules', { method: 'POST', json: payload }),
}

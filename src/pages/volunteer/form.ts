import { ApiError } from '../../lib/api'

export const MAX_ITEMS = 10
export const LIMITS = { title: 120, label: 60, description: 1000 }

export interface ModuleMeta {
  title: string
  label: string
  description: string
}

export function errorMessage(err: unknown) {
  return err instanceof ApiError ? err.message : 'Terjadi kesalahan. Silakan coba lagi.'
}

export function validateMeta(meta: ModuleMeta): string | null {
  if (!meta.title.trim()) return 'Judul modul wajib diisi.'
  if (!meta.label.trim()) return 'Label modul wajib diisi.'
  return null
}

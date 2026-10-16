const env = import.meta.env

export const API_BASE_URL = (env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

export const links = {
  docs: env.VITE_DOCS_URL || 'https://docs.hearable.nighttealabs.tech',
  backendRepo: env.VITE_BACKEND_REPO_URL || 'https://github.com/hear-able/backend',
  webRepo: env.VITE_WEB_REPO_URL || 'https://github.com/hear-able/web',
  mobileRepo: env.VITE_MOBILE_REPO_URL || 'https://github.com/hear-able/mobile',
  apk: env.VITE_APK_URL || 'https://github.com/hear-able/mobile/releases/latest',
}

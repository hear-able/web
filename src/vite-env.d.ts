/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_DOCS_URL?: string
  readonly VITE_BACKEND_REPO_URL?: string
  readonly VITE_WEB_REPO_URL?: string
  readonly VITE_MOBILE_REPO_URL?: string
  readonly VITE_APK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

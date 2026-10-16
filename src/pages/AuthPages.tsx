import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Alert, Brand, Button, Input } from '../components/ui'
import { Phone } from '../components/Phone'
import { useAuth } from '../lib/auth'
import { ApiError } from '../lib/api'
import home from '../assets/screens/home.png'

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="sky grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <Brand />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </main>
      </div>
      <aside className="hidden items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 p-10 lg:flex" aria-hidden>
        <div className="max-w-sm text-center text-white">
          <Phone src={home} alt="" className="mx-auto w-60" />
          <p className="mt-8 text-2xl font-bold">Terima kasih telah membantu.</p>
          <p className="mt-2 text-white/80">Materi dari relawan membuat latihan lebih beragam bagi pengguna alat bantu dengar.</p>
        </div>
      </aside>
    </div>
  )
}

function PasswordInput({ value, onChange, autoComplete, hint }: { value: string; onChange: (v: string) => void; autoComplete: string; hint?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        label="Kata Sandi"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        hint={hint}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        className="absolute right-2 top-[34px] grid size-9 place-items-center rounded-full text-muted hover:bg-teal-50"
      >
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
}

function errorMessage(err: unknown) {
  return err instanceof ApiError ? err.message : 'Terjadi kesalahan. Silakan coba lagi.'
}

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/relawan'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={from} replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Masuk sebagai relawan" subtitle="Lanjutkan berbagi materi latihan untuk pengguna HearAble.">
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="contoh@email.com" required />
        <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
        <Button type="submit" size="lg" loading={loading}>
          Masuk
          <ArrowRight className="size-4" aria-hidden />
        </Button>
        <p className="text-center text-sm text-muted">
          Belum punya akun relawan?{' '}
          <Link to="/relawan/daftar" className="font-semibold text-teal-700 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accept, setAccept] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/relawan" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!accept) {
      setError('Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi.')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/relawan', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Daftar sebagai relawan" subtitle="Buat akun untuk menyumbangkan modul latihan mendengar dan berbicara.">
      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Nama Panggilan" value={name} onChange={(e) => setName(e.target.value)} autoComplete="nickname" placeholder="Nama Anda (misal: Rian)" maxLength={100} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="contoh@email.com" required />
        <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" hint="Minimal 8 karakter." />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 text-sm text-muted ring-1 ring-teal-100">
          <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-teal-500" />
          <span>
            Saya menyetujui <span className="font-semibold text-teal-700">Ketentuan Layanan</span> dan{' '}
            <span className="font-semibold text-teal-700">Kebijakan Privasi</span> HearAble, termasuk penggunaan materi yang saya unggah untuk latihan.
          </span>
        </label>
        <Button type="submit" size="lg" loading={loading}>
          Buat Akun Relawan
          <ArrowRight className="size-4" aria-hidden />
        </Button>
        <p className="text-center text-sm text-muted">
          Sudah punya akun?{' '}
          <Link to="/relawan/masuk" className="font-semibold text-teal-700 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

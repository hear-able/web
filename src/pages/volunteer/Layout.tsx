import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LoaderCircle, LogOut } from 'lucide-react'
import { Alert, Brand, Button, Card } from '../../components/ui'
import { cx } from '../../lib/cx'
import { useAuth } from '../../lib/auth'

/** Guards /relawan/* to signed-in volunteers and renders the app shell. */
export default function VolunteerLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center" role="status">
        <LoaderCircle className="size-8 animate-spin text-teal-500" aria-hidden />
        <span className="sr-only">Memuat…</span>
      </div>
    )
  }
  if (!user) return <Navigate to="/relawan/masuk" replace state={{ from: location.pathname }} />

  return (
    <div className="min-h-screen bg-teal-50">
      <header className="sticky top-0 z-10 border-b border-teal-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Brand />
            <nav aria-label="Navigasi relawan" className="hidden gap-1 text-sm font-medium sm:flex">
              {[
                { to: '/relawan', label: 'Beranda', end: true },
                { to: '/relawan/mendengar/baru', label: 'Modul Mendengar' },
                { to: '/relawan/berbicara/baru', label: 'Modul Berbicara' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cx('rounded-full px-3 py-1.5 transition', isActive ? 'bg-teal-100 text-teal-700' : 'text-muted hover:text-ink')}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted md:inline">
              Halo, <span className="font-semibold text-ink">{user.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="size-4" aria-hidden />
              Keluar
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {user.role === 'volunteer' ? (
          <Outlet />
        ) : (
          <Card className="mx-auto max-w-lg text-center">
            <h1 className="text-xl font-bold text-ink">Akun ini bukan akun relawan</h1>
            <div className="mt-4">
              <Alert tone="info">
                Akun {user.email} terdaftar sebagai pengguna aplikasi. Untuk membuat modul, keluar lalu daftar dengan akun relawan.
              </Alert>
            </div>
            <Button className="mt-6" onClick={logout}>
              Keluar dan daftar sebagai relawan
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}

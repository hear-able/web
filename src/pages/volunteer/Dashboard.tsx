import { Link } from 'react-router-dom'
import { ArrowRight, Ear, Mic, Sparkles } from 'lucide-react'
import { useAuth } from '../../lib/auth'

const options = [
  {
    to: '/relawan/mendengar/baru',
    icon: Ear,
    title: 'Modul Mendengar',
    text: 'Unggah audio untuk setiap soal. Transkripsi dibuat otomatis dan bisa kamu perbaiki, lalu tentukan jawabannya: pilihan ganda atau isian.',
    tone: 'bg-teal-100 text-teal-700',
    cta: 'bg-teal-100 text-teal-700',
  },
  {
    to: '/relawan/berbicara/baru',
    icon: Mic,
    title: 'Modul Berbicara',
    text: 'Tulis kalimat yang akan diucapkan pengguna. Panduan suku kata dibuat otomatis.',
    tone: 'bg-sun-100 text-amber-700',
    cta: 'bg-sun-100 text-amber-800',
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-ink">Halo, {user?.name}!</h1>
      <p className="mt-2 text-muted">Modul apa yang ingin kamu buat hari ini?</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {options.map(({ to, icon: Icon, title, text, tone, cta }) => (
          <Link key={to} to={to} className="group flex flex-col rounded-3xl bg-white p-6 ring-1 ring-teal-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10">
            <span className={`grid size-12 place-items-center rounded-2xl ${tone}`}>
              <Icon className="size-6" aria-hidden />
            </span>
            <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{text}</p>
            <span className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold ${cta}`}>
              Buat modul
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex gap-4 rounded-3xl bg-navy p-6 text-white">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-sun" aria-hidden />
        <div className="text-sm leading-relaxed text-white/85">
          <p className="font-semibold text-white">Tingkat kesulitan ditentukan oleh AI</p>
          <p className="mt-1">
            Setelah kamu menekan <span className="font-semibold">Kirim</span>, AI menilai modul dalam empat tingkat (Pemula, Dasar, Menengah,
            Mahir) dan modul langsung tersedia di aplikasi. Setiap modul berisi 1 sampai 10 soal atau kalimat.
          </p>
        </div>
      </div>
    </div>
  )
}

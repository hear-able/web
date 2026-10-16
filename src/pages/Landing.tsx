import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  AudioLines,
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  Download,
  Ear,
  FileAudio,
  FileText,
  HandHeart,
  Layers,
  Menu,
  Mic,
  School,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Brand, GithubIcon } from '../components/ui'
import { cx } from '../lib/cx'
import { Phone } from '../components/Phone'
import { links } from '../config'
import home from '../assets/screens/home.png'
import listening from '../assets/screens/listening.png'
import speaking from '../assets/screens/speaking.png'
import result from '../assets/screens/result.png'
import modules from '../assets/screens/modules.png'
import progress from '../assets/screens/progress.png'

const navItems = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#relawan', label: 'Relawan' },
  { href: '#sumber', label: 'Sumber' },
]

const featureChips: { icon: LucideIcon; label: string }[] = [
  { icon: Ear, label: 'Latihan Mendengar' },
  { icon: Mic, label: 'Latihan Berbicara' },
  { icon: Sparkles, label: 'Umpan Balik AI' },
  { icon: Layers, label: '4 Tingkat Kesulitan' },
  { icon: ChartNoAxesColumnIncreasing, label: 'Progres Mingguan' },
  { icon: HandHeart, label: 'Materi dari Relawan' },
]

const audiences = ['#SiswaTunarungu', '#SiswaKurangDengar', '#PenggunaAlatBantuDengar', '#Guru&Pendidik', '#Keluarga&Pendamping', '#Relawan']

const problems: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: School,
    title: 'Metode kelas yang seragam',
    text: 'Pembelajaran jarang disesuaikan dengan kondisi tiap siswa, sehingga siswa tunarungu dan kurang dengar mudah tertinggal.',
  },
  {
    icon: CircleHelp,
    title: 'Latihan mandiri tanpa arahan',
    text: 'Berlatih sendiri itu sulit jika tidak tahu bagian mana yang sudah tepat dan mana yang perlu diperbaiki.',
  },
  {
    icon: Stethoscope,
    title: 'Terapis tidak selalu terjangkau',
    text: 'Akses harian ke terapis wicara profesional masih terbatas, padahal latihan perlu dilakukan rutin.',
  },
]

const steps = [
  {
    img: listening,
    alt: 'Layar latihan mendengar: putar audio lalu pilih jawaban',
    title: '1. Dengarkan',
    text: 'Putar audio sesering yang kamu butuhkan. Petunjuk teks tersedia jika suara sulit dikenali.',
  },
  {
    img: speaking,
    alt: 'Layar latihan berbicara dengan panduan ritme suku kata',
    title: '2. Jawab & Ucapkan',
    text: 'Tuliskan pemahamanmu atau rekam suaramu dengan panduan ritme suku kata.',
  },
  {
    img: result,
    alt: 'Layar hasil latihan dengan ringkasan jawaban benar',
    title: '3. Pahami Hasilnya',
    text: 'AI menjelaskan apa yang sudah tepat dan apa yang bisa dilatih lagi, bukan sekadar angka.',
  },
]

const resources = [
  { icon: FileText, title: 'Dokumentasi API', text: 'Swagger UI untuk seluruh endpoint HearAble.', href: links.docs },
  { icon: GithubIcon, title: 'Repositori Backend', text: 'Go, PostgreSQL, dan integrasi AI.', href: links.backendRepo },
  { icon: GithubIcon, title: 'Repositori Web', text: 'React + Vite untuk landing page dan relawan.', href: links.webRepo },
  { icon: GithubIcon, title: 'Repositori Mobile', text: 'Aplikasi latihan untuk pengguna.', href: links.mobileRepo },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="relative z-20 flex items-center justify-between gap-4 py-4">
      <Brand />
      <nav aria-label="Navigasi utama" className="hidden items-center gap-7 text-sm font-medium text-muted lg:flex">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="rounded transition-colors hover:text-ink">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="hidden items-center gap-2 lg:flex">
        <a href={links.docs} target="_blank" rel="noreferrer" aria-label="Dokumentasi API" className="grid size-9 place-items-center rounded-full bg-teal-50 text-navy ring-1 ring-teal-100 transition hover:bg-teal-100">
          <FileText className="size-4" aria-hidden />
        </a>
        <a href={links.backendRepo} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-9 place-items-center rounded-full bg-teal-50 text-navy ring-1 ring-teal-100 transition hover:bg-teal-100">
          <GithubIcon className="size-4" />
        </a>
        <Link to="/relawan" className="ml-1 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700">
          Halaman Relawan
        </Link>
      </div>
      <button
        type="button"
        className="grid size-10 place-items-center rounded-full bg-teal-50 text-navy ring-1 ring-teal-100 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Navigasi utama" className="absolute inset-x-0 top-full rounded-3xl bg-white p-4 shadow-xl ring-1 ring-teal-100 lg:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-medium text-ink hover:bg-teal-50">
                  {item.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <Link to="/relawan" className="block rounded-full bg-navy px-4 py-3 text-center font-semibold text-white">
                Halaman Relawan
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

function SectionHeading({ title, muted, children }: { title: string; muted?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title} {muted && <span className="text-muted/70">{muted}</span>}
      </h2>
      {children && <p className="mt-4 text-base leading-relaxed text-muted">{children}</p>}
    </div>
  )
}
export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <Navbar />
      </div>

        <main>
          {/* Hero */}
          <section className="relative px-4 pt-10 text-center sm:px-8 sm:pt-16" aria-labelledby="hero-title">
            <h1 id="hero-title" className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-6xl">
              Belajar Mendengar &amp; Berbicara, Tanpa Tertinggal
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              HearAble adalah sebuah terapi digital bagi mereka yang menggunakan alat bantu dengar. Tujuan kami adalah
              membantu mereka agar dapat mengikuti pembelajaran di kelas dengan lebih baik melalui latihan mendengar dan berbicara.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={links.apk} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 font-semibold text-white shadow-lg shadow-navy/20 transition hover:bg-navy-700">
                <Download className="size-4" aria-hidden />
                Unduh Aplikasi
              </a>
              <Link to="/relawan" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-navy ring-1 ring-teal-200 transition hover:bg-teal-50">
                <HandHeart className="size-4" aria-hidden />
                Jadi Relawan
              </Link>
            </div>

            <div className="relative mx-auto mt-14 flex max-w-4xl items-end justify-center gap-3 pb-4 sm:gap-6">
              <Phone src={listening} alt="Latihan mendengar di aplikasi HearAble" className="hidden w-40 translate-y-8 -rotate-6 sm:block md:w-52" />
              <Phone src={home} alt="Beranda aplikasi HearAble dengan aktivitas mingguan" className="w-56 md:w-64" />
              <Phone src={speaking} alt="Latihan berbicara di aplikasi HearAble" className="hidden w-40 translate-y-8 rotate-6 sm:block md:w-52" />
            </div>
          </section>

          {/* Feature chips */}
          <section id="fitur" className="scroll-mt-6 border-y border-teal-100 px-4 py-6 sm:px-8" aria-label="Fitur unggulan">
            <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {featureChips.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-teal-100">
                  <Icon className="size-4 text-teal-600" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </section>

          {/* Statement */}
          <section className="px-4 py-20 text-center sm:px-8 sm:py-28" aria-label="Tentang HearAble">
            <p className="mx-auto max-w-4xl text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl">
              Sebuah kata bisa terdengar, namun dipahami berbeda dari pelafalan sebenarnya,{' '}
              <span className="text-muted/60">Terapi offline memerlukan kemampuan finansial yang tidak semuanya miliki</span>
            </p>
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted">
              {audiences.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>

          {/* How it works */}
          <section id="cara-kerja" className="scroll-mt-6 px-4 py-20 sm:px-8" aria-labelledby="how-title">
            <div id="how-title">
              <SectionHeading title="Dari mendengar" muted="hingga memahami.">
                Latihan yang terpandu, bukan ditebak sendiri. Setiap sesi singkat, terarah, dan bisa diulang kapan saja.
              </SectionHeading>
            </div>
            <ol className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.title} className="flex flex-col items-center rounded-3xl bg-white p-6 text-center ring-1 ring-teal-100">
                  <Phone src={s.img} alt={s.alt} className="w-40" />
                  <h3 className="mt-6 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Volunteer */}
          <section id="relawan" className="scroll-mt-6 px-4 py-20 sm:px-8" aria-labelledby="volunteer-title">
            <div className="mx-auto grid max-w-5xl items-center gap-10 overflow-hidden rounded-[2rem] bg-navy p-8 text-white sm:p-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 id="volunteer-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Bagikan materi latihan, bantu lebih banyak orang berlatih.
                </h2>
                <ol className="mt-8 space-y-4">
                  {[
                    { icon: FileAudio, text: 'Unggah audio untuk latihan mendengar, atau tulis kalimat untuk latihan berbicara.' },
                    { icon: AudioLines, text: 'Periksa dan perbaiki transkripsi otomatis dari audio.' },
                    { icon: Sparkles, text: 'AI menilai tingkat kesulitan, lalu modul langsung tersedia di aplikasi.' },
                  ].map(({ icon: Icon, text }, i) => (
                    <li key={text} className="flex gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-sun">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <p className="pt-2 text-sm leading-relaxed text-white/80">
                        <span className="font-semibold text-white">Langkah {i + 1}. </span>
                        {text}
                      </p>
                    </li>
                  ))}
                </ol>
                <Link to="/relawan" className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 font-semibold text-navy transition hover:brightness-105">
                  Mulai sebagai relawan
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <div className="flex justify-center gap-4">
                <Phone src={modules} alt="Daftar modul latihan di aplikasi" className="w-40 sm:w-48" />
                <Phone src={progress} alt="Halaman progres latihan" className="hidden w-40 translate-y-10 sm:block sm:w-48" />
              </div>
            </div>
          </section>

          {/* Resources */}
          <section id="sumber" className="scroll-mt-6 px-4 py-20 sm:px-8" aria-labelledby="resources-title">
            <div id="resources-title">
              <SectionHeading title="Dokumentasi & kode," muted="terbuka untuk semua.">
                Pelajari API-nya, telusuri kodenya, atau unduh aplikasinya.
              </SectionHeading>
            </div>
            <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {resources.map(({ icon: Icon, title, text, href }) => (
                <li key={title}>
                  <a href={href} target="_blank" rel="noreferrer" className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-teal-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10">
                    <span className="grid size-11 place-items-center rounded-2xl bg-teal-100 text-navy">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-bold text-ink">{title}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{text}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                      Buka
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="px-4 py-20 sm:px-8" aria-labelledby="cta-title">
            <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] bg-white p-8 text-center ring-1 ring-teal-100 sm:p-12">
              <div className="max-w-md">
                <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-ink">
                  Mulai latihan pertamamu hari ini.
                </h2>
                <p className="mt-3 text-muted">Latihan terpandu setiap hari, agar tidak ada yang tertinggal di kelas.</p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a href={links.apk} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-white">
                    <Download className="size-4" aria-hidden />
                    Unduh untuk Android
                  </a>
                  <a href="#cara-kerja" className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-navy">
                    <BookOpenText className="size-4" aria-hidden />
                    Lihat cara kerja
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-teal-100">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div className="max-w-sm">
                <Brand />
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Pendamping belajar inklusif untuk latihan mendengar dan berbicara bagi siswa tunarungu dan kurang dengar.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
                <div>
                  <h3 className="font-semibold text-ink">Halaman</h3>
                  <ul className="mt-3 space-y-2 text-muted">
                    {navItems.slice(0, 3).map((n) => (
                      <li key={n.href}>
                        <a href={n.href} className="hover:text-ink">
                          {n.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Sumber</h3>
                  <ul className="mt-3 space-y-2 text-muted">
                    <li><a href={links.docs} target="_blank" rel="noreferrer" className="hover:text-ink">Dokumentasi API</a></li>
                    <li><a href={links.backendRepo} target="_blank" rel="noreferrer" className="hover:text-ink">Backend</a></li>
                    <li><a href={links.webRepo} target="_blank" rel="noreferrer" className="hover:text-ink">Web</a></li>
                    <li><a href={links.mobileRepo} target="_blank" rel="noreferrer" className="hover:text-ink">Mobile</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-ink">Aplikasi</h3>
                  <ul className="mt-3 space-y-2 text-muted">
                    <li><a href={links.apk} target="_blank" rel="noreferrer" className="hover:text-ink">Unduh APK</a></li>
                    <li><Link to="/relawan" className="hover:text-ink">Relawan</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <p className={cx('mt-10 rounded-2xl p-4 ring-1 ring-teal-100 text-xs leading-relaxed text-muted')}>
              HearAble adalah alat latihan dan edukasi. Skor dan umpan balik AI bukan diagnosis klinis dan tidak menggantikan pemeriksaan audiologi
              profesional.
            </p>
            <p className="mt-6 text-xs text-muted">© {new Date().getFullYear()} HearAble.</p>
          </div>
        </footer>
    </div>
  )
}

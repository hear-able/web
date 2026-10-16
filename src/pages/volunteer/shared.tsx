import { Link } from 'react-router-dom'
import { CircleCheck, Clock, ListChecks, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, Card, DifficultyBadge, Input, Textarea } from '../../components/ui'
import type { CreatedModule } from '../../lib/api'
import { LIMITS } from './form'
import type { ModuleMeta } from './form'

export function PageHeader({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-teal-600 shadow-sm ring-1 ring-teal-100">{icon}</span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        <p className="mt-1 text-muted">{children}</p>
      </div>
    </div>
  )
}

export function MetaFields({ meta, onChange, labelPlaceholder }: { meta: ModuleMeta; onChange: (m: ModuleMeta) => void; labelPlaceholder: string }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-ink">Informasi modul</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input
          label="Judul"
          value={meta.title}
          onChange={(e) => onChange({ ...meta, title: e.target.value })}
          maxLength={LIMITS.title}
          placeholder="misal: Percakapan di Pasar"
          required
        />
        <Input
          label="Label"
          value={meta.label}
          onChange={(e) => onChange({ ...meta, label: e.target.value })}
          maxLength={LIMITS.label}
          placeholder={labelPlaceholder}
          hint="Kategori singkat yang tampil di atas judul modul."
          required
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Deskripsi"
            optional
            value={meta.description}
            onChange={(e) => onChange({ ...meta, description: e.target.value })}
            maxLength={LIMITS.description}
            placeholder="Jelaskan singkat isi modul ini untuk pengguna."
          />
        </div>
      </div>
    </Card>
  )
}

export function SubmitBar({ count, noun, loading, onReset }: { count: number; noun: string; loading: boolean; onReset?: () => void }) {
  return (
    <div className="sticky bottom-4 z-10 mt-8 flex flex-col items-stretch gap-3 rounded-3xl bg-white/95 p-4 shadow-xl shadow-navy/10 ring-1 ring-teal-100 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted" aria-live="polite">
        {loading ? (
          <span className="inline-flex items-center gap-2 font-medium text-teal-700">
            <Sparkles className="size-4 animate-pulse" aria-hidden />
            AI sedang menilai tingkat kesulitan…
          </span>
        ) : (
          <>
            <span className="font-semibold text-ink">
              {count} {noun}
            </span>{' '}
            · tingkat kesulitan ditentukan AI saat dikirim
          </>
        )}
      </p>
      <div className="flex gap-2">
        {onReset && (
          <Button type="button" variant="ghost" onClick={onReset} disabled={loading}>
            Atur ulang
          </Button>
        )}
        <Button type="submit" loading={loading} className="flex-1 sm:flex-none">
          Kirim modul
        </Button>
      </div>
    </div>
  )
}

export function ResultView({ module, onAgain }: { module: CreatedModule; onAgain: () => void }) {
  const noun = module.type === 'listening' ? 'soal' : 'kalimat'
  return (
    <Card className="mx-auto max-w-xl text-center">
      <div role="status" aria-live="polite">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30">
          <CircleCheck className="size-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-ink">Modul berhasil dikirim!</h1>
        <p className="mt-2 text-muted">
          <span className="font-semibold text-ink">{module.title}</span> sudah tersedia untuk pengguna HearAble. Terima kasih!
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <DifficultyBadge level={module.difficulty} label={module.difficulty_label} />
      </div>
      {module.difficulty_explanation && (
        <p className="mx-auto mt-4 max-w-md rounded-2xl bg-teal-50 p-4 text-sm leading-relaxed text-muted">
          <span className="font-semibold text-ink">Alasan AI: </span>
          {module.difficulty_explanation}
        </p>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-teal-50 p-4">
          <dt className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <ListChecks className="size-3.5" aria-hidden />
            Jumlah {noun}
          </dt>
          <dd className="mt-1 text-xl font-bold text-teal-700">{module.item_count}</dd>
        </div>
        <div className="rounded-2xl bg-teal-50 p-4">
          <dt className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden />
            Perkiraan durasi
          </dt>
          <dd className="mt-1 text-xl font-bold text-teal-700">{module.estimated_minutes} menit</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onAgain}>Buat modul lain</Button>
        <Link to="/relawan" className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-teal-200 hover:bg-teal-50">
          Kembali ke beranda
        </Link>
      </div>
    </Card>
  )
}

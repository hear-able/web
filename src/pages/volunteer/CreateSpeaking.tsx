import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Mic, Plus, Trash2 } from 'lucide-react'
import { Alert, Button, Card, Input } from '../../components/ui'
import { api } from '../../lib/api'
import type { CreatedModule } from '../../lib/api'
import { MetaFields, PageHeader, ResultView, SubmitBar } from './shared'
import { MAX_ITEMS, errorMessage, validateMeta } from './form'
import type { ModuleMeta } from './form'

interface Sentence {
  key: number
  text: string
  description: string
}

let nextKey = 1
const newSentence = (): Sentence => ({ key: nextKey++, text: '', description: '' })
const emptyMeta: ModuleMeta = { title: '', label: '', description: '' }

export default function CreateSpeaking() {
  const [meta, setMeta] = useState<ModuleMeta>(emptyMeta)
  const [sentences, setSentences] = useState<Sentence[]>(() => [newSentence()])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<CreatedModule | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  function update(key: number, patch: Partial<Sentence>) {
    setSentences((ss) => ss.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  }

  function reset() {
    setMeta(emptyMeta)
    setSentences([newSentence()])
    setError('')
    setCreated(null)
    window.scrollTo({ top: 0 })
  }

  function showError(message: string) {
    setError(message)
    requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const blank = sentences.findIndex((s) => !s.text.trim())
    const problem = validateMeta(meta) ?? (blank >= 0 ? `Kalimat ${blank + 1} wajib diisi.` : null)
    if (problem) {
      showError(problem)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const module = await api.createSpeakingModule({
        title: meta.title.trim(),
        label: meta.label.trim(),
        description: meta.description.trim(),
        sentences: sentences.map((s) => ({ text: s.text.trim(), description: s.description.trim() })),
      })
      setCreated(module)
      window.scrollTo({ top: 0 })
    } catch (err) {
      showError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (created) return <ResultView module={created} onAgain={reset} />

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader icon={<Mic className="size-6" aria-hidden />} title="Buat Modul Berbicara">
        Tulis kalimat yang akan diucapkan pengguna. Panduan ritme suku kata dibuat otomatis.
      </PageHeader>

      <div className="mt-8 flex flex-col gap-5">
        <MetaFields meta={meta} onChange={setMeta} labelPlaceholder="misal: Frasa Sehari-hari" />

        <Card>
          <h2 className="text-lg font-bold text-ink">Kalimat</h2>
          <ol className="mt-5 flex flex-col gap-4">
            {sentences.map((s, i) => (
              <li key={s.key} className="rounded-2xl bg-teal-50/70 p-4 ring-1 ring-teal-100">
                <div className="flex items-start gap-3">
                  <span className="mt-8 grid size-8 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-teal-700 ring-1 ring-teal-200" aria-hidden>
                    {i + 1}
                  </span>
                  <div className="grid flex-1 gap-3 sm:grid-cols-[1.4fr_1fr]">
                    <Input
                      label={`Kalimat ${i + 1}`}
                      value={s.text}
                      onChange={(e) => update(s.key, { text: e.target.value })}
                      maxLength={300}
                      placeholder="misal: Selamat pagi"
                    />
                    <Input
                      label="Keterangan"
                      optional
                      value={s.description}
                      onChange={(e) => update(s.key, { description: e.target.value })}
                      maxLength={1000}
                      placeholder="misal: Sapaan di pagi hari"
                    />
                  </div>
                  {sentences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSentences((ss) => ss.filter((x) => x.key !== s.key))}
                      aria-label={`Hapus kalimat ${i + 1}`}
                      className="mt-7 grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {sentences.length < MAX_ITEMS ? (
            <Button type="button" variant="soft" className="mt-4" onClick={() => setSentences((ss) => [...ss, newSentence()])}>
              <Plus className="size-4" aria-hidden />
              Tambah kalimat
            </Button>
          ) : (
            <p className="mt-4 text-sm text-muted">Maksimal {MAX_ITEMS} kalimat per modul.</p>
          )}
        </Card>

        <div ref={errorRef}>{error && <Alert>{error}</Alert>}</div>
      </div>

      <SubmitBar count={sentences.length} noun="kalimat" loading={submitting} />
    </form>
  )
}

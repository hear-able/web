import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Ear, FileAudio, Plus, RefreshCw, Trash2, Upload } from 'lucide-react'
import { Alert, Button, Card, Input, Textarea } from '../../components/ui'
import { cx } from '../../lib/cx'
import { api } from '../../lib/api'
import type { CreatedModule, ListeningQuestionPayload } from '../../lib/api'
import { MetaFields, PageHeader, ResultView, SubmitBar } from './shared'
import { MAX_ITEMS, errorMessage, validateMeta } from './form'
import type { ModuleMeta } from './form'

const MAX_AUDIO_BYTES = 10 * 1024 * 1024
const MIN_OPTIONS = 2
const MAX_OPTIONS = 4

type Status = 'empty' | 'transcribing' | 'ready' | 'error'

interface Option {
  text: string
  correct: boolean
}

interface Question {
  key: number
  file: File | null
  fileUrl: string | null
  status: Status
  error: string
  transcription: string
  prompt: string
  type: 'choice' | 'input'
  options: Option[]
  explanation: string
  expectedAnswer: string
}

let nextKey = 1

function newQuestion(): Question {
  return {
    key: nextKey++,
    file: null,
    fileUrl: null,
    status: 'empty',
    error: '',
    transcription: '',
    prompt: '',
    type: 'choice',
    options: [
      { text: '', correct: true },
      { text: '', correct: false },
    ],
    explanation: '',
    expectedAnswer: '',
  }
}

const emptyMeta: ModuleMeta = { title: '', label: '', description: '' }

function validateQuestion(q: Question, n: number): string | null {
  const prefix = `Soal ${n}: `
  if (!q.file) return prefix + 'unggah audio terlebih dahulu.'
  if (q.status === 'transcribing') return prefix + 'transkripsi masih diproses.'
  if (!q.transcription.trim()) return prefix + 'transkripsi wajib diisi.'
  if (!q.prompt.trim()) return prefix + 'instruksi soal wajib diisi.'
  if (q.type === 'choice') {
    if (q.options.some((o) => !o.text.trim())) return prefix + 'semua pilihan jawaban wajib diisi.'
    if (q.options.filter((o) => o.correct).length !== 1) return prefix + 'tandai tepat satu pilihan yang benar.'
  } else if (!q.expectedAnswer.trim()) {
    return prefix + 'jawaban yang diharapkan wajib diisi.'
  }
  return null
}

function toPayload(q: Question): ListeningQuestionPayload {
  const base = { prompt: q.prompt.trim(), transcription: q.transcription.trim() }
  if (q.type === 'choice') {
    return {
      ...base,
      type: 'choice',
      options: q.options.map((o) => ({ text: o.text.trim(), is_correct: o.correct })),
      answer_explanation: q.explanation.trim(),
    }
  }
  return { ...base, type: 'input', expected_answer: q.expectedAnswer.trim() }
}

interface QuestionCardProps {
  index: number
  question: Question
  canRemove: boolean
  onChange: (patch: Partial<Question>) => void
  onFile: (file: File) => void
  onRetry: () => void
  onRemove: () => void
}

function QuestionCard({ index, question: q, canRemove, onChange, onFile, onRetry, onRemove }: QuestionCardProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const n = index + 1
  const groupName = `correct-${q.key}`

  function setOption(i: number, patch: Partial<Option>) {
    onChange({ options: q.options.map((o, j) => (j === i ? { ...o, ...patch } : o)) })
  }

  function markCorrect(i: number) {
    onChange({ options: q.options.map((o, j) => ({ ...o, correct: j === i })) })
  }

  function removeOption(i: number) {
    const options = q.options.filter((_, j) => j !== i)
    if (!options.some((o) => o.correct)) options[0] = { ...options[0], correct: true }
    onChange({ options })
  }

  function setType(type: Question['type']) {
    // Prefill the expected answer with the transcription; the volunteer can edit it.
    const patch: Partial<Question> = { type }
    if (type === 'input' && !q.expectedAnswer.trim()) patch.expectedAnswer = q.transcription
    onChange(patch)
  }

  const hasAudio = q.status === 'ready' || (q.status === 'error' && q.transcription !== '')

  return (
    <Card>
      <fieldset>
        <div className="flex items-center justify-between gap-3">
          <legend className="text-lg font-bold text-ink">Soal {n}</legend>
          {canRemove && (
            <Button type="button" variant="danger" size="sm" onClick={onRemove} aria-label={`Hapus soal ${n}`}>
              <Trash2 className="size-4" aria-hidden />
              Hapus
            </Button>
          )}
        </div>

        {/* Step 1: audio */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">Audio</p>
          <input
            ref={fileInput}
            type="file"
            accept="audio/*,.m4a,.mp3,.wav,.ogg,.webm,.flac"
            className="sr-only"
            aria-label={`Pilih berkas audio untuk soal ${n}`}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFile(file)
              e.target.value = ''
            }}
          />
          {!q.file ? (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="mt-2 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/60 px-4 py-8 text-center transition hover:border-teal-500 hover:bg-teal-50"
            >
              <span className="grid size-12 place-items-center rounded-full bg-white text-teal-600 shadow-sm">
                <Upload className="size-5" aria-hidden />
              </span>
              <span className="font-semibold text-ink">Unggah berkas audio</span>
              <span className="text-xs text-muted">mp3, m4a, wav, ogg, webm, atau flac · maksimal 10 MB</span>
            </button>
          ) : (
            <div className="mt-2 rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink">
                  <FileAudio className="size-4 shrink-0 text-teal-600" aria-hidden />
                  <span className="truncate">{q.file.name}</span>
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => fileInput.current?.click()} disabled={q.status === 'transcribing'}>
                  Ganti audio
                </Button>
              </div>
              {q.fileUrl && <audio controls src={q.fileUrl} className="mt-3 w-full" aria-label={`Putar audio soal ${n}`} />}
            </div>
          )}

          <div aria-live="polite">
            {q.status === 'transcribing' && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-teal-700">
                <RefreshCw className="size-4 animate-spin" aria-hidden />
                Membuat transkripsi dari audio…
              </p>
            )}
            {q.status === 'error' && (
              <div className="mt-3 flex flex-col gap-2">
                <Alert>{q.error}</Alert>
                <Button type="button" variant="soft" size="sm" className="self-start" onClick={onRetry}>
                  <RefreshCw className="size-4" aria-hidden />
                  Coba transkripsi lagi
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 and 3: review and answer */}
        {hasAudio && (
          <div className="mt-6 flex flex-col gap-5 border-t border-teal-100 pt-6">
            <Textarea
              label="Transkripsi"
              value={q.transcription}
              onChange={(e) => onChange({ transcription: e.target.value })}
              maxLength={2000}
              hint="Dibuat otomatis dari audio. Perbaiki jika ada kata yang kurang tepat."
            />
            <Textarea
              label="Instruksi soal"
              value={q.prompt}
              onChange={(e) => onChange({ prompt: e.target.value })}
              maxLength={300}
              className="min-h-16"
              hint="Perintah yang dibaca pengguna sebelum mendengarkan audio. Disarankan oleh AI, boleh diubah."
            />

            <div>
              <p id={`type-${q.key}`} className="text-sm font-semibold text-ink">
                Jenis jawaban
              </p>
              <div role="radiogroup" aria-labelledby={`type-${q.key}`} className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-teal-50 p-1">
                {(
                  [
                    ['choice', 'Pilihan ganda'],
                    ['input', 'Isian'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={q.type === value}
                    onClick={() => setType(value)}
                    className={cx(
                      'rounded-xl py-2.5 text-sm font-semibold transition',
                      q.type === value ? 'bg-white text-teal-700 shadow-sm ring-1 ring-teal-200' : 'text-muted hover:text-ink',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {q.type === 'choice' ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted">Isi pilihan jawaban dan tandai satu yang benar.</p>
                {q.options.map((o, i) => (
                  <div key={i} className={cx('flex items-center gap-3 rounded-2xl p-2 pl-3 ring-1', o.correct ? 'bg-teal-100/70 ring-teal-300' : 'bg-white ring-teal-100')}>
                    <input
                      type="radio"
                      name={groupName}
                      checked={o.correct}
                      onChange={() => markCorrect(i)}
                      className="size-5 shrink-0 accent-teal-500"
                      aria-label={`Tandai pilihan ${i + 1} sebagai jawaban benar`}
                    />
                    <input
                      value={o.text}
                      onChange={(e) => setOption(i, { text: e.target.value })}
                      maxLength={300}
                      placeholder={`Pilihan ${i + 1}`}
                      aria-label={`Teks pilihan ${i + 1}`}
                      className="min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-2 py-2 text-[15px] focus:border-teal-300 focus:bg-white focus:outline-none"
                    />
                    {o.correct && <span className="hidden text-xs font-semibold text-teal-700 sm:inline">Benar</span>}
                    {q.options.length > MIN_OPTIONS && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        aria-label={`Hapus pilihan ${i + 1}`}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    )}
                  </div>
                ))}
                {q.options.length < MAX_OPTIONS && (
                  <Button type="button" variant="soft" size="sm" className="self-start" onClick={() => onChange({ options: [...q.options, { text: '', correct: false }] })}>
                    <Plus className="size-4" aria-hidden />
                    Tambah pilihan
                  </Button>
                )}
                <Textarea
                  label="Penjelasan jawaban"
                  optional
                  value={q.explanation}
                  onChange={(e) => onChange({ explanation: e.target.value })}
                  maxLength={2000}
                  className="min-h-16"
                  hint="Ditampilkan kepada pengguna setelah menjawab."
                />
              </div>
            ) : (
              <Input
                label="Jawaban yang diharapkan"
                value={q.expectedAnswer}
                onChange={(e) => onChange({ expectedAnswer: e.target.value })}
                maxLength={2000}
                hint="AI membandingkan jawaban pengguna dengan teks ini dan menerima parafrase."
              />
            )}
          </div>
        )}
      </fieldset>
    </Card>
  )
}

export default function CreateListening() {
  const [meta, setMeta] = useState<ModuleMeta>(emptyMeta)
  const [questions, setQuestions] = useState<Question[]>(() => [newQuestion()])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<CreatedModule | null>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Keep a live list of object URLs so they are revoked on unmount.
  const urls = useRef(new Set<string>())
  useEffect(() => {
    const set = urls.current
    return () => set.forEach((u) => URL.revokeObjectURL(u))
  }, [])

  function update(key: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q)))
  }

  async function transcribe(key: number, file: File) {
    update(key, { status: 'transcribing', error: '' })
    try {
      const res = await api.transcribe(file)
      setQuestions((qs) =>
        qs.map((q) => (q.key === key && q.file === file ? { ...q, status: 'ready', transcription: res.transcription, prompt: res.prompt } : q)),
      )
    } catch (err) {
      setQuestions((qs) => qs.map((q) => (q.key === key && q.file === file ? { ...q, status: 'error', error: errorMessage(err) } : q)))
    }
  }

  function selectFile(key: number, file: File) {
    if (file.size > MAX_AUDIO_BYTES) {
      update(key, { status: 'error', error: 'Ukuran audio maksimal 10 MB.', file: null, fileUrl: null, transcription: '' })
      return
    }
    const old = questions.find((q) => q.key === key)?.fileUrl
    if (old) {
      URL.revokeObjectURL(old)
      urls.current.delete(old)
    }
    const fileUrl = URL.createObjectURL(file)
    urls.current.add(fileUrl)
    update(key, { file, fileUrl, transcription: '', prompt: '' })
    void transcribe(key, file)
  }

  function removeQuestion(key: number) {
    const url = questions.find((q) => q.key === key)?.fileUrl
    if (url) {
      URL.revokeObjectURL(url)
      urls.current.delete(url)
    }
    setQuestions((qs) => qs.filter((q) => q.key !== key))
  }

  function reset() {
    urls.current.forEach((u) => URL.revokeObjectURL(u))
    urls.current.clear()
    setMeta(emptyMeta)
    setQuestions([newQuestion()])
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
    const problem = validateMeta(meta) ?? questions.map((q, i) => validateQuestion(q, i + 1)).find(Boolean) ?? null
    if (problem) {
      showError(problem)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const module = await api.createListeningModule(
        { title: meta.title.trim(), label: meta.label.trim(), description: meta.description.trim(), questions: questions.map(toPayload) },
        questions.map((q) => q.file as File),
      )
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
      <PageHeader icon={<Ear className="size-6" aria-hidden />} title="Buat Modul Mendengar">
        Unggah audio untuk setiap soal. Kami akan membuat transkripsinya, lalu kamu bisa memeriksa dan memperbaikinya.
      </PageHeader>

      <div className="mt-8 flex flex-col gap-5">
        <MetaFields meta={meta} onChange={setMeta} labelPlaceholder="misal: Suara Sekitar" />

        {questions.map((q, i) => (
          <QuestionCard
            key={q.key}
            index={i}
            question={q}
            canRemove={questions.length > 1}
            onChange={(patch) => update(q.key, patch)}
            onFile={(file) => selectFile(q.key, file)}
            onRetry={() => q.file && void transcribe(q.key, q.file)}
            onRemove={() => removeQuestion(q.key)}
          />
        ))}

        {questions.length < MAX_ITEMS ? (
          <button
            type="button"
            onClick={() => setQuestions((qs) => [...qs, newQuestion()])}
            className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-teal-200 py-5 font-semibold text-teal-700 transition hover:border-teal-500 hover:bg-white"
          >
            <Plus className="size-5" aria-hidden />
            Tambah soal
          </button>
        ) : (
          <p className="text-center text-sm text-muted">Maksimal {MAX_ITEMS} soal per modul.</p>
        )}

        <div ref={errorRef}>{error && <Alert>{error}</Alert>}</div>
      </div>

      <SubmitBar count={questions.length} noun="soal" loading={submitting} />
    </form>
  )
}

import { forwardRef, useId } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import logo from '../assets/logo.png'
import { cx } from '../lib/cx'

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" className={cx('inline-flex items-center gap-2 rounded-lg font-extrabold tracking-tight text-navy', className)}>
      <img src={logo} alt="" className="h-8 w-auto" />
      <span className="text-lg">HearAble</span>
    </Link>
  )
}

type Variant = 'primary' | 'dark' | 'soft' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary: 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm shadow-teal-500/30',
  dark: 'bg-navy text-white hover:bg-navy-700 shadow-sm',
  soft: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
  ghost: 'bg-white text-ink ring-1 ring-teal-200 hover:bg-teal-50',
  danger: 'bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-50',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  size?: 'md' | 'lg' | 'sm'
}

export function Button({ variant = 'primary', loading, size = 'md', className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        size === 'lg' && 'px-6 py-3.5 text-base',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'sm' && 'px-3.5 py-1.5 text-sm',
        variants[variant],
        className,
      )}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

interface FieldShellProps {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: (id: string, describedBy: string | undefined) => ReactNode
}

function FieldShell({ label, hint, error, optional, children }: FieldShellProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {optional && <span className="text-xs text-muted">Opsional</span>}
      </div>
      {children(id, describedBy)}
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

const controlClass =
  'w-full rounded-2xl border border-teal-200 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-3 focus:ring-teal-500/20 disabled:bg-slate-50'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, hint, error, optional, className, ...rest }, ref) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional}>
      {(id, describedBy) => (
        <input ref={ref} id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined} className={cx(controlClass, className)} {...rest} />
      )}
    </FieldShell>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

export function Textarea({ label, hint, error, optional, className, ...rest }: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional}>
      {(id, describedBy) => (
        <textarea id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined} className={cx(controlClass, 'min-h-24 resize-y leading-relaxed', className)} {...rest} />
      )}
    </FieldShell>
  )
}

export function Alert({ children, tone = 'error' }: { children: ReactNode; tone?: 'error' | 'info' }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx(
        'rounded-2xl px-4 py-3 text-sm',
        tone === 'error' ? 'bg-red-50 text-red-800 ring-1 ring-red-200' : 'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
      )}
    >
      {children}
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-3xl bg-white p-5 shadow-sm ring-1 ring-teal-100 sm:p-7', className)}>{children}</div>
}

const difficultyStyles: Record<number, string> = {
  1: 'bg-teal-100 text-teal-700',
  2: 'bg-sky-100 text-sky-800',
  3: 'bg-sun-100 text-amber-800',
  4: 'bg-rose-100 text-rose-800',
}

export function DifficultyBadge({ level, label }: { level: number; label: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold', difficultyStyles[level])}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={cx('h-3 w-1.5 rounded-full', n <= level ? 'bg-current' : 'bg-current opacity-20')} />
        ))}
      </span>
      Level {level} · {label}
    </span>
  )
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

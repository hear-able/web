import { cx } from '../lib/cx'

interface PhoneProps {
  src: string
  alt: string
  className?: string
}

/** A simple device frame around an app screenshot. */
export function Phone({ src, alt, className }: PhoneProps) {
  return (
    <div className={cx('relative rounded-[2.4rem] bg-ink p-[7px] shadow-2xl shadow-navy/25 ring-1 ring-black/10', className)}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-teal-50">
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
      </div>
    </div>
  )
}

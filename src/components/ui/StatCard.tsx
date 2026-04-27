import { type LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: LucideIcon
  num?: string
  alert?: boolean
  className?: string
}

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  num,
  alert,
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        'n-card px-5 py-4 flex flex-col gap-3 animate-fadeIn',
        alert && 'border-white/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-4">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {num && (
            <span className="font-mono text-[9px] tracking-[0.1em] text-ink-6">{num}</span>
          )}
          {Icon && <Icon size={12} className={alert ? 'text-ink-3' : 'text-ink-5'} strokeWidth={1.5} />}
        </div>
      </div>

      <div>
        <span className="font-display font-[800] text-[22pt] tracking-[-0.02em] leading-none text-white">
          {value}
        </span>
        {sub && (
          <p className="font-mono text-[10px] tracking-[0.08em] text-ink-4 mt-2">{sub}</p>
        )}
      </div>

      {alert && <div className="w-full h-[1px] bg-white/10" />}
    </div>
  )
}

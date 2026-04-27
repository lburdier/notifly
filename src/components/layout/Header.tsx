import { Search, Bell, Plus } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  sectionNum?: string
  action?: { label: string; onClick: () => void }
}

export default function Header({ title, subtitle, sectionNum, action }: HeaderProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="flex-shrink-0 border-b border-border">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border/50">
        <Search size={12} className="text-ink-5 flex-shrink-0" />
        <input
          className="n-input !border-0 !bg-transparent !p-0"
          placeholder="Quick search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button className="btn-ghost flex items-center gap-2 !py-1.5">
            <Bell size={11} />
            Alerts
          </button>
          {action && (
            <button
              onClick={action.onClick}
              className="btn-solid flex items-center gap-2 !py-1.5"
            >
              <Plus size={11} />
              {action.label}
            </button>
          )}
        </div>
      </div>

      {/* Page title */}
      <div className="flex items-baseline gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="diamond" />
          <h1 className="font-display font-[800] text-[16pt] tracking-[-0.02em] uppercase text-white leading-none">
            {title}
          </h1>
        </div>
        {subtitle && (
          <span className="font-body font-[300] text-[12px] text-ink-3">{subtitle}</span>
        )}
        {sectionNum && (
          <span className="ml-auto font-mono text-[9px] tracking-[0.2em] uppercase text-ink-6">
            {sectionNum}
          </span>
        )}
      </div>
    </div>
  )
}

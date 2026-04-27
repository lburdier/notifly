import { AlertTriangle, HardDrive, Copy, Clock, Tag, FolderX, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import ExportOptions from '../components/ui/ExportOptions'
import { formatBytes, formatDate } from '../utils/format'

const HEAVY_THRESHOLD = 50_000_000
const OLD_THRESHOLD_DAYS = 365

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export default function Analysis() {
  const { media, setMediaStatus, addToast, deleteMedia } = useStore()

  const heavy = media.filter((m) => m.sizeBytes >= HEAVY_THRESHOLD)
    .sort((a, b) => b.sizeBytes - a.sizeBytes)

  const unused = media.filter((m) => m.status === 'unused' || !m.lastUsedAt)

  const untagged = media.filter((m) => m.tags.length === 0)

  const orphaned = media.filter((m) => m.collectionIds.length === 0)

  const old = media.filter((m) => daysSince(m.createdAt) > OLD_THRESHOLD_DAYS)

  const noCollection = media.filter((m) => m.collectionIds.length === 0)

  const totalBytes = media.reduce((a, m) => a + m.sizeBytes, 0)
  const heavyBytes = heavy.reduce((a, m) => a + m.sizeBytes, 0)

  const categories = [
    {
      id: 'heavy',
      icon: HardDrive,
      label: 'Heavy Files',
      sub: `> ${formatBytes(HEAVY_THRESHOLD)} each`,
      count: heavy.length,
      items: heavy,
      action: 'Compress / Archive',
      severity: heavy.length > 3 ? 'high' : 'med',
    },
    {
      id: 'unused',
      icon: Clock,
      label: 'Unused Media',
      sub: 'No usage date recorded',
      count: unused.length,
      items: unused,
      action: 'Review / Mark to Clean',
      severity: unused.length > 5 ? 'high' : 'low',
    },
    {
      id: 'untagged',
      icon: Tag,
      label: 'Untagged Files',
      sub: 'No tags assigned',
      count: untagged.length,
      items: untagged,
      action: 'Add Tags',
      severity: untagged.length > 3 ? 'med' : 'low',
    },
    {
      id: 'orphaned',
      icon: FolderX,
      label: 'No Collection',
      sub: 'Not in any collection',
      count: orphaned.length,
      items: orphaned,
      action: 'Organize',
      severity: 'low' as const,
    },
  ]

  const sevColor = { high: 'text-white', med: 'text-ink-2', low: 'text-ink-4' }
  const sevBg = { high: 'bg-white/[0.04] border-white/20', med: 'bg-white/[0.02]', low: '' }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Analysis"
        subtitle="Media health & optimization suggestions"
        sectionNum="05 / 06"
      />

      <div className="flex-1 overflow-y-auto scroll-area p-6">
        {/* Summary bar */}
        <div className="n-card p-5 mb-6">
          <div className="sec-head">
            <span className="sec-title">
              <span className="diamond" />
              Library Health
            </span>
            <span className="sec-num">scan · {new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex gap-0">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className={`flex-1 ${i < categories.length - 1 ? 'border-r border-border' : ''} px-4 py-2`}
              >
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-6 mb-1">
                  {cat.label}
                </p>
                <p
                  className={`font-display font-[800] text-[18pt] tracking-[-0.02em] ${sevColor[cat.severity as keyof typeof sevColor]}`}
                >
                  {cat.count}
                </p>
                <p className="font-mono text-[9px] text-ink-6 mt-0.5">{cat.sub}</p>
              </div>
            ))}
          </div>

          {/* Storage efficiency */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6">
                Heavy files / Total storage
              </span>
              <span className="font-mono text-[10px] text-ink-3">
                {formatBytes(heavyBytes)} / {formatBytes(totalBytes)} ({((heavyBytes / totalBytes) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.05] w-full">
              <div
                className="h-full bg-white/60 transition-all duration-700"
                style={{ width: `${Math.min((heavyBytes / totalBytes) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category detail */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            if (cat.items.length === 0) return null

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`n-card ${sevBg[cat.severity as keyof typeof sevBg]}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Icon size={13} strokeWidth={1.5} className={sevColor[cat.severity as keyof typeof sevColor]} />
                    <span className="font-display font-[700] text-[13px] tracking-[0.06em] uppercase text-white">
                      {cat.label}
                    </span>
                    <span className="mono-chip">{cat.count} files</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn-ghost !py-1 flex items-center gap-1.5"
                      onClick={() => addToast(`${cat.action} — feature in progress`, 'info')}
                    >
                      <Zap size={9} />
                      {cat.action}
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div>
                  {cat.items.slice(0, 8).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-4 px-5 py-2.5 border-b border-border/50 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Thumb */}
                      <div className="w-8 h-8 flex-shrink-0 overflow-hidden bg-bg-card">
                        <img src={m.thumbnailPath} alt="" className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] text-ink-2 truncate">{m.filename}</p>
                        <p className="font-mono text-[9px] text-ink-6 mt-0.5">
                          {formatDate(m.createdAt)} · {m.type}
                          {m.width ? ` · ${m.width}×${m.height}` : ''}
                        </p>
                      </div>

                      {/* Size */}
                      <span className={`font-mono text-[11px] ${m.sizeBytes >= HEAVY_THRESHOLD ? 'text-white' : 'text-ink-4'}`}>
                        {formatBytes(m.sizeBytes)}
                      </span>

                      {/* Actions */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setMediaStatus(m.id, 'archived'); addToast(`${m.filename} archived`) }}
                          className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink-6 hover:text-white transition-colors border border-white/10 px-2 py-0.5 hover:border-white/30"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => { setMediaStatus(m.id, 'to_clean'); addToast(`${m.filename} marked to clean`) }}
                          className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink-6 hover:text-white transition-colors border border-white/10 px-2 py-0.5 hover:border-white/30"
                        >
                          Mark Clean
                        </button>
                      </div>
                    </div>
                  ))}
                  {cat.items.length > 8 && (
                    <div className="px-5 py-2 border-t border-border/50">
                      <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-6">
                        + {cat.items.length - 8} more files
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {categories.every((c) => c.items.length === 0) && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="flex items-center gap-2">
                <span className="dot-pulse" />
                <span className="diamond-solid" />
              </div>
              <p className="font-display font-[700] text-[14px] tracking-[0.08em] uppercase text-ink-4">
                Library is clean
              </p>
              <p className="font-mono text-[10px] tracking-[0.1em] text-ink-6">
                No issues detected in your media library
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="n-card p-5 mt-4">
          <div className="sec-head">
            <span className="sec-title">
              <span className="diamond" />
              Recommendations
            </span>
          </div>

          <div className="space-y-0">
            {[
              heavy.length > 0 && {
                label: `Compress ${heavy.length} heavy files`,
                detail: `Could save up to ${formatBytes(heavy.reduce((a, m) => a + m.sizeBytes * 0.4, 0))} with lossy compression`,
                tag: 'optimize',
              },
              untagged.length > 0 && {
                label: `Tag ${untagged.length} untagged files`,
                detail: 'Better organization improves discoverability and workflow',
                tag: 'organize',
              },
              unused.length > 0 && {
                label: `Review ${unused.length} unused media`,
                detail: 'Delete or archive media not used in any project',
                tag: 'clean',
              },
              old.length > 0 && {
                label: `Archive ${old.length} old files (> 1 year)`,
                detail: 'Move to cold storage or dedicated archive collection',
                tag: 'archive',
              },
            ].filter(Boolean).map((rec: any, i: number) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-border/50 last:border-0">
                <span className="diamond mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-[10px] text-ink-2">{rec.label}</p>
                  <p className="font-mono text-[9px] text-ink-6 mt-0.5">{rec.detail}</p>
                </div>
                <span className="tag-pill">{rec.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Analysis Report */}
        <div className="mt-6">
          <ExportOptions mode="media" title="Analysis Report" />
        </div>
      </div>
    </div>
  )
}

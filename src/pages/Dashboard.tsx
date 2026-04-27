import {
  Images,
  Video,
  FolderOpen,
  Heart,
  HardDrive,
  AlertTriangle,
  Archive,
  Clock,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import StatCard from '../components/ui/StatCard'
import ExportOptions from '../components/ui/ExportOptions'
import { formatBytes, formatDate, platformLabel } from '../utils/format'
import { useNavigate } from 'react-router-dom'

const HEAVY_THRESHOLD = 50_000_000

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

export default function Dashboard() {
  const { media, collections, archives } = useStore()
  const navigate = useNavigate()

  const images = media.filter((m) => m.type === 'image')
  const videos = media.filter((m) => m.type === 'video')
  const favorites = media.filter((m) => m.isFavorite)
  const heavy = media.filter((m) => m.sizeBytes >= HEAVY_THRESHOLD)
  const unused = media.filter((m) => m.status === 'unused' || !m.lastUsedAt)
  const totalBytes = media.reduce((a, m) => a + m.sizeBytes, 0)

  const recent = [...media]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const recentArchives = [...archives]
    .sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime())
    .slice(0, 4)

  const imageBytes = images.reduce((a, m) => a + m.sizeBytes, 0)
  const videoBytes = videos.reduce((a, m) => a + m.sizeBytes, 0)
  const otherBytes = totalBytes - imageBytes - videoBytes

  const storageSegments = totalBytes > 0
    ? [
        { label: 'Images', bytes: imageBytes, pct: (imageBytes / totalBytes) * 100 },
        { label: 'Videos', bytes: videoBytes, pct: (videoBytes / totalBytes) * 100 },
        { label: 'Other', bytes: otherBytes, pct: (otherBytes / totalBytes) * 100 },
      ]
    : [
        { label: 'Images', bytes: 0, pct: 0 },
        { label: 'Videos', bytes: 0, pct: 0 },
        { label: 'Other', bytes: 0, pct: 0 },
      ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Dashboard"
        subtitle="Overview of your creative media library"
        sectionNum="01 / 06"
      />

      <div className="flex-1 overflow-y-auto scroll-area p-6">
        {/* Stats grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'Images', value: images.length, sub: formatBytes(imageBytes), icon: Images, num: '01' },
            { label: 'Videos', value: videos.length, sub: formatBytes(videoBytes), icon: Video, num: '02' },
            { label: 'Collections', value: collections.length, sub: `${archives.length} web archives`, icon: FolderOpen, num: '03' },
            { label: 'Favorites', value: favorites.length, sub: 'starred media', icon: Heart, num: '04' },
            { label: 'Total Storage', value: formatBytes(totalBytes), sub: `${media.length} total files`, icon: HardDrive, num: '05' },
            { label: 'Heavy Files', value: heavy.length, sub: `> ${formatBytes(HEAVY_THRESHOLD)} each`, icon: AlertTriangle, num: '06', alert: heavy.length > 3 },
            { label: 'Unused Media', value: unused.length, sub: 'no status / no use', icon: Clock, num: '07', alert: unused.length > 5 },
            { label: 'Web Archives', value: archives.length, sub: 'references saved', icon: Archive, num: '08' },
          ].map((s) => (
            <motion.div key={s.label} variants={item}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Storage + recent imports */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Storage */}
          <div className="n-card p-5">
            <div className="sec-head">
              <span className="sec-title"><span className="diamond" />Storage</span>
              <span className="sec-num">breakdown</span>
            </div>

            <div className="flex h-2 mb-5 overflow-hidden gap-0.5">
              {storageSegments.map((seg) => (
                <div
                  key={seg.label}
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${seg.pct || (seg.label === 'Images' ? 100 : 0)}%`,
                    background:
                      seg.label === 'Images' ? 'rgba(255,255,255,0.75)'
                      : seg.label === 'Videos' ? 'rgba(255,255,255,0.35)'
                      : 'rgba(255,255,255,0.12)',
                    minWidth: seg.bytes > 0 ? 2 : 0,
                  }}
                />
              ))}
            </div>

            <div className="space-y-2.5">
              {storageSegments.map((seg) => (
                <div key={seg.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 flex-shrink-0"
                      style={{
                        background:
                          seg.label === 'Images' ? 'rgba(255,255,255,0.75)'
                          : seg.label === 'Videos' ? 'rgba(255,255,255,0.35)'
                          : 'rgba(255,255,255,0.12)',
                      }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-3">
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-ink-3">{seg.pct.toFixed(0)}%</span>
                    <span className="font-mono text-[10px] text-ink-5 w-14 text-right">
                      {formatBytes(seg.bytes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex justify-between">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-5">Total</span>
              <span className="font-mono text-[11px] text-white">{formatBytes(totalBytes)}</span>
            </div>
          </div>

          {/* Recent imports */}
          <div className="col-span-2 n-card p-5">
            <div className="sec-head">
              <span className="sec-title"><span className="diamond" />Recent Imports</span>
              <button
                onClick={() => navigate('/gallery')}
                className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-5 hover:text-white transition-colors"
              >
                View all →
              </button>
            </div>

            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <span className="diamond" />
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-6">
                  No media imported yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {recent.map((m) => (
                  <div key={m.id} onClick={() => navigate('/gallery')} className="group cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden bg-bg-card mb-2 relative">
                      <img src={m.thumbnailPath} alt={m.filename} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.04]" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                    </div>
                    <p className="font-mono text-[9px] text-ink-3 truncate">{m.filename}</p>
                    <p className="font-mono text-[9px] text-ink-6 mt-0.5">{formatDate(m.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alerts + Archives */}
        <div className="grid grid-cols-2 gap-6">
          {/* Pipeline alerts */}
          <div className="n-card p-5">
            <div className="sec-head">
              <span className="sec-title"><span className="diamond" />Pipeline Alerts</span>
              <span className="sec-num">status</span>
            </div>

            <div className="space-y-0">
              {heavy.length > 0 && (
                <AlertRow type="warn" label={`${heavy.length} heavy files detected`} sub={`Largest: ${formatBytes(Math.max(...heavy.map((m) => m.sizeBytes)))}`} action={() => navigate('/analysis')} actionLabel="Analyse" />
              )}
              {unused.length > 0 && (
                <AlertRow type="info" label={`${unused.length} unused or untagged media`} sub="No collection or usage recorded" action={() => navigate('/analysis')} actionLabel="Review" />
              )}
              {media.filter((m) => m.tags.length === 0).length > 0 && (
                <AlertRow type="info" label={`${media.filter((m) => m.tags.length === 0).length} files without tags`} sub="Consider tagging for better organization" action={() => navigate('/gallery')} actionLabel="Tag" />
              )}
              {media.filter((m) => m.status === 'draft').length > 0 && (
                <AlertRow type="neutral" label={`${media.filter((m) => m.status === 'draft').length} media in draft`} sub="Pending review or publication" action={() => navigate('/gallery')} actionLabel="Review" />
              )}
              {media.length === 0 && (
                <div className="flex items-center gap-3 py-3">
                  <span className="diamond-solid" />
                  <span className="font-mono text-[10px] tracking-[0.08em] text-ink-4">
                    No critical alerts — pipeline is clean
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent archives */}
          <div className="n-card p-5">
            <div className="sec-head">
              <span className="sec-title"><span className="diamond" />Web Archives</span>
              <button onClick={() => navigate('/archive')} className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-5 hover:text-white transition-colors">
                View all →
              </button>
            </div>

            {recentArchives.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <span className="diamond" />
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-6">
                  No references archived yet
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {recentArchives.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0 group cursor-pointer" onClick={() => navigate('/archive')}>
                    {a.thumbnailUrl && (
                      <div className="w-8 h-8 flex-shrink-0 overflow-hidden bg-bg-card">
                        <img src={a.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-ink-2 truncate group-hover:text-white transition-colors">
                        {a.title ?? a.url}
                      </p>
                      <p className="font-mono text-[9px] text-ink-6 mt-0.5">
                        {platformLabel(a.platform)} · {formatDate(a.archivedAt)}
                      </p>
                    </div>
                    <span className="mono-chip">{a.platform.substring(0, 2).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export & Save Options */}
        <div className="mt-6">
          <ExportOptions mode="full" title="Dashboard Report" />
        </div>
      </div>
    </div>
  )
}

function AlertRow({ type, label, sub, action, actionLabel }: {
  type: 'warn' | 'info' | 'neutral'
  label: string
  sub: string
  action: () => void
  actionLabel: string
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0">
      <div className={`w-1.5 h-1.5 flex-shrink-0 ${type === 'warn' ? 'bg-white' : type === 'info' ? 'bg-white/50' : 'bg-white/20'}`} />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] text-ink-2">{label}</p>
        <p className="font-mono text-[9px] text-ink-5 mt-0.5">{sub}</p>
      </div>
      <button onClick={action} className="font-mono text-[9px] tracking-[0.1em] uppercase text-ink-5 hover:text-white transition-colors border border-white/10 px-2 py-1 hover:border-white/30">
        {actionLabel}
      </button>
    </div>
  )
}

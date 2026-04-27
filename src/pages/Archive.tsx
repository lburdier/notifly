import { useState } from 'react'
import { Link2, Plus, Trash2, ExternalLink, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { formatDate, platformLabel } from '../utils/format'
import type { Platform } from '../types'

const PLATFORMS: Platform[] = ['artstation', 'instagram', 'pinterest', 'youtube', 'vimeo', 'behance', 'web']

const platformIcons: Record<string, string> = {
  artstation: 'AS',
  instagram: 'IG',
  pinterest: 'PT',
  youtube: 'YT',
  vimeo: 'VM',
  behance: 'BH',
  web: 'WW',
}

function detectPlatform(url: string): Platform {
  if (url.includes('artstation')) return 'artstation'
  if (url.includes('instagram')) return 'instagram'
  if (url.includes('pinterest')) return 'pinterest'
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo')) return 'vimeo'
  if (url.includes('behance')) return 'behance'
  return 'web'
}

export default function Archive() {
  const { archives, deleteArchive, addArchive, addToast } = useStore()
  const [showNew, setShowNew] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all')

  const filtered = filterPlatform === 'all'
    ? archives
    : archives.filter((a) => a.platform === filterPlatform)

  function handleAdd() {
    if (!url.trim()) return
    const platform = detectPlatform(url)
    addArchive({
      url: url.trim(),
      platform,
      title: title.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: [],
    })
    addToast(`Archived: ${platformLabel(platform)}`)
    setUrl('')
    setTitle('')
    setNotes('')
    setShowNew(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Web Archive"
        subtitle={`${archives.length} references saved`}
        sectionNum="04 / 06"
        action={{ label: 'Archive URL', onClick: () => setShowNew(true) }}
      />

      {/* New archive form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-shrink-0 border-b border-border bg-bg-secondary overflow-hidden"
          >
            <div className="px-6 py-5 space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="diamond" />
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-4">
                  Archive a URL
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Link2 size={11} className="text-ink-6 flex-shrink-0" />
                <input
                  className="n-input text-[11px] flex-1"
                  placeholder="https://www.artstation.com/artwork/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  autoFocus
                />
              </div>
              <input
                className="n-input text-[11px]"
                placeholder="Title or description (optional)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="n-input text-[11px]"
                placeholder="Personal notes (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="btn-solid !text-[10px]">
                  Save Reference
                </button>
                <button onClick={() => setShowNew(false)} className="btn-ghost !text-[10px]">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform filter */}
      <div className="flex-shrink-0 border-b border-border px-6 py-2.5 flex items-center gap-1.5">
        <button
          onClick={() => setFilterPlatform('all')}
          className={clsx(
            'font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border transition-all',
            filterPlatform === 'all'
              ? 'border-white/30 bg-white/[0.06] text-white'
              : 'border-white/10 text-ink-5 hover:text-ink-3'
          )}
        >
          All ({archives.length})
        </button>
        {PLATFORMS.map((p) => {
          const count = archives.filter((a) => a.platform === p).length
          if (count === 0) return null
          return (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={clsx(
                'font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border transition-all',
                filterPlatform === p
                  ? 'border-white/30 bg-white/[0.06] text-white'
                  : 'border-white/10 text-ink-5 hover:text-ink-3'
              )}
            >
              {platformLabel(p)} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scroll-area p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Globe size={24} className="text-ink-6" strokeWidth={1} />
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink-6">
              No archived references
            </p>
            <button onClick={() => setShowNew(true)} className="btn-ghost">
              Archive your first URL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                layout
                className="n-card overflow-hidden group animate-fadeIn"
              >
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden bg-bg-card relative">
                  {a.thumbnailUrl ? (
                    <img
                      src={a.thumbnailUrl}
                      alt={a.title ?? ''}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe size={20} className="text-ink-6" strokeWidth={1} />
                    </div>
                  )}
                  {/* Platform badge */}
                  <div className="absolute top-2 left-2">
                    <span className="mono-chip">{platformIcons[a.platform]}</span>
                  </div>
                  {/* Hover actions */}
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 bg-black/70 border border-white/20 flex items-center justify-center hover:bg-black/90 transition-colors"
                    >
                      <ExternalLink size={9} className="text-white" />
                    </a>
                    <button
                      onClick={() => { deleteArchive(a.id); addToast('Reference removed') }}
                      className="w-6 h-6 bg-black/70 border border-white/20 flex items-center justify-center hover:bg-black/90 transition-colors"
                    >
                      <Trash2 size={9} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="px-3 py-3 border-t border-border/50">
                  <p className="font-mono text-[10px] text-ink-2 leading-snug mb-1">
                    {a.title ?? 'Untitled reference'}
                  </p>
                  <p className="font-mono text-[9px] text-ink-6 truncate mb-2">{a.url}</p>

                  {a.notes && (
                    <p className="font-body font-light text-[11px] text-ink-4 italic mb-2 border-l border-white/10 pl-2">
                      {a.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-ink-6">{formatDate(a.archivedAt)}</span>
                    <span className="mono-chip">{platformLabel(a.platform)}</span>
                  </div>

                  {a.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {a.tags.map((t) => (
                        <span key={t.id} className="tag-pill">{t.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

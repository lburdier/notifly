import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, List, Heart, Trash2, Tag, FolderPlus, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import MediaCard from '../components/ui/MediaCard'
import ExportOptions from '../components/ui/ExportOptions'
import type { MediaType, MediaStatus } from '../types'

type SortKey = 'date' | 'name' | 'size' | 'rating'
type ViewMode = 'grid' | 'list'

const TYPE_FILTERS: { label: string; value: MediaType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
  { label: 'GIF', value: 'gif' },
  { label: 'Archives', value: 'archive' },
]

const STATUS_FILTERS: { label: string; value: MediaStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Review', value: 'review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
  { label: 'Unused', value: 'unused' },
]

export default function Gallery() {
  const navigate = useNavigate()
  const { media, selectedMediaIds, toggleSelectMedia, clearSelection, deleteMedia, addToast, toggleFavorite, collections, addMediaToCollection } = useStore()

  const [view, setView] = useState<ViewMode>('grid')
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all')
  const [favOnly, setFavOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('date')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...media]
    if (typeFilter !== 'all') list = list.filter((m) => m.type === typeFilter)
    if (statusFilter !== 'all') list = list.filter((m) => m.status === statusFilter)
    if (favOnly) list = list.filter((m) => m.isFavorite)
    if (search) list = list.filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()))
    list.sort((a, b) => {
      if (sort === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === 'name') return a.filename.localeCompare(b.filename)
      if (sort === 'size') return b.sizeBytes - a.sizeBytes
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })
    return list
  }, [media, typeFilter, statusFilter, favOnly, sort, search])

  const selectedCount = selectedMediaIds.length
  const detailMedia = detailId ? media.find((m) => m.id === detailId) : null

  function handleBatchDelete() {
    if (!window.confirm(`Delete ${selectedCount} selected files? This cannot be undone.`)) return
    selectedMediaIds.forEach((id) => deleteMedia(id))
    clearSelection()
    addToast(`${selectedCount} files removed from library`)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Gallery"
        subtitle={`${filtered.length} media`}
        sectionNum="02 / 06"
        action={{ label: 'Import', onClick: () => navigate('/media-upload') }}
      />

      {/* Toolbar */}
      <div className="flex-shrink-0 border-b border-border px-6 py-2.5 flex items-center gap-3 flex-wrap">
        {/* Type filters */}
        <div className="flex gap-0.5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={clsx(
                'font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border transition-all',
                typeFilter === f.value
                  ? 'border-white/30 bg-white/[0.06] text-white'
                  : 'border-white/10 text-ink-5 hover:text-ink-3 hover:border-white/20'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Favorites */}
        <button
          onClick={() => setFavOnly(!favOnly)}
          className={clsx(
            'flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border transition-all',
            favOnly
              ? 'border-white/30 bg-white/[0.06] text-white'
              : 'border-white/10 text-ink-5 hover:text-ink-3'
          )}
        >
          <Heart size={9} className={favOnly ? 'fill-white text-white' : ''} />
          Favorites
        </button>

        {/* More filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx('btn-ghost flex items-center gap-1.5 !py-1.5', showFilters && '!text-white !border-white/30')}
        >
          <SlidersHorizontal size={9} />
          Filters
        </button>

        <div className="flex-1" />

        {/* Search */}
        <input
          className="n-input !w-44 !py-1.5 text-[10px]"
          placeholder="Search filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Sort */}
        <select
          className="n-input !w-28 !py-1.5 text-[10px] cursor-pointer"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="date">By Date</option>
          <option value="name">By Name</option>
          <option value="size">By Size</option>
          <option value="rating">By Rating</option>
        </select>

        {/* View toggle */}
        <div className="flex border border-border">
          <button
            onClick={() => setView('grid')}
            className={clsx('p-2 transition-colors', view === 'grid' ? 'bg-white/[0.08] text-white' : 'text-ink-5 hover:text-ink-3')}
          >
            <Grid size={11} />
          </button>
          <button
            onClick={() => setView('list')}
            className={clsx('p-2 transition-colors border-l border-border', view === 'list' ? 'bg-white/[0.08] text-white' : 'text-ink-5 hover:text-ink-3')}
          >
            <List size={11} />
          </button>
        </div>
      </div>

      {/* Extra filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden border-b border-border bg-bg-secondary"
          >
            <div className="px-6 py-3 flex items-center gap-6">
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-6 mb-2">Status</p>
                <div className="flex gap-0.5 flex-wrap">
                  {STATUS_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={clsx(
                        'font-mono text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-all',
                        statusFilter === f.value
                          ? 'border-white/30 bg-white/[0.06] text-white'
                          : 'border-white/10 text-ink-5 hover:text-ink-3'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch action bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-shrink-0 bg-white/[0.05] border-b border-white/20 px-6 py-2.5 flex items-center gap-3"
          >
            <span className="font-mono text-[10px] tracking-[0.1em] text-white">
              {selectedCount} selected
            </span>
            <div className="flex-1" />
            <button onClick={clearSelection} className="btn-ghost flex items-center gap-1.5 !py-1">
              <X size={9} /> Deselect
            </button>
            <button
              onClick={() => { addToast(`Added ${selectedCount} files to favorites`); selectedMediaIds.forEach(toggleFavorite); clearSelection() }}
              className="btn-ghost flex items-center gap-1.5 !py-1"
            >
              <Heart size={9} /> Favorite
            </button>
            <button className="btn-ghost flex items-center gap-1.5 !py-1" onClick={() => addToast('Tag dialog — coming soon', 'info')}>
              <Tag size={9} /> Tag
            </button>
            <button className="btn-ghost flex items-center gap-1.5 !py-1" onClick={() => addToast('Add to collection — coming soon', 'info')}>
              <FolderPlus size={9} /> Add to Collection
            </button>
            <button onClick={handleBatchDelete} className="btn-ghost flex items-center gap-1.5 !py-1 !text-ink-3 hover:!text-white">
              <Trash2 size={9} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid / List */}
      <div className="flex-1 overflow-y-auto scroll-area">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="diamond" />
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink-6">
              No media matches your filters
            </p>
            <button onClick={() => { setTypeFilter('all'); setStatusFilter('all'); setFavOnly(false); setSearch('') }} className="btn-ghost">
              Clear filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="p-6">
            <div className="mb-6">
              <ExportOptions mode="media" title="Gallery Export" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((m) => (
                <MediaCard
                  key={m.id}
                  media={m}
                  selected={selectedMediaIds.includes(m.id)}
                  onSelect={() => toggleSelectMedia(m.id)}
                  onClick={() => setDetailId(m.id)}
                  view="grid"
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* List header */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-bg-secondary sticky top-0">
              <div className="w-4" />
              <div className="w-10" />
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 flex-1">Filename</span>
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 w-16">Type</span>
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 w-16 text-right">Size</span>
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 w-20 text-right">Resolution</span>
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 w-14">Status</span>
              <div className="w-5" />
            </div>
            {filtered.map((m) => (
              <MediaCard
                key={m.id}
                media={m}
                selected={selectedMediaIds.includes(m.id)}
                onSelect={() => toggleSelectMedia(m.id)}
                onClick={() => setDetailId(m.id)}
                view="list"
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {detailMedia && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setDetailId(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 h-full w-80 bg-bg-tertiary border-l border-border z-50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-4">
                  File Detail
                </span>
                <button onClick={() => setDetailId(null)} className="text-ink-5 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scroll-area">
                <div className="aspect-video overflow-hidden bg-bg-card">
                  <img
                    src={detailMedia.thumbnailPath}
                    alt={detailMedia.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="px-5 py-4 space-y-4">
                  <div>
                    <p className="font-mono text-[12px] text-white leading-snug">{detailMedia.filename}</p>
                    <p className="font-mono text-[9px] text-ink-6 mt-1">{detailMedia.originalFilename}</p>
                  </div>

                  <div className="space-y-0 border-t border-border pt-3">
                    {[
                      ['Type', detailMedia.type],
                      ['Size', `${(detailMedia.sizeBytes / 1e6).toFixed(1)} MB`],
                      detailMedia.width ? ['Resolution', `${detailMedia.width} × ${detailMedia.height}`] : null,
                      detailMedia.duration ? ['Duration', `${detailMedia.duration}s`] : null,
                      ['Status', detailMedia.status],
                      ['Rating', '★'.repeat(detailMedia.rating)],
                      ['Favorite', detailMedia.isFavorite ? 'Yes' : 'No'],
                      ['Imported', new Date(detailMedia.createdAt).toLocaleDateString()],
                    ].filter((x): x is string[] => Boolean(x)).map(([label, value]) => (
                      <div key={label as string} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-6">{label}</span>
                        <span className="font-mono text-[10px] text-ink-2">{value}</span>
                      </div>
                    ))}
                  </div>

                  {detailMedia.tags.length > 0 && (
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-6 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {detailMedia.tags.map((t) => (
                          <span key={t.id} className="tag-pill">{t.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailMedia.sourceUrl && (
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-6 mb-1.5">Source</p>
                      <p className="font-mono text-[10px] text-ink-4 break-all">{detailMedia.sourceUrl}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

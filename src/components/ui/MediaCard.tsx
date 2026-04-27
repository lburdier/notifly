import { Heart, Star, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { Media } from '../../types'
import { useStore } from '../../store/useStore'
import { formatBytes, formatDuration } from '../../utils/format'

interface MediaCardProps {
  media: Media
  selected?: boolean
  onSelect?: () => void
  onClick?: () => void
  view?: 'grid' | 'list'
}

const statusLabel: Record<string, string> = {
  draft: 'DRAFT',
  review: 'REVIEW',
  approved: 'OK',
  published: 'PUB',
  archived: 'ARCH',
  unused: 'UNUSED',
  to_clean: 'CLEAN',
}

export default function MediaCard({ media, selected, onSelect, onClick, view = 'grid' }: MediaCardProps) {
  const { toggleFavorite, addToast } = useStore()

  if (view === 'list') {
    return (
      <motion.div
        layout
        className={clsx(
          'flex items-center gap-4 px-4 py-3 border-b border-border/60 transition-colors cursor-pointer',
          selected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
        )}
        onClick={onClick}
      >
        <div
          onClick={(e) => { e.stopPropagation(); onSelect?.() }}
          className={clsx(
            'w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all',
            selected ? 'border-white bg-white' : 'border-white/20 hover:border-white/40'
          )}
        >
          {selected && <span className="w-2 h-2 bg-black" />}
        </div>

        <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-bg-card">
          <img src={media.thumbnailPath} alt={media.filename} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-ink-2 truncate">{media.filename}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {media.tags.slice(0, 2).map((t) => (
              <span key={t.id} className="tag-pill">{t.name}</span>
            ))}
          </div>
        </div>

        <span className="mono-chip">{media.type}</span>
        <span className="font-mono text-[10px] text-ink-4 w-16 text-right">{formatBytes(media.sizeBytes)}</span>
        {media.width && (
          <span className="font-mono text-[10px] text-ink-5 w-20 text-right">{media.width}×{media.height}</span>
        )}
        <span className="font-mono text-[9px] text-ink-5 w-12">{statusLabel[media.status]}</span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); addToast(media.isFavorite ? 'Removed from favorites' : 'Added to favorites') }}
        >
          <Heart size={12} className={media.isFavorite ? 'text-white fill-white' : 'text-ink-6 hover:text-ink-3'} />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className={clsx('n-card overflow-hidden cursor-pointer group animate-fadeIn', selected && 'border-white/30 bg-white/[0.04]')}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-card">
        <img
          src={media.thumbnailPath}
          alt={media.filename}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          {media.type === 'video' && (
            <span className="mono-chip flex items-center gap-1">
              <Video size={8} />
              {media.duration ? formatDuration(media.duration) : 'VIDEO'}
            </span>
          )}
          {media.type === 'gif' && <span className="mono-chip">GIF</span>}
        </div>

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(media.id); addToast(media.isFavorite ? 'Removed from favorites' : 'Added to favorites') }}
            className="w-6 h-6 bg-black/60 border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <Heart size={10} className={media.isFavorite ? 'text-white fill-white' : 'text-white'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect?.() }}
            className={clsx('w-6 h-6 border flex items-center justify-center transition-all', selected ? 'bg-white border-white' : 'bg-black/60 border-white/20 hover:bg-black/80')}
          >
            {selected && <span className="w-2.5 h-2.5 bg-black" />}
          </button>
        </div>

        {media.isFavorite && (
          <div className="absolute top-2 right-2 group-hover:opacity-0 transition-opacity">
            <Heart size={10} className="text-white fill-white" />
          </div>
        )}

        <div className="absolute bottom-2 left-2">
          <span className="mono-chip">{statusLabel[media.status]}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 border-t border-border/50">
        <p className="font-mono text-[10px] text-ink-2 truncate leading-snug">{media.filename}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[9px] text-ink-4">{formatBytes(media.sizeBytes)}</span>
          {media.width && (
            <span className="font-mono text-[9px] text-ink-5">{media.width}×{media.height}</span>
          )}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={7} className={star <= media.rating ? 'text-white fill-white' : 'text-ink-6'} />
            ))}
          </div>
        </div>
        {media.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {media.tags.slice(0, 3).map((t) => (
              <span key={t.id} className="tag-pill">{t.name}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

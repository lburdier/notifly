import { useState } from 'react'
import { Plus, FolderOpen, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import ExportOptions from '../components/ui/ExportOptions'
import { formatDate } from '../utils/format'

export default function Collections() {
  const { collections, media, addCollection, deleteCollection, addToast } = useStore()
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeCollection = activeId ? collections.find((c) => c.id === activeId) : null
  const activeMedia = activeCollection
    ? media.filter((m) => activeCollection.mediaIds.includes(m.id))
    : []

  function handleCreate() {
    if (!newName.trim()) return
    addCollection(newName.trim(), newDesc.trim() || undefined)
    addToast(`Collection "${newName}" created`)
    setNewName('')
    setNewDesc('')
    setShowNew(false)
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete collection "${name}"?`)) return
    deleteCollection(id)
    if (activeId === id) setActiveId(null)
    addToast(`Collection "${name}" deleted`)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar list */}
      <div className="w-72 flex-shrink-0 border-r border-border flex flex-col">
        <Header
          title="Collections"
          sectionNum="03 / 06"
          action={{ label: 'New', onClick: () => setShowNew(true) }}
        />

        {/* New collection form */}
        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-border bg-bg-secondary"
            >
              <div className="px-5 py-4 space-y-3">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink-6">
                  New Collection
                </p>
                <input
                  className="n-input text-[11px]"
                  placeholder="Collection name..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
                <input
                  className="n-input text-[11px]"
                  placeholder="Description (optional)..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleCreate} className="btn-solid flex-1 !text-[10px]">Create</button>
                  <button onClick={() => setShowNew(false)} className="btn-ghost !text-[10px]">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <div className="flex-1 overflow-y-auto scroll-area">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
              <span className="diamond" />
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-6 text-center">
                No collections yet
              </p>
              <button onClick={() => setShowNew(true)} className="btn-ghost">
                Create one
              </button>
            </div>
          ) : (
            <ul>
              {collections.map((c) => {
                const cover = c.coverMediaId
                  ? media.find((m) => m.id === c.coverMediaId)
                  : media.find((m) => c.mediaIds.includes(m.id))
                const active = activeId === c.id
                return (
                  <li
                    key={c.id}
                    onClick={() => setActiveId(active ? null : c.id)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-border/60 cursor-pointer group transition-colors ${
                      active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {active && <span className="absolute left-0 w-[2px] h-8 bg-white" />}
                    {/* Cover thumb */}
                    <div className="w-10 h-10 flex-shrink-0 bg-bg-card overflow-hidden">
                      {cover ? (
                        <img src={cover.thumbnailPath} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderOpen size={14} className="text-ink-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-mono text-[11px] truncate transition-colors ${active ? 'text-white' : 'text-ink-2 group-hover:text-white'}`}>
                        {c.name}
                      </p>
                      <p className="font-mono text-[9px] text-ink-6 mt-0.5">
                        {c.mediaIds.length} files · {formatDate(c.updatedAt)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.name) }}
                      className="opacity-0 group-hover:opacity-100 text-ink-6 hover:text-white transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeCollection ? (
          <>
            {/* Collection header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="diamond" />
                    <h2 className="font-display font-[800] text-[17px] tracking-[-0.02em] uppercase text-white">
                      {activeCollection.name}
                    </h2>
                  </div>
                  {activeCollection.description && (
                    <p className="font-body font-light text-[12px] text-ink-4 ml-5">
                      {activeCollection.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 ml-5">
                    <span className="mono-chip">{activeMedia.length} files</span>
                    <span className="font-mono text-[9px] text-ink-6">
                      Created {formatDate(activeCollection.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-ghost !text-[10px]"
                    onClick={() => { /* ExportOptions is now shown in the media grid */ }}
                  >
                    Export
                  </button>
                  <button onClick={() => setActiveId(null)} className="text-ink-5 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Media grid */}
            <div className="flex-1 overflow-y-auto scroll-area p-6">
              {activeMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <span className="diamond" />
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink-6">
                    Collection is empty
                  </p>
                  <p className="font-mono text-[10px] text-ink-6">
                    Add media from the Gallery
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <ExportOptions mode="collections" title={`${activeCollection.name} Collection`} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {activeMedia.map((m) => (
                      <div key={m.id} className="n-card overflow-hidden group cursor-pointer">
                        <div className="aspect-[4/3] overflow-hidden bg-bg-card">
                          <img
                            src={m.thumbnailPath}
                            alt={m.filename}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="px-3 py-2 border-t border-border/50">
                          <p className="font-mono text-[10px] text-ink-3 truncate">{m.filename}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {m.tags.slice(0, 2).map((t) => (
                              <span key={t.id} className="tag-pill">{t.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border border-white/15 rotate-45" />
              <div className="absolute inset-[6px] border border-white/10 rotate-45" />
            </div>
            <p className="font-display font-[700] text-[14px] tracking-[0.08em] uppercase text-ink-5">
              Select a collection
            </p>
            <p className="font-mono text-[10px] tracking-[0.1em] text-ink-6">
              or create a new one
            </p>
            <button onClick={() => setShowNew(true)} className="btn-ghost mt-2">
              <Plus size={10} className="inline mr-1.5" />
              New Collection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { CheckSquare, Square, Zap, Image, Instagram, FileText, Pen, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { formatBytes } from '../utils/format'

type WorkflowTab = 'artstation' | 'instagram' | 'rename' | 'watermark'

const TABS: { id: WorkflowTab; label: string; icon: typeof Zap }[] = [
  { id: 'artstation', label: 'ArtStation', icon: Image },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'rename', label: 'Rename Batch', icon: Pen },
  { id: 'watermark', label: 'Watermark', icon: RefreshCw },
]

const artstationChecklist = [
  'Select cover image (landscape, 16:9 preferred)',
  'Sort renders in presentation order',
  'Ensure all files are PNG or JPG',
  'Check resolution — min 1920px wide',
  'Verify file size — max 5MB per image',
  'Rename files to project naming convention',
  'Prepare project title and description',
  'Add relevant software tags',
  'Export clean copies to /exports folder',
  'Final quality check — no watermarks on covers',
]

const instagramChecklist = [
  'Choose format: 1:1, 4:5, or 9:16 (Reels)',
  'Verify image resolution — min 1080px',
  'Prepare carousel order (max 10 slides)',
  'Add watermark / signature',
  'Write caption draft',
  'Prepare hashtag set (max 30)',
  'Add alt-text for accessibility',
  'Schedule post time',
  'Export at correct dimensions',
  'Double-check first slide is most impactful',
]

const RENAME_PRESETS = [
  { id: 'r1', name: 'ArtStation', pattern: '{project}_{asset}_{view}_{index}.{ext}', example: 'raygun_prop_front_01.png' },
  { id: 'r2', name: 'Instagram', pattern: '{brand}_{project}_{index}.{ext}', example: 'lb_raygun_01.jpg' },
  { id: 'r3', name: 'Portfolio', pattern: '{author}_{project}_{type}_{index}.{ext}', example: 'lucasburdier_raygun_render_01.jpg' },
  { id: 'r4', name: 'Client Delivery', pattern: '{client}_{project}_delivery_v{version}.{ext}', example: 'atelier-duval_montre_delivery_v001.png' },
]

const WATERMARK_PRESETS = [
  { id: 'w1', name: 'Portfolio Subtle', text: '© Lucas Burdier', position: 'bottom-right', opacity: 40, size: 14 },
  { id: 'w2', name: 'Portfolio Strong', text: 'LUCAS BURDIER · LBURDIER.FR', position: 'bottom-left', opacity: 70, size: 12 },
  { id: 'w3', name: 'Protection', text: 'NOT FOR REDISTRIBUTION', position: 'center', opacity: 20, size: 28 },
]

export default function Workflows() {
  const { media, collections, addToast } = useStore()
  const [tab, setTab] = useState<WorkflowTab>('artstation')
  const [asChecks, setAsChecks] = useState<Record<number, boolean>>({})
  const [igChecks, setIgChecks] = useState<Record<number, boolean>>({})
  const [selectedPreset, setSelectedPreset] = useState<string>(RENAME_PRESETS[0].id)
  const [renamePrefix, setRenamePrefix] = useState('lucasburdier')
  const [renameProject, setRenameProject] = useState('project')
  const [wPreset, setWPreset] = useState<string>(WATERMARK_PRESETS[0].id)
  const [customWText, setCustomWText] = useState('')

  const selectedRename = RENAME_PRESETS.find((p) => p.id === selectedPreset)!
  const selectedWM = WATERMARK_PRESETS.find((p) => p.id === wPreset)!

  const imageMedia = media.filter((m) => m.type === 'image')
  const heavyImages = imageMedia.filter((m) => m.sizeBytes > 5_000_000)

  function toggleCheck(
    checks: Record<number, boolean>,
    setChecks: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
    i: number
  ) {
    setChecks((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  function countChecked(checks: Record<number, boolean>, len: number) {
    return Object.values(checks).filter(Boolean).length
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Workflows"
        subtitle="Production-ready pipelines"
        sectionNum="06 / 06"
      />

      {/* Tab bar */}
      <div className="flex-shrink-0 border-b border-border px-6 flex gap-0.5 py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-[0.16em] uppercase border transition-all',
              tab === id
                ? 'border-white/30 bg-white/[0.06] text-white'
                : 'border-transparent text-ink-5 hover:text-ink-3 hover:border-white/10'
            )}
          >
            <Icon size={10} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scroll-area p-6">
        <AnimatePresence mode="wait">
          {/* ARTSTATION */}
          {tab === 'artstation' && (
            <motion.div
              key="artstation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-6"
            >
              {/* Checklist */}
              <div className="col-span-2 n-card p-5">
                <div className="sec-head">
                  <span className="sec-title">
                    <span className="diamond" />
                    ArtStation Publication Checklist
                  </span>
                  <span className="sec-num">
                    {countChecked(asChecks, artstationChecklist.length)} / {artstationChecklist.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-white/[0.05] mb-4">
                  <div
                    className="h-full bg-white/60 transition-all duration-500"
                    style={{ width: `${(countChecked(asChecks, artstationChecklist.length) / artstationChecklist.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-0">
                  {artstationChecklist.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => toggleCheck(asChecks, setAsChecks, i)}
                      className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0 cursor-pointer group hover:bg-white/[0.02] transition-colors px-1"
                    >
                      {asChecks[i] ? (
                        <CheckSquare size={13} className="text-white flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square size={13} className="text-ink-6 group-hover:text-ink-4 flex-shrink-0 mt-0.5 transition-colors" />
                      )}
                      <span className={clsx(
                        'font-mono text-[11px] leading-snug transition-colors',
                        asChecks[i] ? 'text-ink-5 line-through' : 'text-ink-2 group-hover:text-white'
                      )}>
                        {item}
                      </span>
                      <span className="font-mono text-[9px] text-ink-6 ml-auto flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex gap-2">
                  <button
                    onClick={() => { setAsChecks(Object.fromEntries(artstationChecklist.map((_, i) => [i, true]))); addToast('All steps completed') }}
                    className="btn-ghost !text-[10px]"
                  >
                    Mark All
                  </button>
                  <button
                    onClick={() => setAsChecks({})}
                    className="btn-ghost !text-[10px]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => addToast('ArtStation export package prepared', 'success')}
                    className="btn-solid ml-auto !text-[10px]"
                  >
                    Prepare Export
                  </button>
                </div>
              </div>

              {/* Sidebar info */}
              <div className="space-y-4">
                <div className="n-card p-4">
                  <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-6 mb-3">
                    Library Stats
                  </p>
                  <div className="space-y-0">
                    {[
                      ['Total Images', imageMedia.length],
                      ['Approved', media.filter((m) => m.status === 'approved').length],
                      ['Published', media.filter((m) => m.status === 'published').length],
                      ['Heavy (>5MB)', heavyImages.length],
                    ].map(([label, val]) => (
                      <div key={label as string} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="font-mono text-[10px] text-ink-5">{label}</span>
                        <span className="font-mono text-[10px] text-ink-2">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="n-card p-4">
                  <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-6 mb-3">
                    Quick Actions
                  </p>
                  <div className="space-y-2">
                    {['Filter approved renders', 'Auto-rename to AS format', 'Check resolution', 'Generate description'].map((action) => (
                      <button
                        key={action}
                        onClick={() => addToast(`${action} — feature in progress`, 'info')}
                        className="w-full btn-ghost !text-[9px] !py-1.5 text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* INSTAGRAM */}
          {tab === 'instagram' && (
            <motion.div
              key="instagram"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="col-span-2 n-card p-5">
                <div className="sec-head">
                  <span className="sec-title">
                    <span className="diamond" />
                    Instagram Publication Checklist
                  </span>
                  <span className="sec-num">
                    {countChecked(igChecks, instagramChecklist.length)} / {instagramChecklist.length}
                  </span>
                </div>

                <div className="h-1 bg-white/[0.05] mb-4">
                  <div
                    className="h-full bg-white/60 transition-all duration-500"
                    style={{ width: `${(countChecked(igChecks, instagramChecklist.length) / instagramChecklist.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-0">
                  {instagramChecklist.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => toggleCheck(igChecks, setIgChecks, i)}
                      className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0 cursor-pointer group hover:bg-white/[0.02] transition-colors px-1"
                    >
                      {igChecks[i] ? (
                        <CheckSquare size={13} className="text-white flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square size={13} className="text-ink-6 group-hover:text-ink-4 flex-shrink-0 mt-0.5 transition-colors" />
                      )}
                      <span className={clsx(
                        'font-mono text-[11px] leading-snug transition-colors',
                        igChecks[i] ? 'text-ink-5 line-through' : 'text-ink-2 group-hover:text-white'
                      )}>
                        {item}
                      </span>
                      <span className="font-mono text-[9px] text-ink-6 ml-auto flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex gap-2">
                  <button onClick={() => { setIgChecks(Object.fromEntries(instagramChecklist.map((_, i) => [i, true]))); addToast('All steps completed') }} className="btn-ghost !text-[10px]">Mark All</button>
                  <button onClick={() => setIgChecks({})} className="btn-ghost !text-[10px]">Reset</button>
                  <button onClick={() => addToast('Instagram export package prepared', 'success')} className="btn-solid ml-auto !text-[10px]">Prepare Export</button>
                </div>
              </div>

              {/* Format guide */}
              <div className="n-card p-4">
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-6 mb-3">
                  Format Guide
                </p>
                <div className="space-y-3">
                  {[
                    { format: 'Square', ratio: '1 : 1', res: '1080 × 1080', icon: '▪' },
                    { format: 'Portrait', ratio: '4 : 5', res: '1080 × 1350', icon: '▪' },
                    { format: 'Story / Reel', ratio: '9 : 16', res: '1080 × 1920', icon: '▪' },
                  ].map((f) => (
                    <div key={f.format} className="border border-border/60 p-3">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-mono text-[11px] text-ink-2">{f.format}</span>
                        <span className="mono-chip">{f.ratio}</span>
                      </div>
                      <span className="font-mono text-[9px] text-ink-6">{f.res} px</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RENAME */}
          {tab === 'rename' && (
            <motion.div
              key="rename"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="n-card p-5">
                <div className="sec-head">
                  <span className="sec-title">
                    <span className="diamond" />
                    Rename Presets
                  </span>
                </div>

                <div className="space-y-1 mb-5">
                  {RENAME_PRESETS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPreset(p.id)}
                      className={clsx(
                        'flex flex-col gap-1 p-3 border cursor-pointer transition-all',
                        selectedPreset === p.id
                          ? 'border-white/30 bg-white/[0.04]'
                          : 'border-border hover:border-white/20'
                      )}
                    >
                      <div className="flex justify-between">
                        <span className="font-mono text-[11px] text-white">{p.name}</span>
                        {selectedPreset === p.id && <span className="diamond-solid" />}
                      </div>
                      <span className="font-mono text-[9px] text-ink-5">{p.pattern}</span>
                      <span className="font-mono text-[9px] text-ink-6 italic">{p.example}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 mb-1.5">
                      Author / Brand
                    </p>
                    <input
                      className="n-input text-[11px]"
                      value={renamePrefix}
                      onChange={(e) => setRenamePrefix(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 mb-1.5">
                      Project Name
                    </p>
                    <input
                      className="n-input text-[11px]"
                      value={renameProject}
                      onChange={(e) => setRenameProject(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="n-card p-5">
                <div className="sec-head">
                  <span className="sec-title">
                    <span className="diamond" />
                    Rename Preview
                  </span>
                </div>

                <div className="space-y-0 mb-4">
                  {media.slice(0, 6).map((m, i) => {
                    const newName = selectedRename.example.replace('raygun', renameProject).replace('lucasburdier', renamePrefix).replace('01', String(i + 1).padStart(2, '0'))
                    return (
                      <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
                        <span className="font-mono text-[9px] text-ink-6 w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[9px] text-ink-5 truncate line-through">{m.filename}</p>
                          <p className="font-mono text-[10px] text-white truncate mt-0.5">{newName}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => addToast(`Renamed ${Math.min(media.length, 6)} files to "${selectedRename.name}" format`, 'success')}
                  className="btn-solid w-full"
                >
                  Apply Rename to Selected
                </button>
              </div>
            </motion.div>
          )}

          {/* WATERMARK */}
          {tab === 'watermark' && (
            <motion.div
              key="watermark"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="n-card p-5">
                <div className="sec-head">
                  <span className="sec-title">
                    <span className="diamond" />
                    Watermark Presets
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  {WATERMARK_PRESETS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setWPreset(p.id)}
                      className={clsx(
                        'p-3 border cursor-pointer transition-all',
                        wPreset === p.id
                          ? 'border-white/30 bg-white/[0.04]'
                          : 'border-border hover:border-white/20'
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[11px] text-white">{p.name}</span>
                        {wPreset === p.id && <span className="diamond-solid" />}
                      </div>
                      <div className="flex gap-3">
                        <span className="font-mono text-[9px] text-ink-5">"{p.text}"</span>
                        <span className="mono-chip">{p.position}</span>
                        <span className="mono-chip">{p.opacity}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 mb-1.5">
                      Custom Text
                    </p>
                    <input
                      className="n-input text-[11px]"
                      placeholder={selectedWM.text}
                      value={customWText}
                      onChange={(e) => setCustomWText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="n-card p-5">
                <div className="sec-head">
                  <span className="sec-title">
                    <span className="diamond" />
                    Preview
                  </span>
                </div>

                <div className="aspect-video bg-bg-card relative overflow-hidden mb-4 border border-border/50">
                  <img
                    src={media[0]?.thumbnailPath}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Watermark overlay */}
                  <div
                    className={clsx(
                      'absolute font-mono text-white select-none pointer-events-none',
                      {
                        'top-2 left-2': selectedWM.position === 'top-left',
                        'top-2 right-2': selectedWM.position === 'top-right',
                        'bottom-2 left-2': selectedWM.position === 'bottom-left',
                        'bottom-2 right-2': selectedWM.position === 'bottom-right',
                        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2': selectedWM.position === 'center',
                      }
                    )}
                    style={{
                      fontSize: `${selectedWM.size}px`,
                      opacity: selectedWM.opacity / 100,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {customWText || selectedWM.text}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    ['Position', selectedWM.position],
                    ['Opacity', `${selectedWM.opacity}%`],
                    ['Size', `${selectedWM.size}px`],
                    ['Text', customWText || selectedWM.text || '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="font-mono text-[9px] text-ink-6">{label}</span>
                      <span className="font-mono text-[10px] text-ink-3 truncate max-w-[80px]">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addToast(`Watermark applied to ${media.filter(m => m.type === 'image').length} images`, 'success')}
                  className="btn-solid w-full"
                >
                  Apply to All Images
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

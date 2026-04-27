import { Download, FileText, Save, FileJson } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { 
  exportMediaToMarkdown, 
  exportCollectionsToMarkdown,
  exportToJSON,
  saveToLocalStorage 
} from '../../utils/export'
import { useEffect, useState } from 'react'

interface ExportOptionsProps {
  mode?: 'media' | 'collections' | 'analytics' | 'full'
  title?: string
  onExport?: () => void
}

export default function ExportOptions({ mode = 'full', title = 'Report', onExport }: ExportOptionsProps) {
  const { media, collections, addToast } = useStore()
  const [lastSave, setLastSave] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('notifly-last-save')
    if (saved) setLastSave(new Date(saved).toLocaleString())
  }, [])

  const handleExportMarkdown = () => {
    try {
      if (mode === 'collections') {
        exportCollectionsToMarkdown(collections, media, `${title.toLowerCase().replace(/\s+/g, '-')}-report.md`)
      } else if (mode === 'media' || mode === 'full') {
        exportMediaToMarkdown(media, title, collections)
      }
      addToast(`✓ Exported to Markdown`, 'success')
      onExport?.()
    } catch (error) {
      addToast('Failed to export Markdown', 'error')
    }
  }

  const handleExportJSON = () => {
    try {
      const exportData = {
        media,
        collections,
        exportedAt: new Date().toISOString(),
        title
      }
      exportToJSON(exportData, `${title.toLowerCase().replace(/\s+/g, '-')}-export.json`)
      addToast(`✓ Exported to JSON`, 'success')
      onExport?.()
    } catch (error) {
      addToast('Failed to export JSON', 'error')
    }
  }

  const handleSaveLocal = () => {
    try {
      const storeData = {
        media,
        collections,
        savedAt: new Date().toISOString()
      }
      const success = saveToLocalStorage(storeData)
      if (success) {
        localStorage.setItem('notifly-last-save', new Date().toISOString())
        setLastSave(new Date().toLocaleString())
        addToast(`✓ Saved locally`, 'success')
        onExport?.()
      }
    } catch (error) {
      addToast('Failed to save locally', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-b from-white/5 to-transparent rounded-lg border border-white/10">
      <div className="flex items-center gap-2 text-sm font-medium text-white/70">
        <Download size={16} />
        Export & Save Options
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm text-white/80 hover:text-white border border-white/10 hover:border-white/20"
        >
          <FileText size={16} />
          Export MD
        </button>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm text-white/80 hover:text-white border border-white/10 hover:border-white/20"
        >
          <FileJson size={16} />
          Export JSON
        </button>

        <button
          onClick={handleSaveLocal}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm text-white/80 hover:text-white border border-white/10 hover:border-white/20"
        >
          <Save size={16} />
          Save Local
        </button>
      </div>

      {lastSave && (
        <div className="text-xs text-white/50">
          Last saved: {lastSave}
        </div>
      )}
    </div>
  )
}

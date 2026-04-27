import { useRef } from 'react'
import { useStore } from '../../store/useStore'

export default function BackgroundSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { appSettings, updateAppSettings, addToast } = useStore()

  const handleBackgroundSelect = (files: FileList | null) => {
    if (!files) return

    const file = files[0]
    if (!file.type.startsWith('image')) {
      addToast('Veuillez sélectionner une image', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      updateAppSettings({ backgroundImage: base64 })
      addToast('Fond d\'écran mis à jour', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveBackground = () => {
    updateAppSettings({ backgroundImage: undefined })
    addToast('Fond d\'écran supprimé', 'success')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 block mb-3">
          Image de fond
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleBackgroundSelect(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-ghost w-full text-center"
        >
          Choisir une image
        </button>
      </div>

      {appSettings.backgroundImage && (
        <div>
          <label className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 block mb-2">
            Intensité du flou
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="20"
              value={appSettings.blurAmount}
              onChange={(e) =>
                updateAppSettings({ blurAmount: parseInt(e.target.value) })
              }
              className="flex-1 h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-white"
            />
            <span className="font-mono text-[10px] text-ink-4 w-10">
              {appSettings.blurAmount}px
            </span>
          </div>
        </div>
      )}

      {appSettings.backgroundImage && (
        <div>
          <label className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 block mb-2">
            Opacité du fond
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={appSettings.blurOpacity}
              onChange={(e) =>
                updateAppSettings({ blurOpacity: parseInt(e.target.value) })
              }
              className="flex-1 h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-white"
            />
            <span className="font-mono text-[10px] text-ink-4 w-12">
              {appSettings.blurOpacity}%
            </span>
          </div>
        </div>
      )}

      {appSettings.backgroundImage && (
        <div>
          <button onClick={handleRemoveBackground} className="btn-ghost w-full text-center text-red-400 border-red-500/30">
            Supprimer le fond
          </button>
        </div>
      )}

      {appSettings.backgroundImage && (
        <div className="p-3 bg-bg-card rounded-lg border border-border">
          <div className="text-[10px] text-ink-3 space-y-1">
            <div>✓ Fond actif avec flou de {appSettings.blurAmount}px</div>
            <div>✓ Opacité: {appSettings.blurOpacity}%</div>
            <div>✓ Les cartes ont un effet de verre</div>
          </div>
        </div>
      )}
    </div>
  )
}

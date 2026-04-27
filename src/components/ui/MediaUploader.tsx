import { useRef } from 'react'
import { useStore } from '../../store/useStore'
import type { Media } from '../../types'

export default function MediaUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addMedia, addToast } = useStore()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    for (const file of Array.from(files)) {
      try {
        // Read file as base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          
          // Determine media type
          let mediaType: 'image' | 'video' | 'gif' | 'archive' = 'image'
          if (file.type.startsWith('video')) mediaType = 'video'
          else if (file.type === 'image/gif') mediaType = 'gif'
          else if (file.type === 'application/zip' || file.type === 'application/rar') mediaType = 'archive'

          const newMedia: Omit<Media, 'id' | 'createdAt' | 'updatedAt'> = {
            filename: `${Date.now()}-${file.name}`,
            originalFilename: file.name,
            type: mediaType,
            mimeType: file.type,
            filePath: base64,
            thumbnailPath: base64,
            sizeBytes: file.size,
            rating: 0,
            isFavorite: false,
            status: 'draft',
            tags: [],
            collectionIds: [],
          }

          addMedia(newMedia)
          addToast(`Média "${file.name}" ajouté avec succès`, 'success')
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error uploading file:', error)
        addToast(`Erreur lors de l'upload de "${file.name}"`, 'error')
      }
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.gif"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-border-strong hover:bg-chip transition-all"
      >
        <div className="space-y-2">
          <div className="text-sm text-ink-3">Cliquez ou glissez des fichiers</div>
          <div className="font-mono text-[9px] text-ink-4">Images, vidéos et GIF</div>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import MediaUploader from '../components/ui/MediaUploader'

export default function MediaUpload() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Upload Media" sectionNum="06" />
      <div className="flex-1 overflow-y-auto scroll-area p-6 max-w-3xl">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="n-card p-6">
            <div className="sec-head mb-6">
              <span className="sec-title">
                <span className="diamond" />
                Upload New Media
              </span>
            </div>
            <MediaUploader />
          </div>

          {/* Info Section */}
          <div className="n-card p-5">
            <div className="space-y-3">
              <div>
                <h3 className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-4 mb-2">
                  Formats supportés
                </h3>
                <div className="font-mono text-[9px] text-ink-5 space-y-1">
                  <p>✓ Images: JPG, PNG, WebP, AVIF</p>
                  <p>✓ Vidéos: MP4, WebM, MOV</p>
                  <p>✓ Animations: GIF, WebP (animated)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/gallery')}
            className="btn-ghost w-full"
          >
            Retour à la galerie
          </button>
        </div>
      </div>
    </div>
  )
}

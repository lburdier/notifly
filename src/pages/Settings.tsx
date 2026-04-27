import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import BackgroundSettings from '../components/ui/BackgroundSettings'

export default function Settings() {
  const { addToast } = useStore()

  const sections = [
    {
      title: 'Apparence',
      num: '01',
      component: <BackgroundSettings />,
    },
    {
      title: 'Profile',
      num: '02',
      fields: [
        { label: 'Name', placeholder: 'Lucas Burdier', type: 'text' },
        { label: 'Email', placeholder: 'lucas@lburdier.fr', type: 'email' },
        { label: 'Website', placeholder: 'lburdier.fr', type: 'text' },
        { label: 'ArtStation Handle', placeholder: '/lukiproxproductions', type: 'text' },
      ],
    },
    {
      title: 'Storage',
      num: '03',
      fields: [
        { label: 'Upload Directory', placeholder: '/uploads', type: 'text' },
        { label: 'Thumbnails Directory', placeholder: '/thumbnails', type: 'text' },
        { label: 'Exports Directory', placeholder: '/exports', type: 'text' },
      ],
    },
    {
      title: 'Analysis',
      num: '04',
      fields: [
        { label: 'Heavy File Threshold (MB)', placeholder: '50', type: 'number' },
        { label: 'Old File Threshold (days)', placeholder: '365', type: 'number' },
      ],
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Settings" sectionNum="07" />
      <div className="flex-1 overflow-y-auto scroll-area p-6 max-w-2xl">
        <div className="space-y-6">
          {sections.map((sec) => (
            <div key={sec.title} className="n-card p-5">
              <div className="sec-head">
                <span className="sec-title">
                  <span className="diamond" />
                  {sec.title}
                </span>
                <span className="sec-num">{sec.num}</span>
              </div>
              {sec.component ? (
                sec.component
              ) : (
                <div className="space-y-3">
                  {sec.fields?.map((field) => (
                    <div key={field.label}>
                      <label className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink-6 block mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        className="n-input text-[11px]"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* About */}
          <div className="n-card p-5">
            <div className="sec-head">
              <span className="sec-title">
                <span className="diamond" />
                About Notifly
              </span>
            </div>
            <div className="space-y-0">
              {[
                ['Version', '0.1.0 MVP'],
                ['Build', '2026.04.27'],
                ['Engine', 'React 18 · TypeScript · Zustand'],
                ['Storage', 'Local · SQLite (planned)'],
                ['License', 'Personal use'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-border/50 last:border-0">
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-6">{label}</span>
                  <span className="font-mono text-[10px] text-ink-3">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => addToast('Settings saved', 'success')}
              className="btn-solid"
            >
              Save Settings
            </button>
            <button
              onClick={() => addToast('Settings reset to defaults')}
              className="btn-ghost"
            >
              Reset Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

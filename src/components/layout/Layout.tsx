import { Outlet } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import Sidebar from './Sidebar'
import ToastStack from '../ui/ToastStack'

export default function Layout() {
  const { appSettings } = useStore()

  return (
    <div
      className="relative flex h-screen overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Background layer — sits below all content via z-index: -1 in this stacking context */}
      <div className="absolute inset-0" style={{ zIndex: -1 }}>
        {appSettings.backgroundImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${appSettings.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${appSettings.blurAmount}px)`,
              // scale(1.1) pushes blur-clipped edges outside the visible area
              transform: 'scale(1.1)',
              transformOrigin: 'center center',
              opacity: appSettings.blurOpacity / 100,
            }}
          />
        )}
        {/* Dark veil — always present so UI stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: appSettings.backgroundImage ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,1)' }}
        />
      </div>

      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
      <ToastStack />
    </div>
  )
}

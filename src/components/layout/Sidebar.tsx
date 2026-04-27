import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Images,
  FolderOpen,
  Archive,
  BarChart2,
  Workflow,
  Settings,
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import clsx from 'clsx'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', num: '01' },
  { to: '/gallery', icon: Images, label: 'Gallery', num: '02' },
  { to: '/collections', icon: FolderOpen, label: 'Collections', num: '03' },
  { to: '/archive', icon: Archive, label: 'Web Archive', num: '04' },
  { to: '/analysis', icon: BarChart2, label: 'Analysis', num: '05' },
  { to: '/workflows', icon: Workflow, label: 'Workflows', num: '06' },
]

export default function Sidebar() {
  const { media, collections } = useStore()
  const location = useLocation()

  const totalBytes = media.reduce((a, m) => a + m.sizeBytes, 0)
  const gbUsed = (totalBytes / 1e9).toFixed(1)

  return (
    <aside className="w-[210px] flex-shrink-0 border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 relative flex-shrink-0">
            <div className="absolute inset-0 border border-white/30 rotate-45" />
            <div className="absolute inset-[4px] bg-white rotate-45" />
          </div>
          <span className="font-display font-[800] text-[12px] tracking-[0.1em] uppercase text-white">
            Notifly
          </span>
        </div>
        <p className="font-mono text-[9px] tracking-[0.18em] text-ink-5 uppercase mt-1.5">
          Creative Media OS
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto scroll-area">
        <ul className="space-y-0.5 px-3">
          {nav.map(({ to, icon: Icon, label, num }) => {
            const active =
              to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to)
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 transition-all duration-150 group relative',
                    active
                      ? 'bg-white/[0.06] text-white'
                      : 'text-ink-3 hover:text-white hover:bg-white/[0.03]'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-white" />
                  )}
                  <Icon
                    size={14}
                    strokeWidth={active ? 2 : 1.5}
                    className={active ? 'text-white' : 'text-ink-4 group-hover:text-white'}
                  />
                  <span
                    className={clsx(
                      'font-mono text-[10px] tracking-[0.14em] uppercase flex-1',
                      active ? 'text-white' : 'text-ink-3 group-hover:text-white'
                    )}
                  >
                    {label}
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.1em] text-ink-6">
                    {num}
                  </span>
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="mx-3 my-3 border-t border-border" />

        <ul className="px-3">
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 transition-all duration-150 group relative',
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-ink-3 hover:text-white hover:bg-white/[0.03]'
                )
              }
            >
              <Settings size={14} strokeWidth={1.5} className="text-ink-4 group-hover:text-white" />
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-inherit flex-1">
                Settings
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Storage bar */}
      <div className="px-4 py-4 border-t border-border flex-shrink-0">
        <div className="flex justify-between items-baseline mb-2">
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-5">
            Storage
          </span>
          <span className="font-mono text-[9px] tracking-[0.08em] text-ink-3">
            {gbUsed} GB
          </span>
        </div>
        <div className="h-[2px] bg-white/[0.06] w-full">
          <div
            className="h-full bg-white/50 transition-all duration-500"
            style={{ width: `${Math.min((Number(gbUsed) / 50) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[9px] text-ink-6">{media.length} files</span>
          <span className="font-mono text-[9px] text-ink-6">{collections.length} col.</span>
        </div>
      </div>

      {/* Footer pulse */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-2.5">
        <span className="dot-pulse" />
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-6">
          v0.1.0 · MVP
        </span>
      </div>
    </aside>
  )
}

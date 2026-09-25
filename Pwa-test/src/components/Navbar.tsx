import type { View } from '../types'

const items: { id: View; label: string; icon: string }[] = [
  { id: 'gallery', label: 'Photos', icon: '▣' },
  { id: 'feed', label: 'Feed', icon: '☰' },
  { id: 'people', label: 'People', icon: '☺' },
]

type NavbarProps = {
  view: View
  onView: (view: View) => void
  online: boolean
}

export function Navbar({ view, onView, online }: NavbarProps) {
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <strong>Lens</strong>
            <span className="brand-sub">mini app</span>
          </div>
        </div>

        <nav className="top-nav" aria-label="Primary">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? 'nav-chip active' : 'nav-chip'}
              onClick={() => onView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <span className={online ? 'status on' : 'status off'}>
            {online ? 'Live' : 'Offline'}
          </span>
        </div>
      </header>

      <nav className="bottom-nav" aria-label="App tabs">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'tab active' : 'tab'}
            onClick={() => onView(item.id)}
          >
            <span className="tab-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  )
}

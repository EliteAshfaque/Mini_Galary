import { useState } from 'react'
import { InstallBanner } from './components/InstallBanner'
import { Navbar } from './components/Navbar'
import { OfflineBanner } from './components/OfflineBanner'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { useOnline } from './hooks/useOnline'
import { Feed } from './pages/Feed'
import { Gallery } from './pages/Gallery'
import { People } from './pages/People'
import { PhotoDetail } from './pages/PhotoDetail'
import type { Photo, View } from './types'

function viewFromUrl(): View {
  const value = new URLSearchParams(window.location.search).get('view')
  if (value === 'feed' || value === 'people' || value === 'gallery') return value
  return 'gallery'
}

export default function App() {
  const [view, setView] = useState<View>(viewFromUrl)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const online = useOnline()
  const install = useInstallPrompt()

  function openView(next: View) {
    setPhoto(null)
    setView(next)
    const url = new URL(window.location.href)
    url.searchParams.set('view', next)
    url.searchParams.delete('photo')
    window.history.replaceState({}, '', url)
  }

  return (
    <div className="app">
      <Navbar
        view={view}
        onView={openView}
        online={online}
        canInstall={install.canInstall}
        installed={install.installed}
        onInstall={() => void install.install()}
      />
      {!online ? <OfflineBanner /> : null}
      {install.canInstall && !install.installed ? (
        <InstallBanner
          ios={install.ios}
          showIosHelp={install.showIosHelp}
          onInstall={() => void install.install()}
          onDismissHelp={install.hideIosHelp}
        />
      ) : null}

      <main className="content">
        {photo ? (
          <PhotoDetail photo={photo} onBack={() => setPhoto(null)} />
        ) : view === 'gallery' ? (
          <Gallery onOpen={setPhoto} />
        ) : view === 'feed' ? (
          <Feed />
        ) : (
          <People />
        )}
      </main>
    </div>
  )
}

import { useState } from 'react'
import { IosInstallSheet } from './components/IosInstallSheet'
import { Navbar } from './components/Navbar'
import { OfflineBanner } from './components/OfflineBanner'
import { UpdateBanner } from './components/UpdateBanner'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { useOnline } from './hooks/useOnline'
import { usePwaUpdate } from './hooks/usePwaUpdate'
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
  const update = usePwaUpdate()

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
      <Navbar view={view} onView={openView} online={online} />
      {!online ? <OfflineBanner /> : null}
      <UpdateBanner open={update.available} onReload={update.reload} />
      <IosInstallSheet open={install.showIosHelp} onClose={install.hideIosHelp} />

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

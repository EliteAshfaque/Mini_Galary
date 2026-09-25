import { useEffect, useState } from 'react'
import { fetchPhotos, photoThumb } from '../api'
import { ErrorState, SkeletonGrid } from '../components/States'
import type { Photo } from '../types'

type GalleryProps = {
  onOpen: (photo: Photo) => void
}

export function Gallery({ onOpen }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    setError(null)
    fetchPhotos()
      .then(setPhotos)
      .catch(() => setError('Could not load photos from the free Picsum API.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('photo')
    if (!id || photos.length === 0) return
    const match = photos.find((photo) => photo.id === id)
    if (match) onOpen(match)
  }, [photos, onOpen])

  if (loading && photos.length === 0) return <SkeletonGrid />
  if (error && photos.length === 0) return <ErrorState message={error} onRetry={load} />

  return (
    <section>
      <div className="page-head">
        <h1>Photos</h1>
        <p>Live list from picsum.photos — tap any image for details.</p>
      </div>
      <div className="photo-grid">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            className="photo-card"
            onClick={() => {
              const url = new URL(window.location.href)
              url.searchParams.set('photo', photo.id)
              window.history.replaceState({}, '', url)
              onOpen(photo)
            }}
          >
            <img
              src={photoThumb(photo.id)}
              alt={`Photo by ${photo.author}`}
              loading="lazy"
              width={400}
              height={280}
            />
            <span>{photo.author}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

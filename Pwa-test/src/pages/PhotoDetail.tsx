import { photoFull } from '../api'
import type { Photo } from '../types'

type PhotoDetailProps = {
  photo: Photo
  onBack: () => void
}

export function PhotoDetail({ photo, onBack }: PhotoDetailProps) {
  async function share() {
    const url = photo.url
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Photo by ${photo.author}`,
          text: `${photo.width}×${photo.height} on Lens`,
          url,
        })
        return
      }
      await navigator.clipboard.writeText(url)
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <article className="detail">
      <button
        type="button"
        className="back"
        onClick={() => {
          const url = new URL(window.location.href)
          url.searchParams.delete('photo')
          window.history.replaceState({}, '', url)
          onBack()
        }}
      >
        ← Photos
      </button>
      <img
        src={photoFull(photo.id)}
        alt={`Full photo by ${photo.author}`}
        width={900}
        height={640}
      />
      <div className="detail-meta">
        <h1>{photo.author}</h1>
        <p>
          {photo.width} × {photo.height} · Picsum #{photo.id}
        </p>
        <div className="detail-actions">
          <a href={photo.url} target="_blank" rel="noreferrer">
            Open source
          </a>
          <button type="button" className="install-btn" onClick={() => void share()}>
            Share
          </button>
        </div>
      </div>
    </article>
  )
}

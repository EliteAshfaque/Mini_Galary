type UpdateBannerProps = {
  open: boolean
  onReload: () => void
}

export function UpdateBanner({ open, onReload }: UpdateBannerProps) {
  if (!open) return null

  return (
    <div className="sheet update" role="status">
      <p>A new version of Lens is ready.</p>
      <button type="button" className="install-btn" onClick={onReload}>
        Update
      </button>
    </div>
  )
}

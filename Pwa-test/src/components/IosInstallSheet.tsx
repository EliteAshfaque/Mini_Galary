type IosInstallSheetProps = {
  open: boolean
  onClose: () => void
}

export function IosInstallSheet({ open, onClose }: IosInstallSheetProps) {
  if (!open) return null

  return (
    <div className="sheet" role="dialog" aria-label="Add to iPhone home screen">
      <p>
        Install Lens: tap <strong>Share</strong>, then{' '}
        <strong>Add to Home Screen</strong>.
      </p>
      <button type="button" className="text-btn" onClick={onClose}>
        Got it
      </button>
    </div>
  )
}

type InstallBannerProps = {
  ios: boolean
  showIosHelp: boolean
  onInstall: () => void
  onDismissHelp: () => void
}

export function InstallBanner({
  ios,
  showIosHelp,
  onInstall,
  onDismissHelp,
}: InstallBannerProps) {
  if (ios && showIosHelp) {
    return (
      <div className="banner help" role="dialog" aria-label="Install on iPhone">
        <p>
          On iPhone / iPad: tap <strong>Share</strong>, then{' '}
          <strong>Add to Home Screen</strong>. The app opens full-screen like a
          native mini app.
        </p>
        <button type="button" className="text-btn" onClick={onDismissHelp}>
          Got it
        </button>
      </div>
    )
  }

  if (ios) {
    return (
      <button type="button" className="banner install-hint" onClick={onInstall}>
        Add Lens to your iPhone home screen
      </button>
    )
  }

  return null
}

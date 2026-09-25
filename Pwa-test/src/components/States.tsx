export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="photo-grid">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton card-skel" />
      ))}
    </div>
  )
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="list">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton row-skel" />
      ))}
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="empty">
      <p>{message}</p>
      <button type="button" className="install-btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

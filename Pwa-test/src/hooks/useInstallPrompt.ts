import { useCallback, useEffect, useState } from 'react'

const IOS_HINT_KEY = 'lens-ios-install-hint'

function isIos(): boolean {
  const ua = navigator.userAgent
  const iOSDevice = /iPad|iPhone|iPod/.test(ua)
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iOSDevice || iPadOs
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    ('standalone' in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

export function useInstallPrompt() {
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    if (!isIos() || isStandalone() || localStorage.getItem(IOS_HINT_KEY) === '1') {
      return undefined
    }
    const timer = window.setTimeout(() => setShowIosHelp(true), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  const hideIosHelp = useCallback(() => {
    setShowIosHelp(false)
    localStorage.setItem(IOS_HINT_KEY, '1')
  }, [])

  return { showIosHelp, hideIosHelp }
}

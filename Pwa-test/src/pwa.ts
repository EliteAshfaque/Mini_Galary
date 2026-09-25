import { registerSW } from 'virtual:pwa-register'
import type { BeforeInstallPromptEvent } from './types'

type Listener = () => void

const DISMISS_KEY = 'lens-install-dismissed-at'
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000

const listeners = new Set<Listener>()
let needRefresh = false
let updateSW: (reloadPage?: boolean) => Promise<void> = async () => {}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
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

function dismissedRecently(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const at = Number(raw)
  return Number.isFinite(at) && Date.now() - at < DISMISS_MS
}

function setupAndroidInstall() {
  if (!isAndroid() || isStandalone()) return

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    const promptEvent = event as BeforeInstallPromptEvent
    if (dismissedRecently()) return

    window.setTimeout(() => {
      void promptEvent
        .prompt()
        .then(() => promptEvent.userChoice)
        .then((choice) => {
          if (choice.outcome === 'dismissed') {
            localStorage.setItem(DISMISS_KEY, String(Date.now()))
          }
        })
        .catch(() => {
          /* Chrome rejects if a prompt is already showing */
        })
    }, 1400)
  })
}

export function setupPwa() {
  setupAndroidInstall()
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      needRefresh = true
      listeners.forEach((listener) => listener())
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return
      window.setInterval(() => {
        void registration.update()
      }, 30 * 60 * 1000)
    },
  })
}

export function subscribePwaUpdate(listener: Listener) {
  listeners.add(listener)
  if (needRefresh) listener()
  return () => {
    listeners.delete(listener)
  }
}

export function applyPwaUpdate() {
  return updateSW(true)
}

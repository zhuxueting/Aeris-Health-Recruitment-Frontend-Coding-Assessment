import { useEffect } from 'react'
import styles from './toast.module.css'

export type ToastProps = {
  open: boolean
  message: string
  onClose: () => void
  durationMs?: number
}

export function Toast({ open, message, onClose, durationMs = 1800 }: ToastProps) {
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(onClose, durationMs)
    return () => window.clearTimeout(t)
  }, [open, durationMs, onClose])

  if (!open) return null
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <div className={styles.toast}>{message}</div>
    </div>
  )
}


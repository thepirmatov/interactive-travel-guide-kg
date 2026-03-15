import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service Worker: register only in production; in dev, unregister any existing SW to avoid "invalid response"
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || ''
      navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {})
    })
  } else {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister())
    })
  }
}

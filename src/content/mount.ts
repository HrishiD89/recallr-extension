import cssStr from '@/index.css?inline'


let host: HTMLDivElement | null = null
let shadow: ShadowRoot | null = null
let mountPoint: HTMLDivElement | null = null

export function mountContent(): ShadowRoot {
  if (shadow) return shadow

  console.log('[Recallr] Mounting content script')

  host = document.createElement('div')
  host.id = 'recallr-host'
  host.setAttribute('data-recallr', 'true')
  host.style.cssText =
    'display: block; position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2147483647;'
  console.log('[Recallr] Host created, appending to document')
  document.documentElement.appendChild(host)

  shadow = host.attachShadow({ mode: 'open' })
  console.log('[Recallr] Shadow root attached')

  // Inline the compiled Tailwind stylesheet into the shadow root.
  // Using ?inline avoids an external network fetch and ensures the CSS is
  // available immediately when React renders, even on first load.
  const style = document.createElement('style')
  style.textContent = cssStr
  shadow.appendChild(style)

  mountPoint = document.createElement('div')
  mountPoint.id = 'recallr-shadow-root'
  mountPoint.style.cssText =
    'display: block; position: relative; width: 100%; height: 100%; pointer-events: none;'
  shadow.appendChild(mountPoint)
  console.log('[Recallr] Mount point created and appended')

  return shadow
}

export function getMountPoint(): HTMLDivElement | null {
  return mountPoint
}

export function getShadowRoot(): ShadowRoot | null {
  return shadow
}

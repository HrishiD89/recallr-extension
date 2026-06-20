import { createRoot } from 'react-dom/client'
import { mountContent, getMountPoint } from './mount'
import { ContentRoot } from './root'

export function onExecute() {
  mountContent()
  const mount = getMountPoint()
  if (!mount) throw new Error('[Recallr] shadow mount missing')

  const root = createRoot(mount)
  root.render(<ContentRoot />)
}

import { create } from 'zustand'
import type { PanelKind } from '../types/domain'

type PanelKey = Exclude<PanelKind, null>

interface PanelState {
  open: PanelKind
  show: (k: PanelKey) => void
  close: () => void
  toggle: (k: PanelKey) => void
}

export const usePanelStore = create<PanelState>((set, get) => ({
  open: null,
  show: (k) => set({ open: k }),
  close: () => set({ open: null }),
  toggle: (k) => set({ open: get().open === k ? null : k }),
}))
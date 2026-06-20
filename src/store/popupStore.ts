import { create } from 'zustand'

export type PopupScreen = 'dashboard' | 'save' | 'chat'

interface PopupState {
  currentScreen: PopupScreen
  navigateTo: (screen: PopupScreen) => void
  back: () => void
  screenHistory: PopupScreen[]
}

export const usePopupStore = create<PopupState>((set) => ({
  currentScreen: 'dashboard',
  screenHistory: [],

  navigateTo: (screen) =>
    set((state) => ({
      screenHistory: [...state.screenHistory, state.currentScreen],
      currentScreen: screen,
    })),

  back: () =>
    set((state) => {
      const history = [...state.screenHistory]
      const previousScreen = history.pop()
      return {
        screenHistory: history,
        currentScreen: previousScreen || 'dashboard',
      }
    }),
}))

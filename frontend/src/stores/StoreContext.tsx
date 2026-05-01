import { createContext, useContext } from 'react'
import type { RootStore } from './RootStore'

export const StoreContext = createContext<RootStore | null>(null)

export function useStores() {
  const s = useContext(StoreContext)
  if (!s) throw new Error('StoreContext not provided')
  return s
}


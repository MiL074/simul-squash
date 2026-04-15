import { createContext, useContext } from 'react'

export const ConfigContext = createContext(null)

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used inside ConfigProvider')
  return ctx
}

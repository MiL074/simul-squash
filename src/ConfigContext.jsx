import { useEffect, useState } from 'react'
import { loadConfig, saveConfig, resetConfig } from './lib/storage.js'
import { ConfigContext } from './configContextObj.js'

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(() => loadConfig())

  useEffect(() => {
    saveConfig(config)
  }, [config])

  const update = (patch) =>
    setConfig((c) =>
      typeof patch === 'function' ? patch(c) : { ...c, ...patch },
    )

  const reset = () => setConfig(resetConfig())

  return (
    <ConfigContext.Provider value={{ config, setConfig, update, reset }}>
      {children}
    </ConfigContext.Provider>
  )
}

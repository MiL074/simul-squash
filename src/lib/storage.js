import { DEFAULT_CONFIG } from './sim.js'

const KEY = 'simul-squash:config:v1'
const ONBOARDED_KEY = 'simul-squash:onboarded:v1'

export function loadConfig() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT_CONFIG)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(DEFAULT_CONFIG), ...parsed }
  } catch {
    return structuredClone(DEFAULT_CONFIG)
  }
}

export function saveConfig(config) {
  try {
    localStorage.setItem(KEY, JSON.stringify(config))
  } catch {
    // ignore (quota, mode privé, etc.)
  }
}

export function resetConfig() {
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(ONBOARDED_KEY)
  } catch {
    // ignore
  }
  return structuredClone(DEFAULT_CONFIG)
}

export function isOnboarded() {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === '1'
  } catch {
    return false
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(ONBOARDED_KEY, '1')
  } catch {
    // ignore
  }
}

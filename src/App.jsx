import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'
import Onboarding from './pages/Onboarding.jsx'
import { isOnboarded } from './lib/storage.js'

export default function App() {
  const onboarded = isOnboarded()

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-semibold">simul-squash</h1>
            <span className="text-xs text-slate-400">simulateur économique pour clubs de squash</span>
          </div>
          <nav className="flex gap-1 text-sm">
            <Tab to="/dashboard">Dashboard</Tab>
            <Tab to="/parametres">Paramètres</Tab>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={onboarded ? '/dashboard' : '/onboarding'} replace />
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parametres" element={<Settings />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <span>Open source · MIT</span>
          <span>Propulsé par la communauté squash FR</span>
        </div>
      </footer>
    </div>
  )
}

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 rounded-md transition ${
          isActive
            ? 'bg-slate-800 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

import { useNavigate } from 'react-router-dom'
import { useConfig } from '../configContextObj.js'

export default function Settings() {
  const { config, update, reset } = useConfig()
  const navigate = useNavigate()

  const setPath = (path) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    update((c) => setIn(c, path, value))
  }

  const setCard = (i, key) => (e) => {
    const v = Number(e.target.value)
    update((c) => {
      const cards = [...c.pricing.cards]
      cards[i] = { ...cards[i], [key]: v }
      return { ...c, pricing: { ...c.pricing, cards } }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-baseline">
        <div>
          <h2 className="text-base font-semibold text-slate-200">Paramètres</h2>
          <p className="text-xs text-slate-500">
            Toutes les valeurs sont sauvegardées automatiquement dans ton navigateur.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/onboarding')}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Refaire le questionnaire
          </button>
          <button
            onClick={reset}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <Group title="Club">
        <Field label="Nom du club">
          <input
            type="text"
            value={config.club.name}
            onChange={setPath('club.name')}
            className={inputCls}
          />
        </Field>
        <Field label="Nombre de courts">
          <input type="number" min="1" value={config.club.nbCourts}
            onChange={setPath('club.nbCourts')} className={inputCls} />
        </Field>
        <Field label="Heures d'ouverture / jour">
          <input type="number" min="1" max="24" value={config.club.hoursOpenPerDay}
            onChange={setPath('club.hoursOpenPerDay')} className={inputCls} />
        </Field>
        <Field label="Jours d'ouverture / semaine">
          <input type="number" min="1" max="7" value={config.club.daysOpenPerWeek}
            onChange={setPath('club.daysOpenPerWeek')} className={inputCls} />
        </Field>
        <Field label="Part HC (0-1)" hint="Part des créneaux en heures creuses">
          <input type="number" step="0.05" min="0" max="1" value={config.club.hcShare}
            onChange={setPath('club.hcShare')} className={inputCls} />
        </Field>
      </Group>

      <Group title="Tarifs">
        <Field label="Durée d'un créneau (min)">
          <input type="number" min="20" max="90" value={config.pricing.sessionDurationMin}
            onChange={setPath('pricing.sessionDurationMin')} className={inputCls} />
        </Field>
        <Field label="Plein tarif HC (€)">
          <input type="number" min="0" value={config.pricing.unitPriceHC}
            onChange={setPath('pricing.unitPriceHC')} className={inputCls} />
        </Field>
        <Field label="Plein tarif HP (€)">
          <input type="number" min="0" value={config.pricing.unitPriceHP}
            onChange={setPath('pricing.unitPriceHP')} className={inputCls} />
        </Field>
      </Group>

      <Group title="Cartes d'abonnement">
        {config.pricing.cards.map((c, i) => (
          <div key={i} className="grid grid-cols-3 gap-3">
            <Field label={`${c.name} · nom`}>
              <input type="text" value={c.name}
                onChange={(e) => {
                  const v = e.target.value
                  update((cc) => {
                    const cards = [...cc.pricing.cards]
                    cards[i] = { ...cards[i], name: v }
                    return { ...cc, pricing: { ...cc.pricing, cards } }
                  })
                }}
                className={inputCls} />
            </Field>
            <Field label="Séances">
              <input type="number" min="1" value={c.nbSessions}
                onChange={setCard(i, 'nbSessions')} className={inputCls} />
            </Field>
            <Field label="Prix (€)">
              <input type="number" min="0" value={c.price}
                onChange={setCard(i, 'price')} className={inputCls} />
            </Field>
          </div>
        ))}
      </Group>

      <Group title="Coûts">
        <Field label="Coûts fixes mensuels (€)">
          <input type="number" min="0" value={config.costs.fixedMonthly}
            onChange={setPath('costs.fixedMonthly')} className={inputCls} />
        </Field>
        <Field label="Coût variable par créneau joué (€)">
          <input type="number" min="0" step="0.1" value={config.costs.variablePerSession}
            onChange={setPath('costs.variablePerSession')} className={inputCls} />
        </Field>
      </Group>
    </div>
  )
}

const inputCls =
  'w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500'

function Group({ title, children }) {
  return (
    <section className="bg-slate-800/30 border border-slate-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">{title}</h3>
      <div className="grid md:grid-cols-2 gap-3">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-slate-400 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  )
}

// Helper pour mettre à jour une valeur imbriquée via chemin "a.b.c"
function setIn(obj, path, value) {
  const keys = path.split('.')
  const next = { ...obj }
  let cur = next
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return next
}

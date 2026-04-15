import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfig } from '../configContextObj.js'
import { DEFAULT_CONFIG } from '../lib/sim.js'
import { markOnboarded } from '../lib/storage.js'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setConfig } = useConfig()
  const [draft, setDraft] = useState(() => structuredClone(DEFAULT_CONFIG))
  const [step, setStep] = useState(0)

  const set = (path, value) => setDraft((d) => setIn(d, path, value))
  const setNum = (path) => (e) => set(path, Number(e.target.value))
  const setStr = (path) => (e) => set(path, e.target.value)

  const questions = buildQuestions(draft, set, setNum, setStr)

  const finish = () => {
    setConfig(draft)
    markOnboarded()
    navigate('/dashboard')
  }

  const skip = () => {
    markOnboarded()
    navigate('/dashboard')
  }

  const isLast = step === questions.length - 1
  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs text-slate-500">
            Étape {step + 1} / {questions.length}
          </span>
          <button
            onClick={skip}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            Passer le questionnaire
          </button>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-6 min-h-[280px]">
        <h2 className="text-xl font-semibold text-white mb-1">{q.title}</h2>
        {q.hint && <p className="text-sm text-slate-400 mb-5">{q.hint}</p>}
        <div className="mt-4">{q.input}</div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-md text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Précédent
        </button>
        {isLast ? (
          <button
            onClick={finish}
            className="px-5 py-2 rounded-md text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
          >
            Voir mon dashboard →
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="px-4 py-2 rounded-md text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold"
          >
            Suivant →
          </button>
        )}
      </div>
    </div>
  )
}

// ---------- Questions ----------

function buildQuestions(d, set, setNum, setStr) {
  return [
    {
      title: 'Bienvenue sur simul-squash 👋',
      hint: 'Cet assistant te pose une dizaine de questions pour configurer ta simulation. Tu pourras tout modifier ensuite depuis l\'onglet Paramètres.',
      input: (
        <div className="text-sm text-slate-300 space-y-2">
          <p>Tu vas configurer :</p>
          <ul className="list-disc pl-5 text-slate-400 space-y-1">
            <li>Les caractéristiques de ton club (courts, horaires)</li>
            <li>Tes tarifs et formules d'abonnement</li>
            <li>Tes coûts d'exploitation</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">
            Si tu n'es pas sûr·e d'une valeur, laisse celle proposée — tu
            pourras affiner plus tard avec les sliders du dashboard.
          </p>
        </div>
      ),
    },
    {
      title: 'Comment s\'appelle ton club ?',
      input: (
        <input
          type="text"
          value={d.club.name}
          onChange={setStr('club.name')}
          placeholder="Mon club de squash"
          autoFocus
          className={inputCls}
        />
      ),
    },
    {
      title: 'Combien de courts dans ton club ?',
      hint: 'Le nombre de courts détermine la capacité totale en créneaux.',
      input: (
        <NumberInput
          value={d.club.nbCourts}
          onChange={setNum('club.nbCourts')}
          min={1}
          max={20}
          suffix="courts"
        />
      ),
    },
    {
      title: 'Combien d\'heures d\'ouverture par jour ?',
      hint: 'Ex : de 8h à 22h = 14 heures.',
      input: (
        <NumberInput
          value={d.club.hoursOpenPerDay}
          onChange={setNum('club.hoursOpenPerDay')}
          min={4}
          max={24}
          suffix="h / jour"
        />
      ),
    },
    {
      title: 'Combien de jours d\'ouverture par semaine ?',
      input: (
        <NumberInput
          value={d.club.daysOpenPerWeek}
          onChange={setNum('club.daysOpenPerWeek')}
          min={1}
          max={7}
          suffix="jours"
        />
      ),
    },
    {
      title: 'Quelle est la durée d\'un créneau ?',
      hint: 'Standard : 40 minutes (laisse le terrain libre 5 min entre deux réservations).',
      input: (
        <NumberInput
          value={d.pricing.sessionDurationMin}
          onChange={setNum('pricing.sessionDurationMin')}
          min={20}
          max={90}
          step={5}
          suffix="min"
        />
      ),
    },
    {
      title: 'Quelle part de tes créneaux est en heures creuses ?',
      hint: 'Heures creuses = matin + début d\'après-midi en semaine. Heures pleines = soir + week-end. Estimation typique : 50-65% HC.',
      input: (
        <PctSlider
          value={d.club.hcShare}
          onChange={(v) => set('club.hcShare', v)}
          leftLabel="HC"
          rightLabel="HP"
        />
      ),
    },
    {
      title: 'Quel est ton tarif plein en heures creuses ?',
      hint: 'Prix d\'un créneau réservé sans abonnement, en HC.',
      input: (
        <NumberInput
          value={d.pricing.unitPriceHC}
          onChange={setNum('pricing.unitPriceHC')}
          min={0}
          step={0.5}
          suffix="€"
        />
      ),
    },
    {
      title: 'Quel est ton tarif plein en heures pleines ?',
      input: (
        <NumberInput
          value={d.pricing.unitPriceHP}
          onChange={setNum('pricing.unitPriceHP')}
          min={0}
          step={0.5}
          suffix="€"
        />
      ),
    },
    {
      title: 'Tes cartes d\'abonnement',
      hint: 'Configure tes formules de séances prépayées. Laisse les valeurs par défaut si tu n\'en proposes pas (tu pourras désactiver leur usage depuis le dashboard).',
      input: (
        <div className="space-y-3">
          {d.pricing.cards.map((c, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <Field label="Nom">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => {
                    const v = e.target.value
                    set(
                      'pricing.cards',
                      d.pricing.cards.map((cc, j) =>
                        j === i ? { ...cc, name: v } : cc,
                      ),
                    )
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Séances">
                <input
                  type="number"
                  min="1"
                  value={c.nbSessions}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    set(
                      'pricing.cards',
                      d.pricing.cards.map((cc, j) =>
                        j === i ? { ...cc, nbSessions: v } : cc,
                      ),
                    )
                  }}
                  className={inputCls}
                />
              </Field>
              <Field label="Prix (€)">
                <input
                  type="number"
                  min="0"
                  value={c.price}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    set(
                      'pricing.cards',
                      d.pricing.cards.map((cc, j) =>
                        j === i ? { ...cc, price: v } : cc,
                      ),
                    )
                  }}
                  className={inputCls}
                />
              </Field>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tes coûts fixes mensuels',
      hint: 'Loyer + salaires + assurances + abonnements (logiciels, internet, etc.).',
      input: (
        <NumberInput
          value={d.costs.fixedMonthly}
          onChange={setNum('costs.fixedMonthly')}
          min={0}
          step={100}
          suffix="€ / mois"
        />
      ),
    },
    {
      title: 'Coût variable par créneau joué',
      hint: 'Énergie (éclairage, chauffage), nettoyage, consommables. Estimation typique : 1-3 € par créneau.',
      input: (
        <NumberInput
          value={d.costs.variablePerSession}
          onChange={setNum('costs.variablePerSession')}
          min={0}
          step={0.1}
          suffix="€ / créneau"
        />
      ),
    },
    {
      title: 'C\'est terminé 🎉',
      hint: 'Ta configuration est prête. Le dashboard te montre tes KPIs en temps réel — joue avec les sliders pour voir l\'impact de chaque levier.',
      input: (
        <div className="text-sm text-slate-300 space-y-2">
          <p>
            Tu peux à tout moment modifier ces valeurs depuis l'onglet{' '}
            <span className="text-cyan-400">Paramètres</span> ou refaire ce
            questionnaire.
          </p>
          <p className="text-xs text-slate-500 mt-3">
            💡 Les taux d'occupation (HC / HP) ne sont pas demandés ici car
            ils sont l'enjeu principal de la simulation : ajuste-les avec
            les sliders du dashboard pour explorer différents scénarios.
          </p>
        </div>
      ),
    },
  ]
}

// ---------- Helpers UI ----------

const inputCls =
  'w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500'

function NumberInput({ value, onChange, min, max, step = 1, suffix }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        autoFocus
        className={`${inputCls} w-32 text-lg font-mono`}
      />
      {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
    </div>
  )
}

function PctSlider({ value, onChange, leftLabel, rightLabel }) {
  return (
    <div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full accent-cyan-400"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>
          {leftLabel} {Math.round(value * 100)}%
        </span>
        <span>
          {rightLabel} {Math.round((1 - value) * 100)}%
        </span>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-slate-500 mb-1">{label}</span>
      {children}
    </label>
  )
}

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

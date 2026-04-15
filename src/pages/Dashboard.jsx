import { useMemo, useState } from 'react'
import { useConfig } from '../configContextObj.js'
import { simulate, formatEUR, formatNum, formatPct } from '../lib/sim.js'
import Slider from '../components/Slider.jsx'
import Kpi from '../components/Kpi.jsx'
import OccSlider from '../components/OccSlider.jsx'
import MixSlider from '../components/MixSlider.jsx'

export default function Dashboard() {
  const { config, update } = useConfig()
  const sim = useMemo(() => simulate(config), [config])

  // Verrous du MixSlider : état purement UI, pas persisté dans la config.
  const [mixLocks, setMixLocks] = useState([false, false, false, false])

  const setOccupation = ({ hc, hp }) =>
    update((c) => ({ ...c, occupation: { hc, hp } }))

  const setMix = (parts) =>
    update((c) => ({ ...c, pricing: { ...c.pricing, mix: { parts } } }))

  const setClub = (key) => (v) =>
    update((c) => ({ ...c, club: { ...c.club, [key]: v } }))

  const mixLabels = [
    ...config.pricing.cards.map((c) => c.name),
    'Plein tarif',
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-base font-semibold text-slate-200 mb-1">
          Résultats mensuels
        </h2>
        <p className="text-xs text-slate-500 mb-3">
          Simulation basée sur la configuration actuelle. Ajuste les curseurs
          ci-dessous pour voir l'impact en temps réel.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi
            label="Chiffre d'affaires"
            value={formatEUR(sim.revenue)}
            hint={`${formatNum(sim.usedTotal)} créneaux joués`}
          />
          <Kpi
            label="Résultat net"
            value={formatEUR(sim.netResult)}
            tone={sim.netResult >= 0 ? 'positive' : 'negative'}
            hint={`Marge brute ${formatEUR(sim.grossMargin)}`}
          />
          <Kpi
            label="Taux d'occupation"
            value={formatPct(sim.occupationGlobal)}
            hint={`${formatNum(sim.totalSlots)} créneaux dispos`}
          />
          <Kpi
            label="Recette / créneau"
            value={formatEUR(sim.revPerSession)}
            hint={`${formatEUR(sim.fixedCosts)} de coûts fixes`}
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">
            Occupation
          </h3>
          <OccSlider
            hc={config.occupation.hc}
            hp={config.occupation.hp}
            hcShare={config.club.hcShare}
            onChange={setOccupation}
          />
        </div>

        <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Capacité</h3>
          <Slider
            label="Nombre de courts"
            value={config.club.nbCourts}
            onChange={setClub('nbCourts')}
            min={1}
            max={12}
            step={1}
          />
          <Slider
            label="Heures d'ouverture / jour"
            value={config.club.hoursOpenPerDay}
            onChange={setClub('hoursOpenPerDay')}
            min={4}
            max={24}
            step={1}
            unit=" h"
          />
          <Slider
            label="Jours d'ouverture / semaine"
            value={config.club.daysOpenPerWeek}
            onChange={setClub('daysOpenPerWeek')}
            min={1}
            max={7}
            step={1}
          />
        </div>
      </section>

      <section className="bg-slate-800/30 border border-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Mix tarifaire
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Répartition des créneaux joués entre cartes d'abonnement et plein
          tarif. Verrouille une zone pour qu'elle ne bouge plus quand tu
          ajustes les autres.
        </p>
        <MixSlider
          parts={config.pricing.mix.parts}
          labels={mixLabels}
          locked={mixLocks}
          onParts={setMix}
          onLocked={setMixLocks}
        />
      </section>

      <section className="bg-slate-800/30 border border-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Détail mensuel
        </h3>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Item label="Créneaux HC dispos" value={formatNum(sim.slotsHC)} />
          <Item label="Créneaux HP dispos" value={formatNum(sim.slotsHP)} />
          <Item label="Créneaux HC joués" value={formatNum(sim.usedHC)} />
          <Item label="Créneaux HP joués" value={formatNum(sim.usedHP)} />
          <Item label="Coûts variables" value={formatEUR(sim.variableCosts)} />
          <Item label="Coûts fixes" value={formatEUR(sim.fixedCosts)} />
          <Item label="Coûts totaux" value={formatEUR(sim.totalCosts)} />
          <Item label="Marge brute" value={formatEUR(sim.grossMargin)} />
        </dl>
      </section>
    </div>
  )
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-200 font-mono">{value}</dd>
    </div>
  )
}

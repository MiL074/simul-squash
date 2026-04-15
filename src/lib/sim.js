// Moteur de simulation économique pour un club de squash.
// Modèle mensuel, simple et complètement paramétrable.

export const DEFAULT_CONFIG = {
  club: {
    name: 'Mon club',
    nbCourts: 4,
    hoursOpenPerDay: 14,     // ex: 8h → 22h
    daysOpenPerWeek: 7,
    hcShare: 0.6,            // part des créneaux considérés "heures creuses"
  },
  occupation: {
    hc: 0.25,                // taux d'occupation en HC
    hp: 0.75,                // taux d'occupation en HP
  },
  pricing: {
    sessionDurationMin: 40,  // durée d'un créneau (minutes)
    unitPriceHC: 14,         // € / session au plein tarif HC
    unitPriceHP: 18,         // € / session au plein tarif HP
    cards: [
      { name: 'Carte 12', nbSessions: 12, price: 144 },
      { name: 'Carte 24', nbSessions: 24, price: 264 },
      { name: 'Carte 48', nbSessions: 48, price: 480 },
    ],
    // Mix d'usage des créneaux par type de tarif.
    // parts = [C12, C24, C48, Plein Tarif], somme = 1.
    mix: {
      parts: [0.20, 0.30, 0.20, 0.30],
    },
  },
  costs: {
    fixedMonthly: 15000,       // loyer + salaires + assurances + abonnements
    variablePerSession: 1.5,   // énergie, consommables, nettoyage par créneau joué
  },
}

export function simulate(config) {
  const { club, occupation, pricing, costs } = config
  const { nbCourts, hoursOpenPerDay, daysOpenPerWeek, hcShare } = club

  const weeksPerMonth = 4.33
  const hoursPerWeek = hoursOpenPerDay * daysOpenPerWeek
  const slotsPerHour = 60 / pricing.sessionDurationMin
  const totalSlots = nbCourts * hoursPerWeek * weeksPerMonth * slotsPerHour

  const slotsHC = totalSlots * hcShare
  const slotsHP = totalSlots * (1 - hcShare)

  const usedHC = slotsHC * occupation.hc
  const usedHP = slotsHP * occupation.hp
  const usedTotal = usedHC + usedHP

  // Prix moyen au créneau selon le mix [C12, C24, C48, Plein Tarif]
  const cardRev = pricing.cards.map((c) => c.price / c.nbSessions)
  const fullPriceAvg =
    usedTotal > 0
      ? (usedHC * pricing.unitPriceHC + usedHP * pricing.unitPriceHP) / usedTotal
      : 0
  const revByTier = [...cardRev, fullPriceAvg]
  const revPerSession = pricing.mix.parts.reduce(
    (s, p, i) => s + p * (revByTier[i] ?? 0),
    0,
  )

  const revenue = usedTotal * revPerSession
  const variableCosts = usedTotal * costs.variablePerSession
  const totalCosts = costs.fixedMonthly + variableCosts
  const grossMargin = revenue - variableCosts
  const netResult = revenue - totalCosts

  return {
    totalSlots,
    slotsHC,
    slotsHP,
    usedHC,
    usedHP,
    usedTotal,
    occupationGlobal: totalSlots > 0 ? usedTotal / totalSlots : 0,
    revPerSession,
    revenue,
    variableCosts,
    fixedCosts: costs.fixedMonthly,
    totalCosts,
    grossMargin,
    netResult,
  }
}

export function formatEUR(v) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(v || 0)
}

export function formatPct(v, digits = 0) {
  return ((v || 0) * 100).toFixed(digits) + ' %'
}

export function formatNum(v, digits = 0) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: digits }).format(
    v || 0,
  )
}

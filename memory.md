# simul-squash — Mémoire projet

Ce fichier sert de point d'entrée pour reprendre le travail sur simul-squash
depuis n'importe quelle machine. Il résume la vision, les décisions
structurantes, l'état courant et les prochaines étapes.

---

## Vision

Outil open source pour **gérants, directeurs et porteurs de projet** de
clubs de squash en France. Permet de visualiser, simuler et piloter la
performance économique d'un club en fonction de paramètres que l'utilisateur
contrôle directement (pas de Notion ni de Google Sheets — tout est dans
l'app).

Cible : clubs opérationnels **et** validations de business plan pour
projets en cours. France uniquement.

---

## Décisions structurantes (validées)

| Sujet | Décision |
|---|---|
| Scope géographique | France uniquement |
| Scope métier | Squash d'abord (multi-activité plus tard) |
| Configuration | Saisie in-app (onboarding guidé + onglet Paramètres) |
| Référence UX | Sliders temps réel style scj-dashboard |
| Horizons temporels | Mensuel, annuel saisonnier, multi-années (au choix) |
| Comparaison | Jusqu'à 3 scénarios en parallèle |
| Persistance | localStorage + export/import JSON |
| Hébergement | GitHub + déploiement Vercel gratuit |
| Licence | MIT (permissive, favorise adoption communauté) |
| Branding | Neutre avec crédit discret |
| Coûts | Zéro à ce stade |

---

## Modèle de données

`Config` (racine) :
- `club` : nom, nbCourts, hoursOpenPerDay, daysOpenPerWeek, hcShare
- `occupation` : hc, hp (taux 0-1)
- `pricing` : sessionDurationMin, unitPriceHC, unitPriceHP, cards[],
  `mix.parts` = [C12, C24, C48, PT], somme = 1
- `costs` : fixedMonthly, variablePerSession

Implémenté dans `src/lib/sim.js` (DEFAULT_CONFIG + `simulate()`).

---

## Architecture actuelle

```
src/
  App.jsx                # Layout + routing (Dashboard / Paramètres)
  main.jsx               # React root + BrowserRouter + ConfigProvider
  ConfigContext.jsx      # Provider uniquement
  configContextObj.js    # Contexte + useConfig() (séparé pour fast-refresh)
  index.css              # Tailwind 4 + thème sombre
  lib/
    sim.js               # DEFAULT_CONFIG + simulate() + formatters
    storage.js           # load/save/reset config localStorage
  components/
    Slider.jsx           # Slider HTML natif avec label + valeur
    Kpi.jsx              # Carte KPI (label + value + tone + hint)
    OccSlider.jsx        # Multi-thumbs HC/HP + marqueur moyenne pondérée
    MixSlider.jsx        # 4 zones (C12/C24/C48/PT) + 3 frontières + locks
  pages/
    Dashboard.jsx        # KPIs + sliders occupation/capacité/mix + détail
    Settings.jsx         # Édition complète de la Config
    Onboarding.jsx       # Questionnaire 13 étapes (config initiale)
```

---

## Plan de développement

### Phase 1 — MVP local ✅ (terminée)
1. Scaffold Vite + React + Tailwind 4 ✅
2. Moteur de simulation (Config, simulate) ✅
3. Dashboard avec sliders + KPIs ✅
4. Onglet Paramètres ✅
5. Persistance localStorage ✅
6. Sliders multi-thumbs ✅ (OccSlider HC/HP + moyenne, MixSlider 4 zones avec locks)
7. Questionnaire d'onboarding ✅ (13 étapes, redirection auto première visite, bouton "Refaire" dans Paramètres)

### Phase 2 — Horizons temporels + partage
- Mode annuel saisonnier (septembre → juin)
- Mode multi-années avec montée en charge (ramp-up)
- Export / import JSON de la Config
- Graphiques Recharts (évolution dans le temps)

### Phase 3 — Multi-scénarios
- Sauvegarder jusqu'à 3 scénarios
- Comparaison côte à côte
- Dupliquer un scénario pour tester une variante

### Phase 4 — Livrable + partage
- Export PDF du business plan
- URL partageable (config encodée)
- Recettes annexes détaillées (pro shop, bar, cours collectifs)
- Déploiement Vercel

---

## Conventions

- Orthographe : **évènement** (accent grave), pas "événement"
- Commentaires / UI : français
- Code : anglais (noms de variables, types)
- Simplicité d'abord (cf. CLAUDE.md racine SCJ) — pas d'abstractions
  spéculatives, modifications chirurgicales
- Dashboard scj-dashboard = **référence visuelle mais projet indépendant**,
  on ne le modifie pas depuis simul-squash

---

## Où en est-on

**État** : Phase 1 MVP terminée. Build + lint passent. Parcours
utilisateur complet : onboarding première visite → dashboard temps réel
avec sliders → paramètres éditables → persistance locale.

**Prochaine étape suggérée** : Phase 2 (horizons temporels mensuel /
annuel saisonnier / multi-années + graphiques Recharts + export/import
JSON de la config).

---

## Repo / déploiement

- Repo GitHub : **à créer**
- Déploiement Vercel : **à configurer** (connexion GitHub → import repo)
- Branche de travail : `main` (direct, sans worktree ni feature branch
  pour ce projet selon préférence utilisateur)

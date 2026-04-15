# simul-squash — Instructions Claude Code

Hérite de `../CLAUDE.md` (racine SCJ). Ce fichier ajoute les spécificités
de simul-squash.

## Projet

Simulateur économique open source pour clubs de squash français.
Indépendant de scj-dashboard et scj-website.

Stack : Vite 8 + React 19 + Tailwind 4 + React Router 7 + Recharts.

## Commandes

```bash
npm run dev
npm run build
npm run lint
```

## Conventions spécifiques

- **Config unique** : toute la configuration du club vit dans un seul
  objet `Config` (voir `src/lib/sim.js::DEFAULT_CONFIG`). Persistée en
  localStorage via `src/lib/storage.js`.
- **Pas de backend** : tout se passe côté client. Pas d'API, pas de base
  de données.
- **Pas de comptes utilisateur** pour l'instant. Phase 4 éventuellement
  via URL partageable (config encodée dans l'URL).
- **Ne pas modifier scj-dashboard** : c'est un projet indépendant, même si
  sert de référence visuelle pour les sliders.

## Voir aussi

- `memory.md` — état d'avancement, décisions, feuille de route
- `README.md` — présentation publique

# simul-squash

Simulateur économique open source pour clubs de squash français.

Outil destiné aux gérants, directeurs et porteurs de projet de clubs de
squash. Permet de visualiser, simuler et piloter la performance économique
d'un club en fonction de paramètres que l'utilisateur contrôle directement
(capacité, tarifs, coûts, taux d'occupation).

## Stack

- Vite 8 + React 19
- Tailwind CSS 4
- React Router 7
- Recharts (pour les graphiques à venir)
- Persistance locale via `localStorage`

## Démarrer

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production
npm run lint      # lint ESLint
```

## État d'avancement

Phase 1 (MVP) : dashboard temps réel + onglet paramètres + persistance
locale. Voir `memory.md` pour la feuille de route détaillée.

## Contribuer

Projet open source sous licence MIT. Contributions de la communauté
squash française bienvenues.

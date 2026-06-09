# POC Micro-Frontends

POC d'architecture micro-frontends en deux phases.

## Phase 1 — Faisabilité Module Federation Angular 16

Trois applications Angular 16 qui collaborent via Module Federation :

| App | Port | Rôle | Type |
|-----|------|------|------|
| `legacy-shell` | 4200 | App "admin" type legacy (5 routes, mix lazy/eager, mix standalone/NgModule, Material + MatLegacy) | Host MF |
| `mfe-stats` | 4201 | Widget statistiques fond orange | Remote MF |
| `mfe-notifications` | 4202 | Widget notifications fond violet | Remote MF |

Les MFE sont intégrés dans le legacy via une **façade** (`MfeFacadeService` + `MfeOutletComponent`) — pattern documenté avec commentaires `** POC **`.

## Phase 2 — Migration vers shell Angular 21 Native Federation

À venir après validation phase 1.

## Prérequis

- Node 18 (voir `.nvmrc`)
- nvm pour switcher facilement

```bash
nvm use            # active Node 18
```

## Lancer la phase 1

```bash
# Installation des dépendances de chaque app
npm run install:phase1

# Lancement des 3 apps en parallèle
npm run dev:phase1
```

Ouvrir <http://localhost:4200>.

Pour lancer une seule app :

```bash
npm run dev:legacy
npm run dev:stats
npm run dev:notif
```

## Conventions

- Tous les morceaux de code propres au POC architecture sont préfixés `** POC **` en commentaire.
- Angular 16 partout en phase 1 (Node 18 obligatoire).

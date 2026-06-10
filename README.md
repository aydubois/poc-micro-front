# POC Micro-Frontends — Angular 16 → Angular 21

POC validant en deux phases la faisabilité d'une architecture micro-frontends et la migration progressive d'une app legacy Angular 16 vers un shell moderne Angular 21.

Tous les commits sont signés Conventional Commits, le code de POC est commenté `** POC **` partout où c'est pédagogique.

---

## Vue d'ensemble

| Projet | Version | Port | Rôle Native Federation |
|---|---|---|---|
| `legacy-shell` | Angular 16 | 4200 | Host (consomme `mfe-stats` + `mfe-notifications`) + Remote (expose `./LegacyApp` web component) |
| `mfe-stats` | Angular 16 | 4201 | Remote — expose `./Widget` (fond orange) |
| `mfe-notifications` | Angular 16 | 4202 | Remote — expose `./Widget` (fond violet) |
| `mfe-stats-v21` | Angular 21 | 4203 | Remote — expose `./Widget` (fond vert), remplace mfe-stats côté shell |
| `shell-modern` | Angular 21 | 4300 | Host (consomme tout, y compris le legacy en custom element) |
| `shared-bus` | TypeScript pur | — | Lib RxJS singleton attachée à `window` |

### Architecture cible

```
┌────────────────────────────────────────────────────────────────┐
│ shell-modern (A21) — host Native Federation                    │
│   /login (admin/admin) ─► AuthService ─► shared-bus.user$      │
│   /stats ─────────► mfe-stats-v21 (A21, widget vert)           │
│   /notifications ─► mfe-notifications (A16, widget violet)     │
│   /:section ──────► <legacy-app> (custom element A16)          │
│                       │                                         │
│                       └─► consomme mfe-stats v16 (orange) +    │
│                           mfe-notifications dans ses pages     │
│                                                                 │
│   Toasts ◄── CustomEvent 'poc:notify' (depuis legacy Settings) │
└────────────────────────────────────────────────────────────────┘
```

---

## Prérequis

- **Node 18** pour Angular 16 (legacy-shell, mfe-stats, mfe-notifications)
- **Node 24** pour Angular 21 (shell-modern, mfe-stats-v21)
- **nvm** pour switcher facilement entre les deux

```bash
nvm install 18
nvm install 24
```

Le script `scripts/dev-phase2.sh` source `nvm` et override le `PATH` par commande dans `concurrently` pour cohabiter les deux versions.

---

## Installation

```bash
# Une seule commande pour installer toutes les apps
npm run install:all
```

---

## Lancement

### Phase 1 (legacy + 2 micro-frontends Angular 16)

```bash
npm run dev:phase1
```

Ouvre <http://localhost:4200>.

### Phase 2 (complète — 5 apps)

```bash
npm run dev:phase2
```

Ouvre <http://localhost:4300>. Connexion : `admin` / `admin`.

### Apps individuelles

```bash
npm run dev:shell        # shell-modern :4300
npm run dev:legacy       # legacy-shell :4200
npm run dev:stats        # mfe-stats v16 :4201
npm run dev:stats-v21    # mfe-stats-v21 :4203
npm run dev:notif        # mfe-notifications :4202
```

---

## URLs à tester

| URL | Démontre |
|---|---|
| `http://localhost:4300/login` | Auth fake signal-based |
| `http://localhost:4300/dashboard` | Legacy A16 monté en custom element dans shell A21 |
| `http://localhost:4300/users` | Legacy avec navigation cross-router (shell ↔ legacy hash) |
| `http://localhost:4300/stats` | Widget vert v21 chargé via Native Federation |
| `http://localhost:4300/notifications` | Widget violet A16 consommé par host A21 |
| `http://localhost:4300/settings` puis Save | Toast émis via CustomEvent du legacy au shell |
| `http://localhost:4200` | Legacy en standalone (ses micro-frontends embarqués) |
| `http://localhost:4201` | mfe-stats v16 preview standalone |
| `http://localhost:4202` | mfe-notifications preview standalone |
| `http://localhost:4203` | mfe-stats-v21 preview standalone |

---

## Ce qui a été construit

### Phase 1 — Faisabilité Module Federation Angular 16

1. **legacy-shell** scaffoldé en Angular 16 avec Angular Material + MatLegacy.
   - 5 routes mixant tous les cas : Dashboard (eager + NgModule), Users (lazy + NgModule + MatLegacyTable), Products (lazy + standalone), Orders (eager + standalone + MatLegacyCard), Settings (lazy + standalone + Reactive Form).
   - Layout sidenav + toolbar, services mock in-memory, styles globaux SCSS + styles par composant.
2. **mfe-stats** et **mfe-notifications** scaffoldés en remotes Module Federation.
3. **Façade MFE** : `MfeFacadeService` + `MfeOutletComponent` chargent dynamiquement les remotes via `loadRemoteModule({ type: 'module' })`.
4. **Validation runtime** : widgets orange (stats) et violet (notifications) s'affichent bien dans Dashboard et Users.

> Note : la phase 1 a été ensuite **migrée vers Native Federation** en phase 2 pour cohérence d'architecture. L'historique git conserve l'état Module Federation.

### Phase 2 — Migration vers shell Angular 21 Native Federation

1. **shell-modern** scaffoldé en Angular 21 (esbuild, zoneless par défaut) + `@angular-architects/native-federation@21` en dynamic-host.
2. **Layout dark moderne** avec header (avatar utilisateur, déconnexion) + sidebar à 2 groupes (Legacy / micro-frontends) + outlet, zéro CSS hérité du legacy.
3. **Auth fake** signal-based : `AuthService` (admin/admin), `authGuard`, `LoginComponent` Reactive Form, persistance localStorage.
4. **Migration vers Native Federation** de tous les Angular 16 :
   - `mfe-stats` et `mfe-notifications` : remplacement de Module Federation par Native Federation v16 (esbuild builder).
   - `legacy-shell` : passe en dynamic-host Native Federation v16 (consomme les deux micro-frontends).
   - Chaque app expose un `remoteEntry.json` ES module compatible avec un host A21.
5. **Branchement des micro-frontends sur shell-modern** : routes `/stats` et `/notifications` du shell montent les widgets via `loadRemoteModule` de Native Federation v21.
6. **Legacy en web component** :
   - `@angular/elements@16` ajouté.
   - `LegacyElementModule` (NgModule sans bootstrap) qui réimporte `AppModule`.
   - `legacy-app.element.ts` exporte `registerLegacyApp()` : init federation, injection de la feuille de styles globale du legacy dans le `<head>` du shell, bootstrap manuel et `customElements.define('legacy-app', ...)`.
   - `AppComponent` legacy : input `section` qui déclenche `router.navigateByUrl` en `ngOnChanges`, masquage de la chrome (toolbar + sidenav) en mode embarqué.
   - Bandeau visuel "Legacy Angular 16 — encapsulé en Web Component" avec point pulsant pour distinguer la zone à l'œil.
   - `useHash: true` sur le router legacy pour cohabiter avec celui du shell.
   - `zone.js` ajouté aux polyfills du shell (Angular 21 zoneless n'en a pas par défaut, Angular 16 en exige).
7. **mfe-stats-v21** scaffoldé en Angular 21 standalone + Native Federation natif, widget vert (`#3dd685`) avec 4 stats au lieu de 3, control flow `@for/track`. Remplace `mfe-stats` v16 dans le manifest du shell.
8. **shared-bus** : lib TypeScript pure (ES module), `BehaviorSubject` typés `user$`/`theme$`/`cart$` accrochés à `window.__pocSharedBus__` pour garantir un singleton cross-version. Installée en `file:../shared-bus` dans toutes les apps.
   - `shell-modern AuthService` pousse l'utilisateur sur login.
   - `legacy-shell AppComponent` lit `user$` et affiche le nom dans le bandeau d'encapsulation.
   - `mfe-stats-v21 StatsWidgetComponent` salue l'utilisateur dans son header.
9. **CustomEvent `poc:notify`** :
   - Émis par `SettingsComponent` du legacy après save.
   - Écouté par `NotifyService` du shell, affiché en toast en bas à droite avec auto-dismiss.

---

## Apprentissages techniques (commentés `** POC **` dans le code)

### Zone.js cross-version
Angular 21 est zoneless par défaut. Pour héberger un Angular 16, il faut ajouter `"zone.js"` aux polyfills du shell — sinon `NG0908: In this configuration Angular requires Zone.js`.

### Format `remoteEntry`
Avec Angular 16 + `@angular-architects/native-federation@16`, le builder switche en `esbuild` et produit un `remoteEntry.json` (manifest format) avec des chunks ES modules. Compatible directement avec un host Angular 21.

### Trois runtimes Native Federation cohabitent
`@angular-architects/native-federation` v16 et v21 sont deux packages npm distincts au runtime. Chaque host (shell, legacy standalone, legacy embarqué) a sa propre runtime et fetch ses chunks indépendamment. C'est le prix de la transition progressive.

### Cohabitation des routers
`useHash: true` côté legacy = le shell utilise le path, le legacy utilise le fragment. Plus de conflit `popstate`.

### Bootstrap NgModule sans auto-bootstrap
`LegacyElementModule.imports = [AppModule]` n'utilise pas le `bootstrap: [AppComponent]` d'AppModule (ce dernier ne s'active que si AppModule est le module racine). On définit `ngDoBootstrap` vide pour empêcher tout auto-bootstrap, puis on instancie via `createCustomElement`.

### Singleton via `window` plutôt que via NF share
`shared-bus` est attachée à `window.__pocSharedBus__`. C'est plus simple et plus fiable que d'essayer de partager un module via Native Federation entre apps de versions Angular différentes (les contraintes `strictVersion` ne peuvent pas être satisfaites).

### shared-bus en ES module (pas CommonJS)
La lib doit être buildée en ES module (`tsconfig.module: "ES2020"` + `package.json.type: "module"`) pour que esbuild du shell A21 puisse extraire les named exports.

### Node versions
Angular 16 sur Node 18, Angular 21 sur Node 24. `scripts/dev-phase2.sh` capture le `PATH` de chaque version puis override par commande dans `concurrently`.

---

## Limites connues du POC

- **Pas de Shadow DOM** sur le custom element legacy — on injecte la feuille de styles globalement dans le `<head>` du shell. Les overlays Material (MatDialog, MatSelect dropdown) peuvent fuir hors du conteneur visuel du legacy.
- **`theme$` du shared-bus non câblé à l'UI** — la lib l'expose mais pas de toggle dans l'interface. Ajout trivial si besoin.
- **Legacy embarqué consomme toujours `mfe-stats` v16** dans son propre manifest. Pour démontrer la migration jusqu'au bout, on pourrait le faire pointer aussi sur la v21.
- **Auth fake non-sécurisé** — pas de JWT, juste un objet en localStorage. Strict mock pour le POC.

---

## Conventions de code

- TypeScript strict, pas de `any`, typage explicite partout.
- Pas de `;` de fin de ligne en TS applicatif (sauf imports et `*.spec.ts`).
- Angular 16 → `*ngIf` / `*ngFor` (control flow `@if`/`@for` introduit en 17).
- Angular 21 → `@if` / `@for` / signals / `input.required()` / `takeUntilDestroyed`.
- JSDoc en français sur chaque méthode.
- Tous les fichiers Angular en `kebab-case` avec suffixe `.component.ts`, `.service.ts`, etc.
- Tous les bouts de code propres au POC architecture sont préfixés `** POC **` en commentaire pour faciliter la relecture.

---

## Repo

<https://github.com/aydubois/poc-micro-front>

Commits thématiques (un par tâche), tous signés Conventional Commits, signature `Co-Authored-By` pour la collaboration avec l'assistant.

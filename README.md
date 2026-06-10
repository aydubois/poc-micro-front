# POC Micro-Frontends — Angular 16 → Angular 18 → Angular 21

POC validant en deux phases la faisabilité d'une architecture micro-frontends et la migration progressive d'une app legacy Angular 16 vers un shell moderne Angular 21, avec une version intermédiaire Angular 18 pour démontrer la trajectoire de mise à niveau pas-à-pas.

Tous les commits sont signés Conventional Commits, le code de POC est commenté `** POC **` partout où c'est pédagogique.

---

## Vue d'ensemble

| Projet | Version | Port | Rôle Native Federation |
|---|---|---|---|
| `legacy-shell` | Angular 16 | 4200 | Host (consomme `mfe-stats` + `mfe-notifications`) + Remote (expose `./LegacyApp` web component) |
| `mfe-stats` | Angular 18 | 4201 | Remote — expose `./Widget` (fond orange) |
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
│                       └─► consomme mfe-stats v18 (orange) +    │
│                           mfe-notifications dans ses pages     │
│                                                                 │
│   Toasts ◄── CustomEvent 'poc:notify' (depuis legacy Settings) │
└────────────────────────────────────────────────────────────────┘
```

---

## Prérequis

- **Node 18** pour Angular 16 et Angular 18 (legacy-shell, mfe-stats, mfe-notifications)
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

### Phase 1 (legacy + 2 micro-frontends Angular 16/18)

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
npm run dev:stats        # mfe-stats v18 :4201
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
| `http://localhost:4300/notifications` | Widget violet A16 encapsulé en custom element `<mfe-notifications>` |
| `http://localhost:4300/settings` puis Save | Toast émis via CustomEvent du legacy au shell |
| `http://localhost:4200` | Legacy en standalone (ses micro-frontends embarqués) |
| `http://localhost:4201` | mfe-stats Angular 18 preview standalone |
| `http://localhost:4202` | mfe-notifications preview standalone |
| `http://localhost:4203` | mfe-stats-v21 preview standalone |

---

## Ce qui a été construit

### Phase 1 — Faisabilité Module Federation Angular 16

1. **legacy-shell** scaffoldé en Angular 16 avec Angular Material + MatLegacy.
   - 5 routes mixant tous les cas : Dashboard (eager + NgModule), Users (lazy + NgModule + MatLegacyTable), Products (lazy + standalone), Orders (eager + standalone + MatLegacyCard), Settings (lazy + standalone + Reactive Form).
   - Layout sidenav + toolbar, services mock in-memory, styles globaux SCSS + styles par composant.
2. **mfe-stats** et **mfe-notifications** scaffoldés en remotes Module Federation Angular 16.
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

### Phase 2.6 — mfe-notifications encapsulé en web component

Après la migration de `mfe-stats` vers Angular 18, charger `mfe-notifications` (Angular 16) dans le shell Angular 21 via `componentFactory.create` s'est mis à jeter `NG0203: inject() must be called from an injection context`. Cause racine : le passage de `mfe-stats` en A18 + le retrait de `initFederation()` du legacy embarqué (pour stopper les `Rejected map override`) ont fait sauter le platform A16 sur lequel le widget standalone s'appuyait. Sans platform A16 actif côté shell, `getStandaloneInjector` ne trouve plus son parent.

Solution : appliquer à `mfe-notifications` la même recette qu'au legacy — l'encapsuler dans un **custom element avec son propre platform Angular 16 isolé**.

- `@angular/elements@16` ajouté.
- `NotificationsElementModule` (NgModule sans bootstrap) qui réimporte `BrowserModule` + `NotificationsWidgetComponent`.
- `notifications-app.element.ts` exporte `registerNotificationsApp()` : bootstrap manuel d'un platform A16, `createCustomElement(NotificationsWidgetComponent)`, `customElements.define('mfe-notifications', …)`, injection des styles globaux du micro-frontend dans le `<head>` du shell.
- `federation.config.js` du micro-frontend expose maintenant `./NotificationsElement` (en plus de `./Widget` conservé pour rétro-compat).
- Côté shell, `NotificationsHostComponent` calque `LegacyHostComponent` : `loadRemoteModule('mfeNotifications', './NotificationsElement')` puis `registerNotificationsApp()` puis rend `<mfe-notifications></mfe-notifications>`. La page `/notifications` n'utilise plus `<app-mfe-outlet>`.

→ Plus aucune négociation de share scope cross-version pour ce micro-frontend : le shell A21 ne voit qu'un nœud DOM, le widget vit dans son propre sandbox Angular 16. C'est le **troisième pattern d'intégration** démontré par le POC, à côté du `<app-mfe-outlet>` (factory.create, ok seulement si même version Angular) et de Native Federation pure (cohabitation impossible cross-version dans une même runtime).

### Phase 2.5 — Étape intermédiaire Angular 18 pour mfe-stats

Pour démontrer une trajectoire de mise à niveau progressive plutôt que big-bang, le micro-frontend `mfe-stats` a été montré de version de Angular 16 à **Angular 18** :

- Reconstruit avec `ng new` Angular 18 (esbuild, standalone par défaut).
- `@angular-architects/native-federation@18.2.7` en remote, expose le même `./Widget` qu'avant.
- Composant modernisé : control flow `@if`/`@for` (introduit en A17), `signal`, `takeUntilDestroyed`, `DestroyRef` injecté.
- Suppression des `*ngFor` et `trackBy` au profit de `@for (... ; track ...)`.
- shared-bus consommé via signal pour saluer l'utilisateur dans le header du widget.
- Badge interne `mfe-stats · A18` pour repérer la version à l'œil.
- Native Federation v18 → tous les remotes (`mfe-stats` v18, `mfe-notifications` v16, `mfe-stats-v21`) cohabitent sans modifier le shell A21 ni le legacy A16 : Native Federation produit des ES modules indépendants des versions Angular embarquées.

→ Démontre qu'un host A21 peut consommer simultanément du A16, du A18 et du A21 via Native Federation, ce qui valide la stratégie de montée de version pas-à-pas.

---

## Apprentissages techniques (commentés `** POC **` dans le code)

### Zone.js cross-version
Angular 21 est zoneless par défaut. Pour héberger un Angular 16, il faut ajouter `"zone.js"` aux polyfills du shell — sinon `NG0908: In this configuration Angular requires Zone.js`.

### Format `remoteEntry`
Avec Angular 16/18 + `@angular-architects/native-federation`, le builder switche en `esbuild` et produit un `remoteEntry.json` (manifest format) avec des chunks ES modules. Compatible directement avec un host Angular 21.

### Trois runtimes Native Federation cohabitent
`@angular-architects/native-federation` v16, v18 et v21 sont des packages npm distincts au runtime. Chaque host (shell, legacy standalone, legacy embarqué) a sa propre runtime et fetch ses chunks indépendamment. C'est le prix de la transition progressive.

### Cohabitation des routers
`useHash: true` côté legacy = le shell utilise le path, le legacy utilise le fragment. Plus de conflit `popstate`.

### Bootstrap NgModule sans auto-bootstrap
`LegacyElementModule.imports = [AppModule]` n'utilise pas le `bootstrap: [AppComponent]` d'AppModule (ce dernier ne s'active que si AppModule est le module racine). On définit `ngDoBootstrap` vide pour empêcher tout auto-bootstrap, puis on instancie via `createCustomElement`.

### Singleton via `window` plutôt que via NF share
`shared-bus` est attachée à `window.__pocSharedBus__`. C'est plus simple et plus fiable que d'essayer de partager un module via Native Federation entre apps de versions Angular différentes (les contraintes `strictVersion` ne peuvent pas être satisfaites).

### shared-bus en ES module (pas CommonJS)
La lib doit être buildée en ES module (`tsconfig.module: "ES2020"` + `package.json.type: "module"`) pour que esbuild du shell A21 puisse extraire les named exports.

### Node versions
Angular 16/18 sur Node 18, Angular 21 sur Node 24. `scripts/dev-phase2.sh` capture le `PATH` de chaque version puis override par commande dans `concurrently`.

### Migration progressive
La présence simultanée des trois versions Angular dans le POC (16, 18, 21) prouve qu'on peut moderniser un micro-frontend après l'autre **sans toucher au reste** : tant que l'API exposée (`./Widget`) reste stable, le contrat Native Federation est respecté.

---

## Limites connues du POC

- **Pas de Shadow DOM** sur le custom element legacy — tenté mais abandonné. Avec `ViewEncapsulation.ShadowDom` sur AppComponent, les composants Material 16 enfants en encapsulation Emulated continuent d'injecter leurs styles dans `document.head`, qui n'est plus accessible depuis le shadow root → tout l'arbre Material apparaît non stylé. Pour activer ShadowDom proprement il faudrait basculer chaque composant Material en `ViewEncapsulation.ShadowDom`, ce qui sort du périmètre du POC. À la place, les styles globaux du legacy sont injectés dans le `<head>` du shell par `legacy-app.element.ts`. Conséquence : les overlays Material (MatDialog, MatSelect dropdown) peuvent fuir visuellement entre le shell et le legacy.
- **`theme$` du shared-bus non câblé à l'UI** — la lib l'expose mais pas de toggle dans l'interface. Ajout trivial si besoin.
- **Legacy embarqué ne consomme plus aucun micro-frontend** — la migration de `mfe-stats` vers Angular 18 a révélé que Native Federation ne tolère pas le partage cross-version d'un même package Angular dans une même runtime. Symptômes : `Rejected map override "@angular/common"` côté shim ES module, puis `TypeError: fn is not a function` dans `ɵɵdefineComponent` quand le widget A18 tente de s'initialiser dans le runtime A16 du legacy. Conséquence : les `<app-mfe-outlet>` ont été retirés des pages Dashboard et Users du legacy. Les widgets restent accessibles via les routes `/stats` et `/notifications` du shell moderne. C'est le constat majeur du POC : **Native Federation tolère la cohabitation cross-version via runtimes isolées (custom element du legacy + remotes A21 séparés) mais pas le share scope cross-version dans une même runtime.**
- **`componentFactory.create` cross-version cassé après la migration de mfe-stats en A18** — le shell A21 chargeait `NotificationsWidgetComponent` (A16, standalone) via `<app-mfe-outlet>` avec un `factory.create()`. Tant que tous les micro-frontends étaient en A16 et que `initFederation()` tournait dans le legacy, un platform A16 unique gardait le composant fonctionnel par effet de bord. La double bascule (mfe-stats en A18 + retrait d'`initFederation()` du legacy embarqué) a tué cet équilibre → `NG0203: inject() must be called from an injection context` sur `/notifications`. Correctif : `mfe-notifications` est désormais consommé en custom element `<mfe-notifications>` avec son propre platform A16 isolé (cf. Phase 2.6). **Leçon** : le pattern `<app-mfe-outlet>` ne fonctionne de façon fiable que si remote et host partagent la même version majeure d'Angular ; sinon il faut passer par un custom element.
- **Auth fake non-sécurisé** — pas de JWT, juste un objet en localStorage. Strict mock pour le POC.

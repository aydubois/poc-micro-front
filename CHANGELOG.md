# Changelog du POC micro-frontends

Cet historique explique chaque étape du POC dans un langage accessible. L'idée : tu dois pouvoir suivre la construction même si tu ne connais ni Module Federation, ni Native Federation, ni les particularités cross-version d'Angular.

**Trois mots-clés à connaître** :
- **Shell** = l'application "coquille" qui encadre tout (menu, header, routing) et qui charge les autres morceaux.
- **Micro-frontend** = un bout d'interface développé et déployé séparément, embarqué dans le shell à la demande.
- **Custom element / Web Component** = une balise HTML "maison" (par exemple `<mfe-stats>`) qui embarque sa propre app interne et qui s'utilise comme `<div>` ou `<button>`.

---

## Phase 1 — Une app legacy Angular 16 + deux micro-frontends Angular 16 (Module Federation)

L'objectif de cette phase : prouver qu'on peut découper une app en morceaux indépendants chargés à la volée. On utilise **Module Federation**, la première techno de micro-frontends supportée par Angular.

### `0b57340` · 2026-06-09 · Initialisation du dépôt
**Ce qui a été fait** : création du dossier racine, un `package.json` qui sait lancer plusieurs apps en parallèle (via `concurrently`), un README de présentation.
**Pourquoi** : avoir une base propre pour héberger plusieurs sous-projets côte à côte.

### `659bdf0` · 2026-06-09 · Création de l'app `legacy-shell` en Angular 16
**Ce qui a été fait** : `ng new legacy-shell` avec Angular 16, Angular Material 16 ajouté, theme indigo-pink.
**Pourquoi** : simuler une application admin "réelle" qu'on aurait à moderniser plus tard.

### `bc617cc` · 2026-06-09 · Cinq pages représentatives dans le legacy
**Ce qui a été fait** : 5 routes (Dashboard, Users, Products, Orders, Settings) mélangeant tous les styles possibles dans Angular : composants en NgModule ou standalone, chargement immédiat (eager) ou différé (lazy), Material moderne ou Material Legacy.
**Pourquoi** : avoir un cas d'usage assez varié pour que les retours d'expérience soient transposables à de vraies bases de code.

### `d8bacde` · 2026-06-09 · Branchement de Module Federation côté shell
**Ce qui a été fait** : ajout du plugin `@angular-architects/module-federation`. Le shell sait qu'il doit charger les micro-frontends Stats (port 4201) et Notifications (port 4202).
**Pourquoi** : Module Federation permet à plusieurs apps de partager du code et de se charger mutuellement à l'exécution, comme des plugins.

### `0279985` · 2026-06-09 · Création d'une "façade" pour charger les micro-frontends facilement
**Ce qui a été fait** : un service `MfeFacadeService` qui sait télécharger un morceau distant, et un composant `<app-mfe-outlet>` qui se contente de monter ce morceau à l'endroit où on le pose dans le HTML.
**Pourquoi** : éviter d'éparpiller la logique de chargement dans toutes les pages. On écrit juste `<app-mfe-outlet remote="mfeStats">` et c'est l'outlet qui gère tout.

### `423ebff` · 2026-06-09 · Création du micro-frontend `mfe-stats` (Angular 16)
**Ce qui a été fait** : une mini-app indépendante qui affiche 3 statistiques sur fond orange.
**Pourquoi** : on a besoin de quelque chose à charger dans le shell pour valider la mécanique.

### `659cf84` · 2026-06-09 · Création du micro-frontend `mfe-notifications` (Angular 16)
**Ce qui a été fait** : une autre mini-app qui affiche 4 notifications sur fond violet.
**Pourquoi** : un deuxième micro-frontend pour prouver qu'on peut en cumuler plusieurs.

### `3debcef` · 2026-06-09 · Branchement des micro-frontends dans les pages legacy
**Ce qui a été fait** : la page Dashboard du legacy affiche le widget Stats, la page Users affiche le widget Notifications.
**Pourquoi** : voir le résultat final — le legacy consomme bien ses widgets.

### `87a7f87` · 2026-06-09 · Correctif : charger les micro-frontends en mode "ES module"
**Ce qui a été fait** : `loadRemoteModule({ type: 'module' })` au lieu de `type: 'script'`.
**Pourquoi** : Angular 16 + Module Federation génère désormais des "ES modules" (le format JavaScript moderne) au lieu de l'ancien format script. Sans cette option, le chargement plantait avec "Cannot read properties of undefined".

---

## Phase 2 — Un shell tout neuf en Angular 21 + Native Federation

On change de techno : **Native Federation**, plus récente, basée sur les standards web (import maps + ES modules natifs). Le but : un shell moderne Angular 21 qui consomme le legacy ET ses micro-frontends.

### `5d7946a` · 2026-06-10 · Création du `shell-modern` en Angular 21
**Ce qui a été fait** : `ng new shell-modern` en Angular 21, Native Federation ajouté en mode "host dynamique", layout sombre maison (header + sidebar + outlet de contenu).
**Pourquoi** : le shell est le coeur du POC. Angular 21 est la dernière version stable, il faut donc construire dessus.

### `8bf818f` · 2026-06-10 · Authentification factice + protection des routes
**Ce qui a été fait** : un `AuthService` qui retient l'utilisateur connecté dans un signal Angular, un guard qui redirige vers `/login` si on n'est pas connecté, un formulaire de login (admin/admin).
**Pourquoi** : un POC réaliste a besoin d'un login. On reste très simple : pas de JWT, pas de serveur, juste un objet dans le localStorage.

### `4ca62e1` · 2026-06-10 · Migration de tous les projets de Module Federation vers Native Federation
**Ce qui a été fait** : remplacement de Module Federation par Native Federation dans `mfe-stats`, `mfe-notifications` et `legacy-shell` (tous en Angular 16). Le builder passe de webpack à esbuild.
**Pourquoi** : avoir un POC cohérent. Mélanger les deux technologies au sein du même POC serait confusant et fragile.

### `e1c8212` · 2026-06-10 · Un script pour lancer 4 apps avec deux versions de Node
**Ce qui a été fait** : `scripts/dev-phase2.sh` qui sait que les apps Angular 16 tournent sous Node 18 et celles en Angular 21 sous Node 24, et lance tout en parallèle.
**Pourquoi** : Angular 21 ne fonctionne pas sous Node 18, et Angular 16 grogne sous Node 24. Sans gestion fine, on ne peut pas tout lancer ensemble.

### `8457574` · 2026-06-10 · Le legacy devient un **Web Component** consommable par le shell
**Ce qui a été fait** : la grosse étape clé. Le legacy Angular 16 est emballé dans un custom element `<legacy-app>` que le shell Angular 21 peut afficher comme une simple balise HTML.
**Pourquoi** : sans cette astuce, on ne pourrait pas faire cohabiter deux versions d'Angular sur la même page. Le custom element isole complètement le legacy : il tourne dans son propre "platform" Angular 16, le shell ne voit qu'un noeud DOM.

### `b4ec77e` · 2026-06-10 · Création d'un **deuxième micro-frontend Stats en Angular 21**
**Ce qui a été fait** : `mfe-stats-v21`, un nouveau widget vert en Angular 21 (4 stats au lieu de 3). Et création d'une petite lib `shared-bus` (un bus d'événements partagé entre apps).
**Pourquoi** : montrer qu'on peut faire vivre simultanément du A16 (legacy + notifications) et du A21 (shell + nouveau widget) dans la même page.

### `3ea1e80` · 2026-06-10 · Mise en place du **partage d'état** entre apps via `shared-bus`
**Ce qui a été fait** : `shared-bus` est une petite librairie qui expose des objets RxJS (`user$`, `theme$`, `cart$`) accrochés à `window`. Quand l'utilisateur se connecte, son nom est partagé entre toutes les apps. Et un système d'événement `poc:notify` permet au legacy d'afficher des toasts dans le shell.
**Pourquoi** : un shell + des micro-frontends qui ne se parlent pas, ça n'a pas grand intérêt. On démontre deux mécanismes : un état partagé persistant (RxJS) et des événements ponctuels (CustomEvent).

### `16b3b1c` · 2026-06-10 · Rédaction du `README` complet
**Ce qui a été fait** : documentation de tout ce qui a été construit jusqu'ici.
**Pourquoi** : sans doc, le POC n'est utilisable que par moi.

---

## Phase 2.5 — Migration intermédiaire de mfe-stats vers Angular 18

L'objectif : montrer qu'on peut migrer un micro-frontend morceau par morceau, pas obligatoirement en sautant directement à la dernière version.

### `32f5aaf` · 2026-06-10 · `mfe-stats` passe de Angular 16 à Angular 18
**Ce qui a été fait** : reconstruction de `mfe-stats` en Angular 18, code modernisé (control flow `@if/@for`, signaux, `takeUntilDestroyed`).
**Pourquoi** : démontrer la "trajectoire" de migration. Maintenant le POC fait cohabiter 3 versions d'Angular sur la même page : A16 (legacy + notifications), A18 (stats), A21 (shell + stats-v21).

### `0b3c01b` · 2026-06-10 · Trois correctifs après la migration A18
**Ce qui a été fait** :
1. Annulation d'un essai de ShadowDom sur le legacy (les styles Material 16 ne suivaient pas dans le shadow root).
2. Enregistrement de la locale française dans le legacy pour que les pipes `currency:'EUR':...:'fr'` ne plantent plus en mode embarqué.
3. Remplacement de `takeUntilDestroyed` (pas dans l'import map cross-version) par un classique `Subscription` côté `mfe-stats` A18.

**Pourquoi** : la cohabitation cross-version révèle des coins inattendus. On documente les contournements.

### `45a4896` · 2026-06-10 · Doc : limite ShadowDom dans le README

---

## Phase 2.6 — Le mur cross-version : on retire les micro-frontends du legacy embarqué

La migration vers Angular 18 a cassé une chose : le legacy A16 ne sait plus afficher les widgets directement dans ses pages quand il est embarqué dans le shell A21.

### `0f81527` · 2026-06-10 · Retrait des `<app-mfe-outlet>` des pages legacy
**Ce qui a été fait** : Dashboard et Users du legacy n'embarquent plus leurs widgets. Un encart explique que les fonctionnalités sont accessibles via les routes `/stats` et `/notifications` du shell.
**Pourquoi** : techniquement, deux "runtimes Native Federation" (une dans le shell, une dans le legacy) qui tentent de remapper le même package Angular (par exemple `@angular/common`) vers des URLs différentes provoquent des erreurs "Rejected map override" puis "TypeError: fn is not a function". Constat majeur du POC : **Native Federation tolère deux versions d'Angular qui cohabitent dans des contextes isolés, pas qui partagent le même runtime.**

### `12fc351` · 2026-06-10 · `mfe-notifications` devient lui aussi un Web Component
**Ce qui a été fait** : même recette que pour le legacy. `mfe-notifications` est emballé dans un custom element `<mfe-notifications>` avec son propre platform Angular 16 isolé. La page `/notifications` du shell utilise désormais cette balise.
**Pourquoi** : tant que le widget était chargé via `componentFactory.create` (la mécanique de `<app-mfe-outlet>`), il dépendait d'un platform Angular 16 actif quelque part. Après la migration de mfe-stats vers A18, ce platform a disparu → `NG0203: inject() must be called from an injection context`. Encapsuler en custom element règle le problème : chaque widget vit dans sa propre bulle Angular.

### `3056d9a` · 2026-06-10 · `mfe-stats` devient aussi un Web Component, et `/stats` repointe sur le A18
**Ce qui a été fait** : la même recette appliquée à `mfe-stats` (Angular 18). Le shell affiche désormais le widget orange A18 sur `/stats` au lieu du widget vert A21.
**Pourquoi** : tu m'avais demandé pourquoi `/stats` montrait le widget v21 alors qu'on avait migré mfe-stats vers A18. Réponse : parce que le manifest pointait sur le port 4203 (le v21). On change le manifest pour pointer sur le port 4201 (le A18), et on encapsule pareil en `<mfe-stats>` pour ne pas casser cross-version.

---

## Phase 2.7 — Le legacy embarqué retrouve ses widgets

Maintenant que `<mfe-stats>` et `<mfe-notifications>` sont des balises HTML auto-suffisantes, on peut les remettre dans le legacy.

### `804f318` · 2026-06-11 · Les widgets reviennent inline dans le Dashboard et le Users du legacy
**Ce qui a été fait** :
- Deux nouveaux composants côté legacy (`StatsElementHostComponent` et `NotificationsElementHostComponent`) qui s'occupent d'afficher la balise au bon moment.
- Côté shell, un `APP_INITIALIZER` qui charge et enregistre les deux custom elements au démarrage. Comme ça, dès que le legacy embarqué a besoin d'afficher `<mfe-stats>` ou `<mfe-notifications>`, la balise est déjà connue du navigateur.
- Les pages Dashboard et Users du legacy retrouvent leurs widgets inline, sans la moindre erreur cross-version.

**Pourquoi** : c'est le bénéfice de l'encapsulation en custom element. Une fois qu'une balise HTML existe globalement, **n'importe quel** code de **n'importe quelle** version d'Angular peut l'utiliser comme s'il s'agissait d'une balise standard. Le pattern est devenu portable.

---

## En résumé pour un nouveau venu

Le POC raconte une histoire :

1. **On part d'une app Angular 16** qu'on suppose être un legacy à moderniser.
2. **On la découpe en morceaux** (Module Federation, puis Native Federation).
3. **On crée un shell moderne** en Angular 21 qui va devenir le point d'entrée principal.
4. **On enchâsse le legacy dans le shell** via un Web Component, ce qui permet aux deux versions d'Angular de cohabiter.
5. **On commence à migrer un morceau** vers Angular 18 pour montrer la trajectoire progressive.
6. **On découvre les limites** : on ne peut pas mélanger deux versions d'Angular dans un même contexte d'exécution. Symptômes : `Rejected map override`, `NG0203`, `TypeError: fn is not a function`.
7. **On adopte le pattern Web Component partout** : chaque micro-frontend a son propre platform Angular isolé, exposé via une balise `<mfe-xxx>`. Plus aucune négociation cross-version requise.
8. **Le résultat final** : un shell Angular 21 qui charge un legacy Angular 16, des widgets Angular 16 et Angular 18, le tout sans la moindre erreur, et avec un état partagé via `shared-bus` + des événements via `CustomEvent`.

La conclusion technique : **pour faire cohabiter plusieurs versions d'Angular, le seul mécanisme vraiment robuste est l'encapsulation en Web Component**. Les autres approches (factory.create, share scope Native Federation) sont fragiles dès qu'il y a un écart de version.

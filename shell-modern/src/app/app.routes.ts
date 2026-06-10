import { Routes } from '@angular/router'

import { authGuard } from './core/auth/auth.guard'
import { LoginComponent } from './core/auth/login.component'
import { LayoutComponent } from './layout/layout.component'
import { LegacyHostComponent } from './pages/legacy/legacy-host.component'
import { NotificationsPageComponent } from './pages/notifications/notifications-page.component'
import { StatsPageComponent } from './pages/stats/stats-page.component'

/**
 * Routes principales du shell moderne.
 *
 * - /login publique
 * - Tout le reste est sous le LayoutComponent + authGuard
 * - /stats et /notifications : pages dédiées qui montent les widgets
 *   micro-frontends Angular 16 via Native Federation
 * - /:section : route paramétrée qui mounte LegacyHostComponent (legacy
 *   encapsulé en custom element). Le composant est REUSED entre les
 *   navigations (default RouteReuseStrategy) car la config de route est
 *   identique, seul le paramètre change → pas d'unmount/remount du
 *   custom element coûteux.
 */
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'stats', component: StatsPageComponent },
      { path: 'notifications', component: NotificationsPageComponent },
      { path: ':section', component: LegacyHostComponent }
    ]
  },
  { path: '**', redirectTo: '' }
]

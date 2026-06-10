import { Routes } from '@angular/router'

import { authGuard } from './core/auth/auth.guard'
import { LoginComponent } from './core/auth/login.component'
import { LayoutComponent } from './layout/layout.component'
import { NotificationsPageComponent } from './pages/notifications/notifications-page.component'
import { PlaceholderComponent } from './pages/placeholder.component'
import { StatsPageComponent } from './pages/stats/stats-page.component'

/**
 * Routes principales du shell moderne.
 *
 * /login publique. Le reste est sous le LayoutComponent + authGuard.
 *
 * Les routes /stats et /notifications montent les micro-frontends via
 * Native Federation. Les autres (legacy : dashboard, users, products,
 * orders, settings) restent en placeholder jusqu'au branchement du legacy
 * encapsulé en web component (tâche 13).
 */
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: PlaceholderComponent },
      { path: 'users', component: PlaceholderComponent },
      { path: 'products', component: PlaceholderComponent },
      { path: 'orders', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent },
      { path: 'stats', component: StatsPageComponent },
      { path: 'notifications', component: NotificationsPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
]

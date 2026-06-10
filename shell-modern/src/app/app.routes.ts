import { Routes } from '@angular/router'

import { authGuard } from './core/auth/auth.guard'
import { LoginComponent } from './core/auth/login.component'
import { LayoutComponent } from './layout/layout.component'
import { PlaceholderComponent } from './pages/placeholder.component'

/**
 * Routes principales du shell moderne.
 * /login est publique. Toutes les autres routes sont sous le LayoutComponent
 * protégé par authGuard. Chaque entrée de menu monte un Placeholder en
 * attendant le branchement des remotes (tâches 12-14).
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
      { path: 'stats', component: PlaceholderComponent },
      { path: 'notifications', component: PlaceholderComponent }
    ]
  },
  { path: '**', redirectTo: '' }
]

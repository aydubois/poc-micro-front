import { Routes } from '@angular/router'

import { LayoutComponent } from './layout/layout.component'
import { PlaceholderComponent } from './pages/placeholder.component'

/**
 * Routes principales du shell moderne.
 * Toutes les pages métier sont sous le LayoutComponent (qui hostera l'auth
 * en tâche 11). Pour l'instant chaque route monte un Placeholder en
 * attendant le branchement des remotes/legacy.
 */
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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

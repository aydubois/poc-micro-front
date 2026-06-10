import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { OrdersComponent } from './pages/orders/orders.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  // Dashboard : eager + NgModule (DashboardModule importé dans AppModule).
  { path: 'dashboard', component: DashboardComponent },

  // Users : lazy + NgModule (loadChildren classique).
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
  },

  // Products : lazy + standalone (loadComponent).
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },

  // Orders : eager + standalone (référence directe au composant standalone).
  { path: 'orders', component: OrdersComponent },

  // Settings : lazy + standalone (loadComponent).
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },

  { path: '**', redirectTo: 'dashboard' }
]

@NgModule({
  // ** POC ** useHash:true permet à ce router de cohabiter avec celui du
  // shell-modern (Angular 21) quand le legacy est monté en web component :
  // le shell utilise le path et le legacy utilise le fragment (#).
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

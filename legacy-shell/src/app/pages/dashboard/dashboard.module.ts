import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

import { StatCardComponent } from './components/stat-card/stat-card.component'
import { WelcomeBannerComponent } from './components/welcome-banner/welcome-banner.component'
import { DashboardComponent } from './dashboard.component'

/**
 * Module eager du dashboard.
 * Déclare les composants NgModule (DashboardComponent + WelcomeBanner) et
 * importe le composant standalone StatCardComponent. Démontre le mix des
 * deux styles dans une même feature.
 */
@NgModule({
  declarations: [DashboardComponent, WelcomeBannerComponent],
  imports: [CommonModule, MatIconModule, StatCardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {}

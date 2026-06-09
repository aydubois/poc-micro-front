import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

import { MfeOutletComponent } from '../../shared/mfe/mfe-outlet.component'
import { StatCardComponent } from './components/stat-card/stat-card.component'
import { WelcomeBannerComponent } from './components/welcome-banner/welcome-banner.component'
import { DashboardComponent } from './dashboard.component'

/**
 * Module eager du dashboard.
 * Déclare les composants NgModule (DashboardComponent + WelcomeBanner) et
 * importe les composants standalone (StatCard + MfeOutlet pour le widget MFE).
 */
@NgModule({
  declarations: [DashboardComponent, WelcomeBannerComponent],
  imports: [CommonModule, MatIconModule, StatCardComponent, MfeOutletComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {}

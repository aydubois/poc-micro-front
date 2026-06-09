import { Component } from '@angular/core'

/**
 * Bannière d'accueil du dashboard.
 * Composant non-standalone (NgModule), déclaré dans `DashboardModule`.
 */
@Component({
  selector: 'app-welcome-banner',
  templateUrl: './welcome-banner.component.html',
  styleUrls: ['./welcome-banner.component.scss']
})
export class WelcomeBannerComponent {
  readonly today: string = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

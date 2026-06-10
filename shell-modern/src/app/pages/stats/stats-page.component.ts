import { Component } from '@angular/core'

import { StatsHostComponent } from './stats-host.component'

/**
 * Page /stats — wrapper qui monte mfe-stats (Angular 18) via le pattern
 * web component (custom element + platform Angular 18 isolé).
 *
 * ** POC ** Le manifest fait pointer `mfeStats` sur le port 4201
 * (mfe-stats A18). On utilise StatsHostComponent (et non
 * `<app-mfe-outlet>`) pour la même raison que la page Notifications :
 * componentFactory.create cross-version A18 → A21 jette NG0203. La
 * version Angular 21 (mfe-stats-v21) reste disponible dans le manifest
 * sous la clé `mfeStatsV21` si besoin.
 */
@Component({
  selector: 'app-stats-page',
  imports: [StatsHostComponent],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.scss'
})
export class StatsPageComponent {}

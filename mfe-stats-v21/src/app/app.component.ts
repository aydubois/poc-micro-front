import { Component } from '@angular/core'

import { StatsWidgetComponent } from './stats-widget/stats-widget.component'

/**
 * ** POC ** Composant racine du micro-frontend en mode standalone (dev).
 * Utilisé uniquement sur :4203 pour visualiser le widget hors du shell.
 */
@Component({
  selector: 'app-root',
  imports: [StatsWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'mfe-stats-v21 (mode standalone)'
}

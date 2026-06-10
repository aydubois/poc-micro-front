import { Component } from '@angular/core'

import { StatsWidgetComponent } from './stats-widget/stats-widget.component'

/**
 * ** POC ** Composant racine du micro-frontend en mode standalone (dev local
 * sur :4201). En usage normal, c'est le widget qui est consommé via
 * Native Federation par les hosts.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StatsWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'mfe-stats (Angular 18, mode standalone)'
}

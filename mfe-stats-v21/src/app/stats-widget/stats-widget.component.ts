import { Component } from '@angular/core'

interface StatItem {
  label: string
  value: string
  delta: string
  icon: string
}

/**
 * Widget exposé par le micro-frontend mfe-stats-v21 (Angular 21).
 * Composant standalone signal-friendly — chargé dynamiquement par le shell
 * moderne via Native Federation native v21. Fond vert caractéristique pour
 * matérialiser visuellement la migration de version (v16 orange → v21 vert).
 */
@Component({
  selector: 'app-stats-widget-v21',
  templateUrl: './stats-widget.component.html',
  styleUrl: './stats-widget.component.scss'
})
export class StatsWidgetComponent {
  readonly stats: ReadonlyArray<StatItem> = [
    { label: 'Sessions actives', value: '1 312', delta: '+18% / 7j', icon: '📈' },
    { label: 'Conversion', value: '5,2 %', delta: '+0,4 pt / 7j', icon: '🎯' },
    { label: 'Temps moyen', value: '3 min 28', delta: '-22 s / 7j', icon: '⏱️' },
    { label: 'NPS', value: '+47', delta: '+3 pt / 7j', icon: '⭐' }
  ]
}

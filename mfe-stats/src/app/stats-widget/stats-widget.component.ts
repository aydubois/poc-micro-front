import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

interface StatItem {
  label: string
  value: string
  delta: string
  icon: string
}

/**
 * Widget exposé par le MFE mfe-stats.
 * Composant standalone — chargé dynamiquement par le legacy-shell via la
 * façade MFE. Fond orange caractéristique pour bien le repérer dans le host.
 */
@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.scss']
})
export class StatsWidgetComponent {
  readonly stats: ReadonlyArray<StatItem> = [
    { label: 'Sessions actives', value: '1 248', delta: '+12% / 7j', icon: '📈' },
    { label: 'Conversion', value: '4,8 %', delta: '+0,3 pt / 7j', icon: '🎯' },
    { label: 'Temps moyen', value: '3 min 42', delta: '-15 s / 7j', icon: '⏱️' }
  ]

  /**
   * trackBy pour la liste de stats.
   *
   * @param _index Index courant (non utilisé).
   * @param item Élément de stats.
   * @returns Libellé unique.
   */
  trackByLabel(_index: number, item: StatItem): string {
    return item.label
  }
}

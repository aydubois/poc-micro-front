import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  level: 'info' | 'warning' | 'success'
}

/**
 * Widget exposé par le MFE mfe-notifications.
 * Composant standalone — chargé dynamiquement par le legacy-shell via la
 * façade MFE. Fond violet caractéristique pour bien le repérer dans le host.
 */
@Component({
  selector: 'app-notifications-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-widget.component.html',
  styleUrls: ['./notifications-widget.component.scss']
})
export class NotificationsWidgetComponent {
  readonly notifications: ReadonlyArray<NotificationItem> = [
    { id: 'n-1', title: 'Nouvelle inscription', body: 'Hugo Simon vient de rejoindre la plateforme.', time: 'il y a 5 min', level: 'success' },
    { id: 'n-2', title: 'Quota presque atteint', body: 'Stockage à 87 % de la limite mensuelle.', time: 'il y a 1 h', level: 'warning' },
    { id: 'n-3', title: 'Maintenance programmée', body: 'Une fenêtre de maintenance est prévue dimanche 02:00–04:00.', time: 'il y a 3 h', level: 'info' },
    { id: 'n-4', title: 'Export terminé', body: 'L\'export "Utilisateurs Q2" est prêt au téléchargement.', time: 'hier', level: 'success' }
  ]

  /**
   * trackBy pour la liste de notifications.
   *
   * @param _index Index courant (non utilisé).
   * @param item Notification courante.
   * @returns Identifiant unique.
   */
  trackById(_index: number, item: NotificationItem): string {
    return item.id
  }
}

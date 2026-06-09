import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatLegacyCardModule } from '@angular/material/legacy-card'
import { MatChipsModule } from '@angular/material/chips'

import { Order } from '../../../../core/models/order.model'

/**
 * Carte commande standalone.
 * Utilise volontairement MatLegacyCard pour démontrer le mix Material
 * legacy/moderne dans un même composant standalone.
 */
@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, MatLegacyCardModule, MatChipsModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order

  /**
   * Retourne la couleur du chip selon le statut de la commande.
   *
   * @returns Classe CSS de modification.
   */
  get statusClass(): string {
    switch (this.order.status) {
      case 'paid': return 'is-paid'
      case 'shipped': return 'is-shipped'
      case 'delivered': return 'is-delivered'
      case 'cancelled': return 'is-cancelled'
      case 'pending':
      default: return 'is-pending'
    }
  }

  /**
   * Retourne le libellé fr du statut.
   *
   * @returns Libellé affiché à l'utilisateur.
   */
  get statusLabel(): string {
    switch (this.order.status) {
      case 'paid': return 'Payée'
      case 'shipped': return 'Expédiée'
      case 'delivered': return 'Livrée'
      case 'cancelled': return 'Annulée'
      case 'pending':
      default: return 'En attente'
    }
  }
}

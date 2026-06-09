import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'

import { Order } from '../../core/models/order.model'
import { OrderService } from '../../core/services/order.service'
import { OrderCardComponent } from './components/order-card/order-card.component'

/**
 * Page Commandes (eager + standalone).
 * Référencée directement dans app-routing avec `component:` (pas de
 * loadComponent) pour rester eager. Démontre le mode standalone + chargement
 * non lazy.
 */
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService)

  orders: Order[] = []
  isLoading = true

  ngOnInit(): void {
    this.loadOrders()
  }

  /**
   * Charge la liste des commandes depuis le service mock.
   */
  private loadOrders(): void {
    this.isLoading = true
    this.orderService.list().subscribe({
      next: list => {
        this.orders = list
        this.isLoading = false
      },
      error: err => {
        this.isLoading = false
        console.error('[OrdersComponent.loadOrders] Échec du chargement:', err)
      }
    })
  }

  /**
   * trackBy pour la liste des commandes.
   *
   * @param _index Index courant (non utilisé).
   * @param order Commande en cours.
   * @returns Identifiant unique.
   */
  trackById(_index: number, order: Order): string {
    return order.id
  }
}

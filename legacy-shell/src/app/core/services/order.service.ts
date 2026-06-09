import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'

import { Order } from '../models/order.model'

const MOCK_ORDERS: Order[] = [
  { id: 'o-001', reference: 'CMD-2026-0001', customerName: 'Alice Martin', totalAmount: 245.8, status: 'paid', createdAt: '2026-05-21' },
  { id: 'o-002', reference: 'CMD-2026-0002', customerName: 'Bertrand Dupont', totalAmount: 89.5, status: 'pending', createdAt: '2026-05-23' },
  { id: 'o-003', reference: 'CMD-2026-0003', customerName: 'Camille Leroy', totalAmount: 419.9, status: 'shipped', createdAt: '2026-05-24' },
  { id: 'o-004', reference: 'CMD-2026-0004', customerName: 'David Bernard', totalAmount: 59.0, status: 'cancelled', createdAt: '2026-05-25' },
  { id: 'o-005', reference: 'CMD-2026-0005', customerName: 'Élodie Petit', totalAmount: 132.4, status: 'delivered', createdAt: '2026-05-27' },
  { id: 'o-006', reference: 'CMD-2026-0006', customerName: 'Florian Roux', totalAmount: 78.9, status: 'paid', createdAt: '2026-06-01' },
  { id: 'o-007', reference: 'CMD-2026-0007', customerName: 'Gabrielle Moreau', totalAmount: 312.5, status: 'pending', createdAt: '2026-06-04' },
  { id: 'o-008', reference: 'CMD-2026-0008', customerName: 'Hugo Simon', totalAmount: 49.0, status: 'shipped', createdAt: '2026-06-07' }
]

/**
 * Service mock in-memory pour les commandes.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  /**
   * Liste toutes les commandes.
   *
   * @returns Observable émettant le tableau complet des commandes mockées.
   */
  list(): Observable<Order[]> {
    return of(MOCK_ORDERS).pipe(delay(150))
  }

  /**
   * Calcule le revenu cumulé des commandes payées (utilisé pour le dashboard).
   *
   * @returns Observable émettant le total en euros.
   */
  totalRevenue(): Observable<number> {
    const revenue = MOCK_ORDERS
      .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
      .reduce((acc, o) => acc + o.totalAmount, 0)
    return of(revenue).pipe(delay(100))
  }
}

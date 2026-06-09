import { Component, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { OrderService } from '../../core/services/order.service'
import { ProductService } from '../../core/services/product.service'
import { UserService } from '../../core/services/user.service'

/**
 * Page tableau de bord (eager + NgModule).
 * Affiche un en-tête de bienvenue, trois cartes de stats globales, puis un
 * emplacement pour un widget MFE (intégré en tâche 8 du POC).
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly userService = inject(UserService)
  private readonly productService = inject(ProductService)
  private readonly orderService = inject(OrderService)

  activeUsers$!: Observable<number>
  availableProducts$!: Observable<number>
  totalRevenue$!: Observable<number>

  ngOnInit(): void {
    this.activeUsers$ = this.userService.countActive()
    this.availableProducts$ = this.productService.countAvailable()
    this.totalRevenue$ = this.orderService.totalRevenue()
  }
}

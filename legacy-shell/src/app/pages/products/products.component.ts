import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'

import { Product } from '../../core/models/product.model'
import { ProductService } from '../../core/services/product.service'
import { ProductCardComponent } from './components/product-card/product-card.component'

/**
 * Page Produits (lazy + standalone).
 * Affiche une grille de cartes produit en Material moderne (mat-card).
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService)

  products: Product[] = []
  isLoading = true

  ngOnInit(): void {
    this.loadProducts()
  }

  /**
   * Charge le catalogue produits depuis le service mock.
   */
  private loadProducts(): void {
    this.isLoading = true
    this.productService.list().subscribe({
      next: list => {
        this.products = list
        this.isLoading = false
      },
      error: err => {
        this.isLoading = false
        console.error('[ProductsComponent.loadProducts] Échec du chargement:', err)
      }
    })
  }

  /**
   * trackBy pour la grille produit.
   *
   * @param _index Index courant (non utilisé).
   * @param product Produit en cours.
   * @returns Identifiant unique.
   */
  trackById(_index: number, product: Product): string {
    return product.id
  }
}

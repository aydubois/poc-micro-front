import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'

import { Product } from '../models/product.model'

const MOCK_PRODUCTS: Product[] = [
  { id: 'p-001', name: 'Casque audio sans-fil', sku: 'AUD-WL-001', category: 'Audio', price: 129.9, stock: 42, isAvailable: true },
  { id: 'p-002', name: 'Clavier mécanique RGB', sku: 'KB-RGB-002', category: 'Périphériques', price: 89.5, stock: 18, isAvailable: true },
  { id: 'p-003', name: 'Souris ergonomique', sku: 'MS-ERG-003', category: 'Périphériques', price: 49.0, stock: 0, isAvailable: false },
  { id: 'p-004', name: 'Écran 27" 4K', sku: 'SC-4K-004', category: 'Affichage', price: 399.0, stock: 7, isAvailable: true },
  { id: 'p-005', name: 'Webcam HD 1080p', sku: 'CAM-HD-005', category: 'Périphériques', price: 69.9, stock: 25, isAvailable: true },
  { id: 'p-006', name: 'Microphone USB studio', sku: 'MIC-USB-006', category: 'Audio', price: 119.0, stock: 12, isAvailable: true },
  { id: 'p-007', name: 'Tapis de souris XL', sku: 'PAD-XL-007', category: 'Accessoires', price: 24.5, stock: 60, isAvailable: true },
  { id: 'p-008', name: 'Hub USB-C 7 ports', sku: 'HUB-7-008', category: 'Accessoires', price: 39.9, stock: 33, isAvailable: true },
  { id: 'p-009', name: 'Disque SSD 1To', sku: 'SSD-1T-009', category: 'Stockage', price: 119.0, stock: 0, isAvailable: false },
  { id: 'p-010', name: 'Chargeur sans fil 15W', sku: 'CHG-WL-010', category: 'Accessoires', price: 29.9, stock: 50, isAvailable: true }
]

/**
 * Service mock in-memory pour les produits.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  /**
   * Liste tous les produits du catalogue.
   *
   * @returns Observable émettant le tableau complet des produits mockés.
   */
  list(): Observable<Product[]> {
    return of(MOCK_PRODUCTS).pipe(delay(150))
  }

  /**
   * Compte le nombre de produits disponibles (utilisé pour le dashboard).
   *
   * @returns Observable émettant un entier.
   */
  countAvailable(): Observable<number> {
    return of(MOCK_PRODUCTS.filter(p => p.isAvailable).length).pipe(delay(100))
  }
}

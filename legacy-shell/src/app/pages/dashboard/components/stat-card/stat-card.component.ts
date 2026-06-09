import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'

/**
 * Carte de statistique affichée sur le dashboard.
 * Composant standalone — cohabitation volontaire avec des composants
 * NgModule pour démontrer le mix attendu dans le POC.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input({ required: true }) label!: string
  @Input({ required: true }) value!: string | number
  @Input({ required: true }) icon!: string
  @Input() trend: 'up' | 'down' | 'flat' = 'flat'
  @Input() accent: 'primary' | 'success' | 'warn' = 'primary'
}

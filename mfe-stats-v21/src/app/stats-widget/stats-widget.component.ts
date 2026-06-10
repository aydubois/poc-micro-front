import { Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { getSharedBus, SharedUser } from 'shared-bus'

interface StatItem {
  label: string
  value: string
  delta: string
  icon: string
}

/**
 * Widget exposé par le micro-frontend mfe-stats-v21 (Angular 21).
 * Composant standalone signal-friendly — chargé dynamiquement par le shell
 * moderne via Native Federation natif. Fond vert caractéristique pour
 * matérialiser visuellement la migration v16 → v21.
 *
 * Lit l'utilisateur courant via shared-bus pour personnaliser l'en-tête —
 * démontre la propagation cross-app du bus partagé.
 */
@Component({
  selector: 'app-stats-widget-v21',
  templateUrl: './stats-widget.component.html',
  styleUrl: './stats-widget.component.scss'
})
export class StatsWidgetComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly bus = getSharedBus()

  readonly currentUser = signal<SharedUser | null>(this.bus.user$.value)

  readonly stats: ReadonlyArray<StatItem> = [
    { label: 'Sessions actives', value: '1 312', delta: '+18% / 7j', icon: '📈' },
    { label: 'Conversion', value: '5,2 %', delta: '+0,4 pt / 7j', icon: '🎯' },
    { label: 'Temps moyen', value: '3 min 28', delta: '-22 s / 7j', icon: '⏱️' },
    { label: 'NPS', value: '+47', delta: '+3 pt / 7j', icon: '⭐' }
  ]

  constructor() {
    this.bus.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.currentUser.set(user))
  }
}

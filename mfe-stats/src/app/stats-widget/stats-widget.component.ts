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
 * Widget exposé par le micro-frontend mfe-stats (Angular 18).
 * Composant standalone signal-friendly — chargé dynamiquement par les hosts
 * via Native Federation. Fond orange caractéristique pour bien le repérer.
 *
 * Lit l'utilisateur courant via shared-bus pour personnaliser l'en-tête.
 */
@Component({
  selector: 'app-stats-widget',
  standalone: true,
  templateUrl: './stats-widget.component.html',
  styleUrls: ['./stats-widget.component.scss']
})
export class StatsWidgetComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly bus = getSharedBus()

  readonly currentUser = signal<SharedUser | null>(this.bus.user$.value)

  readonly stats: ReadonlyArray<StatItem> = [
    { label: 'Sessions actives', value: '1 248', delta: '+12% / 7j', icon: '📈' },
    { label: 'Conversion', value: '4,8 %', delta: '+0,3 pt / 7j', icon: '🎯' },
    { label: 'Temps moyen', value: '3 min 42', delta: '-15 s / 7j', icon: '⏱️' }
  ]

  constructor() {
    this.bus.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.currentUser.set(user))
  }
}

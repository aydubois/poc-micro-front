import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { loadRemoteModule } from '@angular-architects/native-federation'
import { Subscription } from 'rxjs'

interface LegacyAppRegister {
  registerLegacyApp: () => Promise<void>
}

/**
 * Page-hôte qui monte le legacy en custom element via Native Federation.
 *
 * - Au premier mount, charge le remote `legacyShell` et appelle sa fonction
 *   `registerLegacyApp` qui définit le custom element `<legacy-app>`.
 * - La section affichée par le legacy est synchronisée avec le paramètre
 *   d'URL `section` (dashboard, users, products, orders, settings).
 * - Le composant est partagé entre les 5 routes paramétrées : Angular
 *   réutilise l'instance (même config + même classe) au changement de
 *   paramètre, évitant un unmount/remount du custom element.
 */
@Component({
  selector: 'app-legacy-host',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './legacy-host.component.html',
  styleUrl: './legacy-host.component.scss'
})
export class LegacyHostComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute)

  readonly isReady = signal(false)
  readonly errorMessage = signal('')
  readonly section = signal<string>('dashboard')

  private readonly paramsSub: Subscription

  constructor() {
    void this.ensureLegacyRegistered()
    this.paramsSub = this.route.params.subscribe(params => {
      const next = params['section'] as string | undefined
      if (next) this.section.set(next)
    })
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe()
  }

  /**
   * Charge le remote legacyShell (si pas déjà fait) puis appelle son
   * registerLegacyApp pour définir le custom element.
   */
  private async ensureLegacyRegistered(): Promise<void> {
    try {
      const mod = await loadRemoteModule('legacyShell', './LegacyApp') as LegacyAppRegister
      if (typeof mod.registerLegacyApp !== 'function') {
        throw new Error('Le module exposé ne contient pas la fonction registerLegacyApp.')
      }
      await mod.registerLegacyApp()
      this.isReady.set(true)
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erreur de chargement du legacy.')
      console.error('[LegacyHostComponent.ensureLegacyRegistered]', err)
    }
  }
}

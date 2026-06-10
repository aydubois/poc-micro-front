import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

interface StatsAppRegister {
  registerStatsApp: () => Promise<void>
}

/**
 * Host qui monte mfe-stats (Angular 18) en custom element `<mfe-stats>`
 * via Native Federation.
 *
 * ** POC ** On ne charge PAS le composant standalone exposé via `./Widget`
 * directement : componentFactory.create cross-version A18 → A21 jette
 * NG0203 (même mur que mfe-notifications avant la bascule). À la place,
 * on charge `./StatsElement` qui retourne `registerStatsApp()`. Ce dernier
 * bootstrap un platform Angular 18 isolé puis définit `<mfe-stats>`. Le
 * shell A21 ne voit qu'un nœud DOM — aucun share scope cross-version
 * requis.
 */
@Component({
  selector: 'app-stats-host',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './stats-host.component.html',
  styleUrl: './stats-host.component.scss'
})
export class StatsHostComponent {
  readonly isReady = signal(false)
  readonly errorMessage = signal('')

  constructor() {
    void this.ensureStatsRegistered()
  }

  /**
   * Charge le remote mfeStats (si pas déjà fait) puis appelle son
   * registerStatsApp pour définir le custom element.
   */
  private async ensureStatsRegistered(): Promise<void> {
    try {
      const mod = await loadRemoteModule('mfeStats', './StatsElement') as StatsAppRegister
      if (typeof mod.registerStatsApp !== 'function') {
        throw new Error('Le module exposé ne contient pas la fonction registerStatsApp.')
      }
      await mod.registerStatsApp()
      this.isReady.set(true)
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erreur de chargement de mfe-stats.')
      console.error('[StatsHostComponent.ensureStatsRegistered]', err)
    }
  }
}

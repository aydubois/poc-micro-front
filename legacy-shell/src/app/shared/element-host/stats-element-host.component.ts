import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

interface StatsAppRegister {
  registerStatsApp: () => Promise<void>
}

const ELEMENT_NAME = 'mfe-stats'

/**
 * Host legacy pour le custom element `<mfe-stats>` exposé par mfe-stats
 * (Angular 18). Réutilisable dans n'importe quelle page legacy.
 *
 * ** POC ** Deux modes de fonctionnement selon le contexte d'exécution :
 * - **Legacy standalone (port 4200)** : `initFederation()` tourne dans
 *   `main.ts`, donc `loadRemoteModule` résout. On charge `./StatsElement`
 *   du remote mfeStats puis on appelle `registerStatsApp()` qui définit
 *   `<mfe-stats>` globalement.
 * - **Legacy embarqué dans le shell moderne** : `initFederation()` a été
 *   retiré (cf. README — évite "Rejected map override"). Le shell
 *   pré-enregistre `<mfe-stats>` au boot via un APP_INITIALIZER. Notre
 *   `loadRemoteModule` jette donc une erreur silencieuse, et on tombe sur
 *   le fallback `customElements.whenDefined` qui résout dès que le shell
 *   a fini de pré-enregistrer.
 */
@Component({
  selector: 'app-stats-element-host',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats-element-host.component.html',
  styleUrls: ['./stats-element-host.component.scss']
})
export class StatsElementHostComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef)

  isReady = false
  errorMessage = ''

  ngOnInit(): void {
    void this.ensureRegistered()
  }

  /**
   * S'assure que le custom element <mfe-stats> est défini, soit en
   * déclenchant l'enregistrement via Native Federation locale, soit en
   * attendant que le shell ait pré-enregistré l'élément.
   */
  private async ensureRegistered(): Promise<void> {
    if (customElements.get(ELEMENT_NAME)) {
      this.markReady()
      return
    }

    try {
      const mod = await loadRemoteModule('mfeStats', './StatsElement') as StatsAppRegister
      await mod.registerStatsApp()
      this.markReady()
    } catch (err) {
      console.warn('[StatsElementHostComponent] loadRemoteModule indisponible, fallback whenDefined :', err)
      try {
        await customElements.whenDefined(ELEMENT_NAME)
        this.markReady()
      } catch (fallbackErr) {
        this.errorMessage = fallbackErr instanceof Error
          ? fallbackErr.message
          : 'Custom element <mfe-stats> indisponible.'
        this.changeDetector.markForCheck()
      }
    }
  }

  /**
   * Bascule l'état de l'host en "prêt" et notifie OnPush.
   */
  private markReady(): void {
    this.isReady = true
    this.changeDetector.markForCheck()
  }
}

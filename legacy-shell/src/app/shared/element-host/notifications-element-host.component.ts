import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

interface NotificationsAppRegister {
  registerNotificationsApp: () => Promise<void>
}

const ELEMENT_NAME = 'mfe-notifications'

/**
 * Host legacy pour le custom element `<mfe-notifications>` exposé par
 * mfe-notifications (Angular 16).
 *
 * ** POC ** Même stratégie que StatsElementHostComponent :
 * - Standalone : `loadRemoteModule` via la runtime Native Federation locale
 *   du legacy puis `registerNotificationsApp()`.
 * - Embarqué dans le shell : fallback `customElements.whenDefined`, le
 *   shell ayant pré-enregistré l'élément au boot via APP_INITIALIZER.
 */
@Component({
  selector: 'app-notifications-element-host',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications-element-host.component.html',
  styleUrls: ['./notifications-element-host.component.scss']
})
export class NotificationsElementHostComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef)

  isReady = false
  errorMessage = ''

  ngOnInit(): void {
    void this.ensureRegistered()
  }

  /**
   * S'assure que le custom element <mfe-notifications> est défini, soit
   * en déclenchant l'enregistrement via Native Federation locale, soit en
   * attendant que le shell ait pré-enregistré l'élément.
   */
  private async ensureRegistered(): Promise<void> {
    if (customElements.get(ELEMENT_NAME)) {
      this.markReady()
      return
    }

    try {
      const mod = await loadRemoteModule('mfeNotifications', './NotificationsElement') as NotificationsAppRegister
      await mod.registerNotificationsApp()
      this.markReady()
    } catch (err) {
      console.warn('[NotificationsElementHostComponent] loadRemoteModule indisponible, fallback whenDefined :', err)
      try {
        await customElements.whenDefined(ELEMENT_NAME)
        this.markReady()
      } catch (fallbackErr) {
        this.errorMessage = fallbackErr instanceof Error
          ? fallbackErr.message
          : 'Custom element <mfe-notifications> indisponible.'
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

import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

interface NotificationsAppRegister {
  registerNotificationsApp: () => Promise<void>
}

/**
 * Host qui monte mfe-notifications (Angular 16) en custom element
 * `<mfe-notifications>` via Native Federation.
 *
 * ** POC ** On ne charge PAS le composant standalone exposé via `./Widget`
 * directement (componentFactory.create cross-version A16 → A21 jette
 * NG0203). À la place, on charge `./NotificationsElement` qui retourne
 * `registerNotificationsApp()`. Ce dernier bootstrap un platform Angular
 * 16 isolé puis définit `<mfe-notifications>`. Le shell A21 ne voit
 * qu'un nœud DOM — aucun share scope cross-version requis.
 */
@Component({
  selector: 'app-notifications-host',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './notifications-host.component.html',
  styleUrl: './notifications-host.component.scss'
})
export class NotificationsHostComponent {
  readonly isReady = signal(false)
  readonly errorMessage = signal('')

  constructor() {
    void this.ensureNotificationsRegistered()
  }

  /**
   * Charge le remote mfeNotifications (si pas déjà fait) puis appelle son
   * registerNotificationsApp pour définir le custom element.
   */
  private async ensureNotificationsRegistered(): Promise<void> {
    try {
      const mod = await loadRemoteModule('mfeNotifications', './NotificationsElement') as NotificationsAppRegister
      if (typeof mod.registerNotificationsApp !== 'function') {
        throw new Error('Le module exposé ne contient pas la fonction registerNotificationsApp.')
      }
      await mod.registerNotificationsApp()
      this.isReady.set(true)
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erreur de chargement de mfe-notifications.')
      console.error('[NotificationsHostComponent.ensureNotificationsRegistered]', err)
    }
  }
}

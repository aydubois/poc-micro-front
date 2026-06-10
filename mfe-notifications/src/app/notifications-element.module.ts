import { CommonModule } from '@angular/common'
import { DoBootstrap, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { NotificationsWidgetComponent } from './notifications-widget/notifications-widget.component'

/**
 * ** POC ** Module utilisé lorsque mfe-notifications est consommé par le
 * shell moderne (Angular 21) en mode web component.
 *
 * `NotificationsWidgetComponent` est standalone donc on ne le déclare pas ;
 * on s'assure simplement que BrowserModule + CommonModule sont disponibles
 * dans le platform Angular 16 isolé. La définition du custom element
 * `<mfe-notifications>` se fait dans notifications-app.element.ts.
 */
@NgModule({
  imports: [BrowserModule, CommonModule, NotificationsWidgetComponent]
})
export class NotificationsElementModule implements DoBootstrap {
  /**
   * Empêche l'auto-bootstrap : la création du custom element se fait à la
   * demande via createCustomElement dans registerNotificationsApp().
   */
  ngDoBootstrap(): void {
    /* intentionally empty */
  }
}

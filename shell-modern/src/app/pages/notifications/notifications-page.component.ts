import { Component } from '@angular/core'

import { NotificationsHostComponent } from './notifications-host.component'

/**
 * Page /notifications — wrapper qui monte mfe-notifications via le
 * pattern web component (custom element + platform Angular 16 isolé).
 *
 * ** POC ** On n'utilise plus `<app-mfe-outlet>` ici. La tentative
 * d'instancier un composant standalone A16 dans un host A21 via
 * componentFactory.create jetait NG0203 depuis la migration de
 * mfe-stats en Angular 18 (qui a cassé l'équilibre du share scope
 * Native Federation cross-version).
 */
@Component({
  selector: 'app-notifications-page',
  imports: [NotificationsHostComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {}

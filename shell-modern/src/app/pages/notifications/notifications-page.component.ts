import { Component } from '@angular/core'

import { MfeOutletComponent } from '../../shared/mfe/mfe-outlet.component'

/**
 * Page /notifications — wrapper qui monte le micro-frontend Notifications
 * via Native Federation.
 */
@Component({
  selector: 'app-notifications-page',
  imports: [MfeOutletComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {}

import { Component } from '@angular/core'

/**
 * ** POC ** Composant racine du MFE en mode standalone (dev local sur :4202).
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'mfe-notifications (mode standalone)'
}

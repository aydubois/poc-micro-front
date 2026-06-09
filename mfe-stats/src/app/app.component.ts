import { Component } from '@angular/core'

/**
 * ** POC ** Composant racine du MFE en mode standalone.
 * Sert uniquement pour le dev local (`ng serve mfe-stats` sur :4201) afin
 * de vérifier le rendu du widget hors du host. En prod le MFE est
 * uniquement consommé par le shell via Module Federation.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'mfe-stats (mode standalone)'
}

import { DoBootstrap, NgModule } from '@angular/core'

import { AppModule } from './app.module'

/**
 * ** POC ** Module utilisé lorsque le legacy-shell est consommé en web
 * component par le shell moderne.
 *
 * Il importe tout AppModule (pour récupérer les services, routes, modules
 * Material, etc.) mais ne déclenche AUCUN bootstrap automatique : la
 * définition du custom element se fait dans legacy-app.element.ts.
 */
@NgModule({
  imports: [AppModule]
})
export class LegacyElementModule implements DoBootstrap {
  /**
   * Empêche l'auto-bootstrap d'AppComponent : la création de l'élément se
   * fait à la demande via createCustomElement.
   */
  ngDoBootstrap(): void {
    /* intentionally empty */
  }
}

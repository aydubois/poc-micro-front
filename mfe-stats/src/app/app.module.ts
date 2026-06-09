import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { StatsWidgetComponent } from './stats-widget/stats-widget.component'

/**
 * ** POC ** Module racine du MFE — utilisé uniquement en mode standalone
 * (dev). Le composant exposé via MF n'a pas besoin de passer par ce module
 * côté host (chargement dynamique direct du standalone).
 */
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StatsWidgetComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { CommonModule } from '@angular/common'
import { DoBootstrap, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { StatsWidgetComponent } from './stats-widget/stats-widget.component'

/**
 * ** POC ** Module utilisé lorsque mfe-stats (Angular 18) est consommé par
 * le shell moderne (Angular 21) en mode web component.
 *
 * Calque NotificationsElementModule : on importe BrowserModule + le widget
 * standalone, et on désactive l'auto-bootstrap. La définition du custom
 * element `<mfe-stats>` se fait à la demande dans stats-app.element.ts.
 */
@NgModule({
  imports: [BrowserModule, CommonModule, StatsWidgetComponent]
})
export class StatsElementModule implements DoBootstrap {
  /**
   * Empêche l'auto-bootstrap : la création du custom element se fait à la
   * demande via createCustomElement dans registerStatsApp().
   */
  ngDoBootstrap(): void {
    /* intentionally empty */
  }
}

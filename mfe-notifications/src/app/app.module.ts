import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { NotificationsWidgetComponent } from './notifications-widget/notifications-widget.component'

/**
 * ** POC ** Module racine du MFE — utilisé uniquement en mode standalone (dev).
 */
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NotificationsWidgetComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

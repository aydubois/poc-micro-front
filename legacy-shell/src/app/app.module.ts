import { registerLocaleData } from '@angular/common'
import localeFr from '@angular/common/locales/fr'
import { LOCALE_ID, NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DashboardModule } from './pages/dashboard/dashboard.module'
import { OrdersComponent } from './pages/orders/orders.component'

// ** POC ** Enregistre la locale fr pour le pipe currency utilisé par
// Products/Orders. En mode embarqué via Native Federation, l'auto-chargement
// des locales d'Angular ne s'applique pas — on inscrit explicitement la
// donnée au démarrage du module.
registerLocaleData(localeFr, 'fr')

/**
 * Module racine du legacy-shell.
 * Importe les modules Material utilisés par le layout (toolbar + sidenav),
 * la feature Dashboard en eager (DashboardModule), et le composant Orders
 * en eager (standalone importé directement).
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    DashboardModule,
    OrdersComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

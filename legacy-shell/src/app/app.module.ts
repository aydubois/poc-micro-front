import { NgModule } from '@angular/core'
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

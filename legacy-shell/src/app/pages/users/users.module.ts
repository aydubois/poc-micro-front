import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule } from '@angular/material/legacy-button'
import { MatLegacyTableModule } from '@angular/material/legacy-table'

import { MfeOutletComponent } from '../../shared/mfe/mfe-outlet.component'
import { UserRowComponent } from './components/user-row/user-row.component'
import { UsersRoutingModule } from './users-routing.module'
import { UsersComponent } from './users.component'

/**
 * Feature module Users — lazy loaded depuis app-routing.
 * Utilise volontairement Material Legacy (MatLegacyTable + MatLegacyButton)
 * pour démontrer le mix legacy/moderne. Importe aussi le MfeOutlet pour
 * intégrer dynamiquement le widget MFE notifications.
 */
@NgModule({
  declarations: [UsersComponent, UserRowComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatLegacyTableModule,
    MatLegacyButtonModule,
    MfeOutletComponent
  ]
})
export class UsersModule {}

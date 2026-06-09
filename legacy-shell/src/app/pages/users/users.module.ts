import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule } from '@angular/material/legacy-button'
import { MatLegacyTableModule } from '@angular/material/legacy-table'

import { UserRowComponent } from './components/user-row/user-row.component'
import { UsersRoutingModule } from './users-routing.module'
import { UsersComponent } from './users.component'

/**
 * Feature module Users — lazy loaded depuis app-routing.
 * Utilise volontairement Material Legacy (MatLegacyTable + MatLegacyButton)
 * pour démontrer le mix legacy/moderne attendu dans le POC.
 */
@NgModule({
  declarations: [UsersComponent, UserRowComponent],
  imports: [CommonModule, UsersRoutingModule, MatLegacyTableModule, MatLegacyButtonModule]
})
export class UsersModule {}

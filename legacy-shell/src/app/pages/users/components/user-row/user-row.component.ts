import { Component, EventEmitter, Input, Output } from '@angular/core'

import { User } from '../../../../core/models/user.model'

/**
 * Ligne d'utilisateur affichée dans le tableau.
 * Composant non-standalone — déclaré dans UsersModule pour démontrer la
 * cohabitation NgModule/standalone du POC.
 */
@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.scss']
})
export class UserRowComponent {
  @Input({ required: true }) user!: User

  @Output() userToggled = new EventEmitter<User>()

  /**
   * Bascule l'état actif/inactif d'un utilisateur (action mockée).
   */
  onToggle(): void {
    this.userToggled.emit(this.user)
  }
}

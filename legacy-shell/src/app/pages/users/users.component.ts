import { Component, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { User } from '../../core/models/user.model'
import { UserService } from '../../core/services/user.service'

/**
 * Page Utilisateurs (lazy + NgModule).
 * Affiche les utilisateurs via un MatLegacyTable + une section "Récents" en
 * cartes (UserRowComponent). Volontairement basée sur des modules Material
 * Legacy (`mat-legacy-*`) pour démontrer le mix exigé.
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService)

  users: User[] = []
  recentUsers: User[] = []
  isLoading = true

  readonly displayedColumns: ReadonlyArray<string> = ['identity', 'email', 'role', 'status', 'createdAt']

  ngOnInit(): void {
    this.loadUsers()
  }

  /**
   * Charge la liste des utilisateurs depuis le service mock.
   */
  private loadUsers(): void {
    this.isLoading = true
    this.userService.list().subscribe({
      next: list => {
        this.users = list
        this.recentUsers = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)
        this.isLoading = false
      },
      error: err => {
        this.isLoading = false
        console.error('[UsersComponent.loadUsers] Échec du chargement:', err)
      }
    })
  }

  /**
   * Bascule l'état actif d'un utilisateur (action mockée, mise à jour locale).
   *
   * @param target Utilisateur sur lequel agir.
   */
  onUserToggled(target: User): void {
    this.users = this.users.map(u => u.id === target.id ? { ...u, isActive: !u.isActive } : u)
    this.recentUsers = this.recentUsers.map(u => u.id === target.id ? { ...u, isActive: !u.isActive } : u)
  }

  /**
   * trackBy pour le tableau.
   *
   * @param _index Index courant (non utilisé).
   * @param user Utilisateur en cours.
   * @returns Identifiant unique.
   */
  trackById(_index: number, user: User): string {
    return user.id
  }
}

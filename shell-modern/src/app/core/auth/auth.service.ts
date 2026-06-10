import { Injectable, computed, signal } from '@angular/core'

import { User } from './user.model'

const STORAGE_KEY = 'poc.shell-modern.user'

/**
 * ** POC ** Auth fake signal-based.
 * Le login accepte les identifiants `admin/admin`. L'utilisateur courant est
 * persisté dans localStorage pour survivre aux rafraîchissements. Aucune
 * gestion de token JWT — strict mock pour démontrer l'UX d'authentification.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userState = signal<User | null>(this.readStoredUser())

  readonly currentUser = this.userState.asReadonly()
  readonly isAuthenticated = computed(() => this.userState() !== null)

  /**
   * Tente une connexion fake. Seul `admin/admin` est accepté.
   *
   * @param username Identifiant saisi.
   * @param password Mot de passe saisi.
   * @returns true si le login réussit, false sinon.
   */
  login(username: string, password: string): boolean {
    if (username !== 'admin' || password !== 'admin') {
      return false
    }
    const user: User = {
      id: 'u-shell-admin',
      username,
      displayName: 'Administrateur POC',
      roles: ['admin']
    }
    this.userState.set(user)
    this.persistUser(user)
    return true
  }

  /**
   * Déconnecte l'utilisateur et purge la persistance.
   */
  logout(): void {
    this.userState.set(null)
    this.persistUser(null)
  }

  /**
   * Lit l'utilisateur du localStorage (au démarrage).
   *
   * @returns Utilisateur stocké ou null si inexistant/invalide.
   */
  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as User
    } catch (err) {
      console.error('[AuthService.readStoredUser] localStorage corrompu:', err)
      return null
    }
  }

  /**
   * Persiste (ou supprime) l'utilisateur dans le localStorage.
   *
   * @param user Utilisateur à persister, ou null pour purger.
   */
  private persistUser(user: User | null): void {
    try {
      if (user === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      }
    } catch (err) {
      console.error('[AuthService.persistUser] échec d\'écriture:', err)
    }
  }
}

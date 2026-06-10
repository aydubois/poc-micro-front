import { Injectable, computed, signal } from '@angular/core'
import { getSharedBus } from 'shared-bus'

import { User } from './user.model'

const STORAGE_KEY = 'poc.shell-modern.user'

/**
 * ** POC ** Auth fake signal-based.
 * Le login accepte les identifiants `admin/admin`. L'utilisateur courant est
 * persisté dans localStorage pour survivre aux rafraîchissements. Aucune
 * gestion de token JWT — strict mock pour démontrer l'UX d'authentification.
 *
 * À chaque changement d'utilisateur, on pousse l'état dans le bus partagé
 * (shared-bus.user$) pour que toutes les autres apps (legacy + micro-frontends)
 * voient instantanément la mise à jour.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly bus = getSharedBus()
  private readonly userState = signal<User | null>(this.readStoredUser())

  readonly currentUser = this.userState.asReadonly()
  readonly isAuthenticated = computed(() => this.userState() !== null)

  constructor() {
    // ** POC ** au démarrage, on pousse l'utilisateur persisté (s'il existe)
    // dans le bus pour que les apps qui se chargent ensuite y aient accès.
    this.bus.user$.next(this.userState())
  }

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
    this.bus.user$.next(user)
    return true
  }

  /**
   * Déconnecte l'utilisateur et purge la persistance.
   */
  logout(): void {
    this.userState.set(null)
    this.persistUser(null)
    this.bus.user$.next(null)
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

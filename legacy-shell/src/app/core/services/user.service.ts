import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'

import { User } from '../models/user.model'

const MOCK_USERS: User[] = [
  { id: 'u-001', firstName: 'Alice', lastName: 'Martin', email: 'alice.martin@example.com', role: 'admin', isActive: true, createdAt: '2024-11-14' },
  { id: 'u-002', firstName: 'Bertrand', lastName: 'Dupont', email: 'bertrand.dupont@example.com', role: 'editor', isActive: true, createdAt: '2025-02-03' },
  { id: 'u-003', firstName: 'Camille', lastName: 'Leroy', email: 'camille.leroy@example.com', role: 'viewer', isActive: false, createdAt: '2025-04-22' },
  { id: 'u-004', firstName: 'David', lastName: 'Bernard', email: 'david.bernard@example.com', role: 'editor', isActive: true, createdAt: '2025-06-10' },
  { id: 'u-005', firstName: 'Élodie', lastName: 'Petit', email: 'elodie.petit@example.com', role: 'viewer', isActive: true, createdAt: '2025-09-01' },
  { id: 'u-006', firstName: 'Florian', lastName: 'Roux', email: 'florian.roux@example.com', role: 'admin', isActive: false, createdAt: '2025-12-15' },
  { id: 'u-007', firstName: 'Gabrielle', lastName: 'Moreau', email: 'gabrielle.moreau@example.com', role: 'editor', isActive: true, createdAt: '2026-01-20' },
  { id: 'u-008', firstName: 'Hugo', lastName: 'Simon', email: 'hugo.simon@example.com', role: 'viewer', isActive: true, createdAt: '2026-03-08' }
]

/**
 * Service mock in-memory pour les utilisateurs.
 * Renvoie des observables avec un léger délai pour simuler une latence réseau.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * Liste tous les utilisateurs disponibles.
   *
   * @returns Observable émettant le tableau complet des utilisateurs mockés.
   */
  list(): Observable<User[]> {
    return of(MOCK_USERS).pipe(delay(150))
  }

  /**
   * Compte le nombre d'utilisateurs actifs (utilisé pour le dashboard).
   *
   * @returns Observable émettant un entier représentant le nombre d'actifs.
   */
  countActive(): Observable<number> {
    return of(MOCK_USERS.filter(u => u.isActive).length).pipe(delay(100))
  }
}

import { BehaviorSubject } from 'rxjs'

/**
 * Utilisateur courant tel que perçu par tous les acteurs du POC.
 * Aligné avec la forme produite par le shell-modern à la connexion.
 */
export interface SharedUser {
  id: string
  username: string
  displayName: string
  roles: ReadonlyArray<string>
}

export type SharedTheme = 'light' | 'dark'

export interface SharedBus {
  user$: BehaviorSubject<SharedUser | null>
  theme$: BehaviorSubject<SharedTheme>
  cart$: BehaviorSubject<number>
}

const GLOBAL_KEY = '__pocSharedBus__'

/**
 * Crée une nouvelle instance de bus avec des valeurs neutres.
 * Utilisée uniquement la première fois.
 *
 * @returns Bus partagé fraîchement initialisé.
 */
function createBus(): SharedBus {
  return {
    user$: new BehaviorSubject<SharedUser | null>(null),
    theme$: new BehaviorSubject<SharedTheme>('light'),
    cart$: new BehaviorSubject<number>(0)
  }
}

/**
 * Récupère l'instance unique du bus partagé.
 *
 * ** POC ** L'instance est stockée sur `window` plutôt que dans le module
 * pour garantir qu'elle est partagée entre toutes les apps de la page —
 * y compris quand elles utilisent des versions différentes de la lib (chaque
 * app importe shared-bus mais l'objet runtime est unique).
 *
 * @returns Bus partagé (création paresseuse à la première demande).
 */
export function getSharedBus(): SharedBus {
  const win = window as unknown as Record<string, SharedBus>
  if (!win[GLOBAL_KEY]) {
    win[GLOBAL_KEY] = createBus()
  }
  return win[GLOBAL_KEY]
}

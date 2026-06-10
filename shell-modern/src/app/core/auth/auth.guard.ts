import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthService } from './auth.service'

/**
 * Guard fonctionnel : redirige vers /login si l'utilisateur n'est pas
 * authentifié. La queryParam `redirect` permet de revenir à la page
 * demandée une fois connecté.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.isAuthenticated()) return true

  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } })
}

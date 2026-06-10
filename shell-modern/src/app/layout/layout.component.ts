import { Component, computed, inject, signal } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { AuthService } from '../core/auth/auth.service'
import { NotifyService } from '../core/notify/notify.service'

interface NavItem {
  label: string
  path: string
  icon: string
  group: 'legacy' | 'mfe'
}

/**
 * Layout principal du shell moderne (post-authentification).
 * Header en haut avec utilisateur courant + déconnexion, sidebar à gauche
 * avec menu Legacy/MFE, outlet à droite. Affiche aussi les toasts globaux
 * émis par les autres apps via CustomEvent `poc:notify`.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)
  private readonly notify = inject(NotifyService)

  readonly isSidebarOpen = signal(true)
  readonly currentUser = this.auth.currentUser
  readonly toasts = this.notify.toasts
  readonly userInitials = computed(() => {
    const user = this.currentUser()
    if (!user) return ''
    return user.displayName
      .split(' ')
      .map(w => w.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  readonly navItems: ReadonlyArray<NavItem> = [
    { label: 'Tableau de bord', path: '/dashboard', icon: '📊', group: 'legacy' },
    { label: 'Utilisateurs', path: '/users', icon: '👥', group: 'legacy' },
    { label: 'Produits', path: '/products', icon: '📦', group: 'legacy' },
    { label: 'Commandes', path: '/orders', icon: '🛒', group: 'legacy' },
    { label: 'Paramètres', path: '/settings', icon: '⚙️', group: 'legacy' },
    { label: 'Statistiques', path: '/stats', icon: '📈', group: 'mfe' },
    { label: 'Notifications', path: '/notifications', icon: '🔔', group: 'mfe' }
  ]

  /**
   * Bascule l'état d'ouverture de la sidebar.
   */
  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open)
  }

  /**
   * Déconnecte l'utilisateur et redirige vers /login.
   */
  onLogout(): void {
    this.auth.logout()
    this.router.navigateByUrl('/login')
  }

  /**
   * Ferme une notification (action sur le bouton fermer).
   *
   * @param id Identifiant unique du toast.
   */
  onDismissToast(id: number): void {
    this.notify.dismiss(id)
  }
}

import { Component, signal } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

interface NavItem {
  label: string
  path: string
  icon: string
  group: 'legacy' | 'mfe'
}

/**
 * Layout principal du shell moderne (post-authentification).
 * Header en haut + sidebar à gauche + outlet à droite.
 * Le menu est déclaré en dur ici pour le POC ; en prod il viendrait d'une
 * configuration ou des claims de l'utilisateur.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly isSidebarOpen = signal(true)

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
}

import { Component, ViewChild } from '@angular/core'
import { MatSidenav } from '@angular/material/sidenav'

interface NavItem {
  label: string
  path: string
  icon: string
}

/**
 * Composant racine de l'app legacy.
 * Contient le layout principal (toolbar + sidenav + outlet) toujours présent.
 * Non-standalone (legacy NgModule) — la liste des composants standalone et
 * NgModule cohabite volontairement dans le projet pour démontrer le POC.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav') private sidenav?: MatSidenav

  readonly title = 'POC Admin Legacy'

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', path: '/dashboard', icon: 'dashboard' },
    { label: 'Utilisateurs', path: '/users', icon: 'group' },
    { label: 'Produits', path: '/products', icon: 'inventory_2' },
    { label: 'Commandes', path: '/orders', icon: 'shopping_cart' },
    { label: 'Paramètres', path: '/settings', icon: 'settings' }
  ]

  /**
   * Bascule l'ouverture du sidenav (utilisé par le bouton menu mobile).
   *
   * @returns Promesse résolue après la fin de l'animation.
   */
  async toggleSidenav(): Promise<void> {
    if (!this.sidenav) return
    await this.sidenav.toggle()
  }

  /**
   * Fonction trackBy pour la liste de navigation (identifiant stable = path).
   *
   * @param _index Index courant (non utilisé).
   * @param item Élément de navigation.
   * @returns Chaîne identifiant l'item.
   */
  trackByPath(_index: number, item: NavItem): string {
    return item.path
  }
}

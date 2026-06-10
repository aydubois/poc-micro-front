import { Component, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core'
import { MatSidenav } from '@angular/material/sidenav'
import { Router } from '@angular/router'

interface NavItem {
  label: string
  path: string
  icon: string
}

/**
 * Composant racine de l'app legacy.
 * Contient le layout principal (toolbar + sidenav + outlet) toujours présent.
 *
 * Quand l'app est consommée en custom element par le shell moderne, l'input
 * `section` permet au shell de demander une navigation interne (ex. la route
 * /dashboard devient une demande de section=dashboard côté legacy).
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges {
  private readonly router = inject(Router)

  @ViewChild('sidenav') private sidenav?: MatSidenav

  /**
   * ** POC ** Section demandée par le shell parent (en mode custom element).
   * Synchronisée automatiquement par Angular Elements depuis l'attribut HTML
   * `section`. Si absent (mode standalone dev), l'utilisateur navigue via
   * les liens du sidenav comme d'habitude.
   */
  @Input() section: string | null = null

  readonly title = 'POC Admin Legacy'

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', path: '/dashboard', icon: 'dashboard' },
    { label: 'Utilisateurs', path: '/users', icon: 'group' },
    { label: 'Produits', path: '/products', icon: 'inventory_2' },
    { label: 'Commandes', path: '/orders', icon: 'shopping_cart' },
    { label: 'Paramètres', path: '/settings', icon: 'settings' }
  ]

  /**
   * Indique si on tourne en mode embarqué (custom element dans le shell).
   * On le détecte par la présence d'une valeur sur l'input `section`.
   *
   * @returns true si embarqué, false en standalone.
   */
  get isEmbedded(): boolean {
    return this.section !== null
  }

  /**
   * Synchronise la route interne avec l'attribut `section` poussé par le shell.
   *
   * @param changes Diff des inputs détectés par Angular.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['section']) return
    const next = this.section
    if (!next) return
    void this.router.navigateByUrl(`/${next}`)
  }

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

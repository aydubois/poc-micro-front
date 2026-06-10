import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core'
import { MatSidenav } from '@angular/material/sidenav'
import { Router } from '@angular/router'
import { getSharedBus, SharedUser } from 'shared-bus'
import { Subscription } from 'rxjs'

interface NavItem {
  label: string
  path: string
  icon: string
}

/**
 * Composant racine de l'app legacy.
 * Contient le layout principal (toolbar + sidenav + outlet) en mode standalone.
 * En mode custom element (embarqué dans le shell moderne), la chrome est
 * masquée et l'utilisateur courant est récupéré du bus partagé.
 *
 * L'input `section` permet au shell parent de demander une navigation interne.
 *
 * ** POC ** Note sur le Shadow DOM : on n'utilise PAS
 * `ViewEncapsulation.ShadowDom` sur ce composant racine. Tester a montré
 * que les composants enfants en encapsulation `Emulated` (par défaut)
 * injectent leurs styles dans `document.head`, qui n'est plus accessible
 * depuis le shadow root → tout l'arbre Material apparaîtrait non stylé.
 * Pour activer ShadowDom proprement il faudrait basculer chaque composant
 * Material (et tout le code app) en encapsulation ShadowDom, ce qui sort
 * du périmètre du POC. À la place, les styles globaux du legacy sont
 * injectés dans le `<head>` du shell par `legacy-app.element.ts`.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges, OnInit, OnDestroy {
  private readonly router = inject(Router)
  private readonly bus = getSharedBus()

  @ViewChild('sidenav') private sidenav?: MatSidenav

  /**
   * ** POC ** Section demandée par le shell parent (en mode custom element).
   */
  @Input() section: string | null = null

  readonly title = 'POC Admin Legacy'

  sharedUser: SharedUser | null = null

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', path: '/dashboard', icon: 'dashboard' },
    { label: 'Utilisateurs', path: '/users', icon: 'group' },
    { label: 'Produits', path: '/products', icon: 'inventory_2' },
    { label: 'Commandes', path: '/orders', icon: 'shopping_cart' },
    { label: 'Paramètres', path: '/settings', icon: 'settings' }
  ]

  private userSub?: Subscription

  /**
   * Indique si on tourne en mode embarqué (custom element dans le shell).
   *
   * @returns true si embarqué, false en standalone.
   */
  get isEmbedded(): boolean {
    return this.section !== null
  }

  ngOnInit(): void {
    this.userSub = this.bus.user$.subscribe(user => (this.sharedUser = user))
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe()
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

import { NgZone } from '@angular/core'
import { createCustomElement } from '@angular/elements'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { NotificationsElementModule } from './notifications-element.module'
import { NotificationsWidgetComponent } from './notifications-widget/notifications-widget.component'

const ELEMENT_NAME = 'mfe-notifications'

/**
 * ** POC ** URL absolue de la feuille de styles compilée du micro-frontend.
 * Indispensable pour que les styles du widget (fond violet) s'appliquent
 * dans le shell moderne sans dépendre de son SCSS global.
 */
const NOTIFICATIONS_STYLES_URL = 'http://localhost:4202/styles.css'

let registerPromise: Promise<void> | null = null

/**
 * Bootstrap mfe-notifications en mode web component et enregistre la balise
 * `<mfe-notifications>` sur customElements.
 *
 * ** POC ** Stratégie d'isolation cross-version : le widget A16 est
 * encapsulé dans son propre platform Angular 16. Le shell A21 ne voit
 * qu'un nœud DOM custom element ; aucun share scope Native Federation
 * n'est nécessaire, ce qui contourne le mur NG0203 / "Rejected map
 * override" observé quand on essayait de faire vivre un composant
 * standalone A16 dans un host A21.
 *
 * L'enregistrement est idempotent (cache de la promesse + check
 * customElements.get).
 *
 * @returns Promesse résolue quand `<mfe-notifications>` est définie et
 *   que les styles globaux sont injectés dans le `<head>` du shell.
 */
export function registerNotificationsApp(): Promise<void> {
  if (registerPromise) return registerPromise

  registerPromise = (async () => {
    if (customElements.get(ELEMENT_NAME)) return

    injectNotificationsStyles()

    const moduleRef = await platformBrowserDynamic().bootstrapModule(NotificationsElementModule)
    moduleRef.injector.get(NgZone)

    const element = createCustomElement(NotificationsWidgetComponent, {
      injector: moduleRef.injector
    })
    customElements.define(ELEMENT_NAME, element)
  })()

  return registerPromise
}

/**
 * Injecte la feuille de styles globale de mfe-notifications dans le `<head>`
 * du shell. Idempotent — vérifie si le link existe déjà.
 */
function injectNotificationsStyles(): void {
  const existing = document.head.querySelector(`link[data-mfe-notifications-styles="true"]`)
  if (existing) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = NOTIFICATIONS_STYLES_URL
  link.setAttribute('data-mfe-notifications-styles', 'true')
  document.head.appendChild(link)
}

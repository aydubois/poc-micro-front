import { NgZone } from '@angular/core'
import { createCustomElement } from '@angular/elements'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { StatsElementModule } from './stats-element.module'
import { StatsWidgetComponent } from './stats-widget/stats-widget.component'

const ELEMENT_NAME = 'mfe-stats'

/**
 * ** POC ** URL absolue de la feuille de styles compilée du micro-frontend.
 * Indispensable pour que les styles du widget (fond orange) s'appliquent
 * dans le shell moderne sans dépendre de son SCSS global.
 */
const STATS_STYLES_URL = 'http://localhost:4201/styles.css'

let registerPromise: Promise<void> | null = null

/**
 * Bootstrap mfe-stats en mode web component et enregistre la balise
 * `<mfe-stats>` sur customElements.
 *
 * ** POC ** Stratégie d'isolation cross-version : le widget A18 est
 * encapsulé dans son propre platform Angular 18. Le shell A21 ne voit
 * qu'un nœud DOM custom element ; aucun share scope Native Federation
 * n'est nécessaire, ce qui contourne le mur NG0203 que jetait
 * componentFactory.create cross-version.
 *
 * L'enregistrement est idempotent (cache de la promesse + check
 * customElements.get).
 *
 * @returns Promesse résolue quand `<mfe-stats>` est définie et que les
 *   styles globaux sont injectés dans le `<head>` du shell.
 */
export function registerStatsApp(): Promise<void> {
  if (registerPromise) return registerPromise

  registerPromise = (async () => {
    if (customElements.get(ELEMENT_NAME)) return

    injectStatsStyles()

    const moduleRef = await platformBrowserDynamic().bootstrapModule(StatsElementModule)
    moduleRef.injector.get(NgZone)

    const element = createCustomElement(StatsWidgetComponent, {
      injector: moduleRef.injector
    })
    customElements.define(ELEMENT_NAME, element)
  })()

  return registerPromise
}

/**
 * Injecte la feuille de styles globale de mfe-stats dans le `<head>` du
 * shell. Idempotent — vérifie si le link existe déjà.
 */
function injectStatsStyles(): void {
  const existing = document.head.querySelector(`link[data-mfe-stats-styles="true"]`)
  if (existing) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = STATS_STYLES_URL
  link.setAttribute('data-mfe-stats-styles', 'true')
  document.head.appendChild(link)
}

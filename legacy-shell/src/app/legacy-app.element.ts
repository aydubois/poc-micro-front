import { NgZone } from '@angular/core'
import { createCustomElement } from '@angular/elements'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppComponent } from './app.component'
import { LegacyElementModule } from './legacy-element.module'

const ELEMENT_NAME = 'legacy-app'

/**
 * ** POC ** URL absolue de la feuille de styles compilée du legacy.
 * Elle contient le theme Material indigo-pink + nos variables custom +
 * styles globaux. Indispensable pour que les composants Material s'affichent
 * correctement à l'intérieur du shell moderne.
 */
const LEGACY_STYLES_URL = 'http://localhost:4200/styles.css'

let registerPromise: Promise<void> | null = null

/**
 * Bootstrap le legacy en mode web component et enregistre la balise
 * `<legacy-app>` sur customElements. L'enregistrement est idempotent
 * (cache de la promesse).
 *
 * ** POC ** En mode embarqué (consommé par shell-modern), on N'initialise
 * PAS la runtime Native Federation du legacy. Raison : la migration de
 * mfe-stats vers Angular 18 a révélé un conflit d'import map quand deux
 * runtimes Native Federation (celle du shell A21 et celle du legacy A16)
 * tentent de remapper le même package `@angular/common` vers des URLs
 * différentes. Le shim ES module rejette l'override, ce qui pollue la
 * console et empêche le chargement des widgets cross-version.
 *
 * Conséquence : les `<app-mfe-outlet>` du legacy (Dashboard, Users) ne
 * peuvent plus charger leurs widgets dans le shell. C'est documenté dans
 * les templates et le README — la feature passe par les routes
 * /stats et /notifications du shell moderne désormais.
 *
 * @returns Promesse résolue quand `<legacy-app>` est définie et que ses
 *   styles globaux sont injectés.
 */
export function registerLegacyApp(): Promise<void> {
  if (registerPromise) return registerPromise

  registerPromise = (async () => {
    if (customElements.get(ELEMENT_NAME)) return

    injectLegacyStyles()

    const moduleRef = await platformBrowserDynamic().bootstrapModule(LegacyElementModule)
    moduleRef.injector.get(NgZone)

    const element = createCustomElement(AppComponent, {
      injector: moduleRef.injector
    })
    customElements.define(ELEMENT_NAME, element)
  })()

  return registerPromise
}

/**
 * Injecte la feuille de styles globale du legacy dans le `<head>` du shell.
 * Idempotent — vérifie si le link existe déjà.
 */
function injectLegacyStyles(): void {
  const existing = document.head.querySelector(`link[data-legacy-styles="true"]`)
  if (existing) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = LEGACY_STYLES_URL
  link.setAttribute('data-legacy-styles', 'true')
  document.head.appendChild(link)
}

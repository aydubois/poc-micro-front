import { NgZone } from '@angular/core'
import { createCustomElement } from '@angular/elements'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { initFederation } from '@angular-architects/native-federation'

import { AppComponent } from './app.component'
import { LegacyElementModule } from './legacy-element.module'

const ELEMENT_NAME = 'legacy-app'

/**
 * ** POC ** Manifest des remotes consommés par le legacy quand il s'exécute
 * en custom element. En standalone (port 4200), c'est main.ts qui charge
 * le manifest depuis assets/. Ici on le redonne en dur car on n'a pas
 * accès au fichier local (on tourne dans la page du shell moderne).
 */
const LEGACY_REMOTES = {
  mfeStats: 'http://localhost:4201/remoteEntry.json',
  mfeNotifications: 'http://localhost:4202/remoteEntry.json'
}

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
 * @returns Promesse résolue quand `<legacy-app>` est définie et que ses
 *   styles globaux sont injectés.
 */
export function registerLegacyApp(): Promise<void> {
  if (registerPromise) return registerPromise

  registerPromise = (async () => {
    if (customElements.get(ELEMENT_NAME)) return

    injectLegacyStyles()

    // ** POC ** Initialise la runtime Native Federation du legacy avec ses
    // propres remotes. Le shell moderne a sa propre initFederation séparée
    // (versions différentes des libs NF, donc état isolé).
    await initFederation(LEGACY_REMOTES)

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

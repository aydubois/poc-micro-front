import { provideAppInitializer } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

interface StatsAppRegister {
  registerStatsApp: () => Promise<void>
}

interface NotificationsAppRegister {
  registerNotificationsApp: () => Promise<void>
}

/**
 * ** POC ** APP_INITIALIZER qui pré-enregistre tous les custom elements
 * exposés par les micro-frontends au démarrage du shell moderne.
 *
 * Pourquoi : le legacy embarqué dans le shell n'a plus de runtime Native
 * Federation locale (`initFederation` a été retiré pour stopper les
 * "Rejected map override"). Du coup le legacy ne peut pas charger
 * `<mfe-stats>` ni `<mfe-notifications>` lui-même. En les définissant
 * eager côté shell — donc avant le premier rendu de quoi que ce soit —
 * on garantit que la balise est utilisable n'importe où dans la page,
 * y compris dans les pages Dashboard et Users du legacy embarqué.
 *
 * Trade-off : le shell paie le chargement des deux bundles micro-frontends
 * au boot (env. quelques centaines de Ko incluant les platforms Angular
 * 16 et 18 isolés). Si un remote est down, on log mais on ne bloque pas
 * le boot — la zone qui en a besoin affichera son fallback "indisponible".
 *
 * @returns Provider à injecter dans `appConfig.providers`.
 */
export function providePreloadCustomElements() {
  return provideAppInitializer(async () => {
    try {
      const stats = await loadRemoteModule('mfeStats', './StatsElement') as StatsAppRegister
      await stats.registerStatsApp()
    } catch (err) {
      console.error('[preloadCustomElements] mfe-stats indisponible :', err)
    }

    try {
      const notif = await loadRemoteModule('mfeNotifications', './NotificationsElement') as NotificationsAppRegister
      await notif.registerNotificationsApp()
    } catch (err) {
      console.error('[preloadCustomElements] mfe-notifications indisponible :', err)
    }
  })
}

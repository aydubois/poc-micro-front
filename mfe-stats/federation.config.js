/* ============================================================
   ** POC ** federation.config.js — micro-frontend stats (Angular 18)
   Buildé en Native Federation pour être consommé par tous les hosts.
   Expose deux entrées :
     - ./Widget       → ancien composant standalone (compatibilité,
                        utilisable seulement par un host de même version)
     - ./StatsElement → wrapper web component <mfe-stats> (utilisé par
                        shell-modern A21 pour contourner cross-version
                        sharing — même recette que mfe-notifications)
   ============================================================ */

const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config')

module.exports = withNativeFederation({

  name: 'mfe-stats',

  exposes: {
    './Widget': './src/app/stats-widget/stats-widget.component.ts',
    './StatsElement': './src/app/stats-app.element.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket'
  ]

})

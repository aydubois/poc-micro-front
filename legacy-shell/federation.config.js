/* ============================================================
   ** POC ** federation.config.js — legacy-shell (Angular 16)
   Configuration hybride : à la fois host (consomme mfeStats et
   mfeNotifications) et remote (expose ./LegacyApp pour le shell moderne
   qui le mounte en web component).
   ============================================================ */

const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config')

module.exports = withNativeFederation({

  name: 'legacy-shell',

  exposes: {
    './LegacyApp': './src/app/legacy-app.element.ts'
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

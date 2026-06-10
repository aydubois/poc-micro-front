/* ============================================================
   ** POC ** federation.config.js — micro-frontend stats v21 (Angular 21)
   Buildé en Native Federation natif (Angular 21 + esbuild) pour être
   consommé par shell-modern à la place du mfe-stats v16.
   ============================================================ */

const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config')

module.exports = withNativeFederation({

  name: 'mfe-stats-v21',

  exposes: {
    './Widget': './src/app/stats-widget/stats-widget.component.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket'
  ],

  features: {
    ignoreUnusedDeps: true
  }

})

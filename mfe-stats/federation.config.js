/* ============================================================
   ** POC ** federation.config.js — micro-frontend stats (Angular 16)
   Buildé en Native Federation pour être consommé par shell-modern.
   Expose un seul module : ./Widget → StatsWidgetComponent (standalone).
   ============================================================ */

const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config')

module.exports = withNativeFederation({

  name: 'mfe-stats',

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
  ]

})

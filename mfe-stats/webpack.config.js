/* ============================================================
   ** POC ** webpack.config.js — remote Module Federation mfeStats
   Expose un seul module : ./Widget → StatsWidgetComponent (standalone).
   Le nom du remote DOIT être un identifiant JS valide (pas de tiret) car
   utilisé comme variable globale par MF.
   ============================================================ */

const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack')

module.exports = withModuleFederationPlugin({

  // ** POC ** identifiant côté MF — doit matcher la clé `remotes:` du host
  name: 'mfeStats',

  exposes: {
    './Widget': './src/app/stats-widget/stats-widget.component.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  }

})

/* ============================================================
   ** POC ** webpack.config.js — host Module Federation
   Le legacy-shell consomme deux remotes (mfeStats, mfeNotifications).
   La liste des remotes est statique pour le POC ; en prod réelle on
   passerait par un manifest distant chargé au démarrage.
   ============================================================ */

const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack')

module.exports = withModuleFederationPlugin({

  // ** POC ** chaque remote expose son `remoteEntry.js` sur son propre port
  remotes: {
    mfeStats: 'http://localhost:4201/remoteEntry.js',
    mfeNotifications: 'http://localhost:4202/remoteEntry.js'
  },

  // ** POC ** partage Angular et RxJS en singleton — évite plusieurs instances
  // de la même lib (sinon Zone.js / DI ne fonctionnent plus correctement).
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  }

})

/* ============================================================
   ** POC ** webpack.config.js — remote Module Federation mfeNotifications
   Expose un seul module : ./Widget → NotificationsWidgetComponent.
   ============================================================ */

const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack')

module.exports = withModuleFederationPlugin({

  name: 'mfeNotifications',

  exposes: {
    './Widget': './src/app/notifications-widget/notifications-widget.component.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  }

})

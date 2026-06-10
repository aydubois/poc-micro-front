/* ============================================================
   ** POC ** federation.config.js — micro-frontend notifications (Angular 16)
   Buildé en Native Federation pour être consommé par shell-modern.
   Expose un seul module : ./Widget → NotificationsWidgetComponent.
   ============================================================ */

const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config')

module.exports = withNativeFederation({

  name: 'mfe-notifications',

  exposes: {
    './Widget': './src/app/notifications-widget/notifications-widget.component.ts'
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

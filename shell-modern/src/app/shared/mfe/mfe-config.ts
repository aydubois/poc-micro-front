/**
 * ** POC ** Définition typée des micro-frontends connus par le shell.
 * Le mapping URL est dans `public/federation.manifest.json` (chargé par
 * initFederation au démarrage). Ici on tient juste l'inventaire des
 * exports attendus pour chaque remote symbolique.
 */
export interface MfeRemoteConfig {
  exposedModule: string
  componentName: string
}

export const MFE_REMOTES: Record<string, MfeRemoteConfig> = {
  mfeStats: {
    exposedModule: './Widget',
    componentName: 'StatsWidgetComponent'
  },
  mfeNotifications: {
    exposedModule: './Widget',
    componentName: 'NotificationsWidgetComponent'
  }
}

export type MfeRemoteKey = keyof typeof MFE_REMOTES | string

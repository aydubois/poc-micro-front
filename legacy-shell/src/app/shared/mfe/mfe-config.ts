/**
 * ** POC ** Catalogue statique des remotes Module Federation consommés par
 * le legacy-shell. En prod réelle ce mapping viendrait d'un manifest distant
 * (`/assets/mf.manifest.json`) chargé au démarrage. Ici on garde simple.
 */
export interface MfeRemoteConfig {
  remoteEntry: string
  remoteName: string
}

export const MFE_REMOTES: Record<string, MfeRemoteConfig> = {
  mfeStats: {
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    remoteName: 'mfeStats'
  },
  mfeNotifications: {
    remoteEntry: 'http://localhost:4202/remoteEntry.js',
    remoteName: 'mfeNotifications'
  }
}

export type MfeRemoteKey = keyof typeof MFE_REMOTES | string

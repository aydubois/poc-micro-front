import { Injectable, Type } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/module-federation'

import { MFE_REMOTES, MfeRemoteKey } from './mfe-config'

/**
 * ** POC ** Cache de modules déjà chargés pour éviter un re-fetch à chaque
 * navigation. La clé est `${remoteKey}::${exposedModule}`.
 */
interface LoadedExposedModule {
  [exportName: string]: Type<unknown> | unknown
}

/**
 * Façade simple autour de `loadRemoteModule` pour rendre l'intégration MFE
 * uniforme et testable depuis le legacy-shell.
 *
 * Le `MfeOutletComponent` est l'unique consommateur prévu : il passe une
 * clé de remote (présente dans `MFE_REMOTES`), un nom de module exposé et
 * un nom de composant à récupérer.
 */
@Injectable({ providedIn: 'root' })
export class MfeFacadeService {
  private readonly cache = new Map<string, Promise<LoadedExposedModule>>()

  /**
   * Charge un composant exposé par un remote et retourne sa classe Angular.
   *
   * @param remoteKey Clé identifiant le remote dans `MFE_REMOTES`.
   * @param exposedModule Nom du module exposé (ex. `'./Widget'`).
   * @param componentName Nom du composant exporté par le module.
   * @returns Promesse résolue avec la classe du composant prête à l'usage dynamique.
   * @throws Error si le remote n'est pas connu ou si le composant n'existe pas.
   */
  async loadComponent<T>(
    remoteKey: MfeRemoteKey,
    exposedModule: string,
    componentName: string
  ): Promise<Type<T>> {
    const remote = MFE_REMOTES[remoteKey]
    if (!remote) {
      throw new Error(`[MfeFacadeService] remote inconnu : "${remoteKey}". Clés disponibles : ${Object.keys(MFE_REMOTES).join(', ')}`)
    }

    const cacheKey = `${remoteKey}::${exposedModule}`
    let loaded = this.cache.get(cacheKey)
    if (!loaded) {
      // ** POC ** type 'script' = remoteEntry.js classique (Module Federation v1).
      // type 'module' serait pour les modules ES modernes (Native Federation).
      loaded = loadRemoteModule({
        type: 'script',
        remoteEntry: remote.remoteEntry,
        remoteName: remote.remoteName,
        exposedModule
      })
      this.cache.set(cacheKey, loaded)
    }

    const exported = await loaded
    const component = exported[componentName] as Type<T> | undefined
    if (!component) {
      throw new Error(`[MfeFacadeService] composant "${componentName}" introuvable dans "${remoteKey}/${exposedModule}". Exports disponibles : ${Object.keys(exported).join(', ')}`)
    }
    return component
  }

  /**
   * Vide le cache (utile pour les tests ou un rechargement forcé).
   */
  clearCache(): void {
    this.cache.clear()
  }
}

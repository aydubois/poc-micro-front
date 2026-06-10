import { Injectable, Type } from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

import { MfeRemoteKey } from './mfe-config'

interface LoadedExposedModule {
  [exportName: string]: Type<unknown> | unknown
}

/**
 * Façade autour de loadRemoteModule (Native Federation) pour le legacy-shell.
 * Le mapping URL des remotes est dans federation.manifest.json (chargé par
 * initFederation au démarrage). On manipule ici uniquement des clés
 * symboliques (remoteName), pas des URLs.
 */
@Injectable({ providedIn: 'root' })
export class MfeFacadeService {
  private readonly cache = new Map<string, Promise<LoadedExposedModule>>()

  /**
   * Charge un composant exposé par un remote et retourne sa classe Angular.
   *
   * @param remoteName Clé du remote dans le manifest (ex. `'mfeStats'`).
   * @param exposedModule Nom du module exposé (ex. `'./Widget'`).
   * @param componentName Nom du composant exporté à récupérer.
   * @returns Promesse résolue avec la classe du composant.
   * @throws Error si le composant n'existe pas dans le module exposé.
   */
  async loadComponent<T>(
    remoteName: MfeRemoteKey,
    exposedModule: string,
    componentName: string
  ): Promise<Type<T>> {
    const cacheKey = `${remoteName}::${exposedModule}`
    let loaded = this.cache.get(cacheKey)
    if (!loaded) {
      // ** POC ** Native Federation : le manifest connaît déjà l'URL du
      // remote, on passe juste le nom symbolique.
      loaded = loadRemoteModule(remoteName, exposedModule) as Promise<LoadedExposedModule>
      this.cache.set(cacheKey, loaded)
    }

    const exported = await loaded
    const component = exported[componentName] as Type<T> | undefined
    if (!component) {
      throw new Error(`[MfeFacadeService] composant "${componentName}" introuvable dans "${remoteName}/${exposedModule}". Exports : ${Object.keys(exported).join(', ')}`)
    }
    return component
  }

  /**
   * Vide le cache (utile pour tests ou rechargement forcé).
   */
  clearCache(): void {
    this.cache.clear()
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  Type,
  ViewChild,
  ViewContainerRef,
  computed,
  effect,
  input,
  signal
} from '@angular/core'
import { loadRemoteModule } from '@angular-architects/native-federation'

import { MFE_REMOTES, MfeRemoteKey } from './mfe-config'

interface LoadedExposedModule {
  [exportName: string]: Type<unknown> | unknown
}

/**
 * Outlet du shell moderne pour intégrer dynamiquement un micro-frontend.
 * Standalone, signal-based.
 *
 * Le manifest `federation.manifest.json` est déjà initialisé par
 * initFederation() dans main.ts. On charge ici directement le module exposé
 * via le helper loadRemoteModule de @angular-architects/native-federation.
 *
 * Exemple : `<app-mfe-outlet remote="mfeStats" />`
 */
@Component({
  selector: 'app-mfe-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mfe-outlet.component.html',
  styleUrl: './mfe-outlet.component.scss'
})
export class MfeOutletComponent {
  @ViewChild('host', { read: ViewContainerRef, static: true })
  private host!: ViewContainerRef

  readonly remote = input.required<MfeRemoteKey>()

  readonly isLoading = signal(true)
  readonly errorMessage = signal('')
  readonly remoteConfig = computed(() => MFE_REMOTES[this.remote()])

  constructor() {
    effect(() => {
      const config = this.remoteConfig()
      if (!config) {
        this.errorMessage.set(`Remote inconnu : "${this.remote()}"`)
        this.isLoading.set(false)
        return
      }
      void this.mountRemote()
    })
  }

  /**
   * Charge le composant distant via Native Federation et l'instancie.
   */
  private async mountRemote(): Promise<void> {
    this.isLoading.set(true)
    this.errorMessage.set('')
    this.host.clear()

    const remoteName = this.remote()
    const config = this.remoteConfig()
    try {
      const exported = await loadRemoteModule(remoteName, config.exposedModule) as LoadedExposedModule
      const component = exported[config.componentName] as Type<unknown> | undefined
      if (!component) {
        throw new Error(`Composant "${config.componentName}" introuvable. Exports : ${Object.keys(exported).join(', ')}`)
      }
      this.host.createComponent(component)
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Erreur inconnue de chargement du micro-frontend.')
      console.error('[MfeOutletComponent.mountRemote]', err)
    } finally {
      this.isLoading.set(false)
    }
  }
}

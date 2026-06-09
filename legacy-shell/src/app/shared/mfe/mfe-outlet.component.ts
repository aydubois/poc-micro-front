import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
  inject
} from '@angular/core'

import { MfeRemoteKey } from './mfe-config'
import { MfeFacadeService } from './mfe-facade.service'

/**
 * Composant outlet pour intégrer dynamiquement un composant exposé par un
 * MFE (Module Federation). Standalone, à poser dans n'importe quelle page
 * du legacy.
 *
 * Exemple : `<app-mfe-outlet remote="mfeStats" module="./Widget" componentName="StatsWidgetComponent"></app-mfe-outlet>`.
 */
@Component({
  selector: 'app-mfe-outlet',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mfe-outlet.component.html',
  styleUrls: ['./mfe-outlet.component.scss']
})
export class MfeOutletComponent implements OnChanges {
  private readonly mfeFacade = inject(MfeFacadeService)
  private readonly changeDetector = inject(ChangeDetectorRef)

  @ViewChild('host', { read: ViewContainerRef, static: true })
  private host!: ViewContainerRef

  @Input({ required: true }) remote!: MfeRemoteKey
  @Input({ required: true }) module!: string
  @Input({ required: true }) componentName!: string

  isLoading = true
  errorMessage = ''

  /**
   * Recharge le composant si l'une des inputs change après initialisation.
   *
   * @param changes Diff Angular des inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['remote'] || changes['module'] || changes['componentName']) {
      this.mountRemote()
    }
  }

  /**
   * Charge le composant distant via la façade et l'instancie dans le host.
   */
  private async mountRemote(): Promise<void> {
    this.isLoading = true
    this.errorMessage = ''
    this.host.clear()
    this.changeDetector.markForCheck()

    try {
      const component: Type<unknown> = await this.mfeFacade.loadComponent(
        this.remote,
        this.module,
        this.componentName
      )
      this.host.createComponent(component)
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : 'Erreur inconnue de chargement du MFE.'
      console.error('[MfeOutletComponent.mountRemote]', err)
    } finally {
      this.isLoading = false
      this.changeDetector.markForCheck()
    }
  }
}

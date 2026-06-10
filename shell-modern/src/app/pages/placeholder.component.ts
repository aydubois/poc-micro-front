import { Component, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

/**
 * Placeholder temporaire — affiché tant que les remotes ne sont pas branchés.
 * Sera remplacé par le composant MFE / legacy en tâches 12-14.
 */
@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss'
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute)

  readonly routeLabel: string = this.route.snapshot.url.map(seg => seg.path).join('/') || '(racine)'
}

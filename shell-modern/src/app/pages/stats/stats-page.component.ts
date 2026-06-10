import { Component } from '@angular/core'

import { MfeOutletComponent } from '../../shared/mfe/mfe-outlet.component'

/**
 * Page /stats — wrapper qui monte le micro-frontend Stats via Native Federation.
 */
@Component({
  selector: 'app-stats-page',
  imports: [MfeOutletComponent],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.scss'
})
export class StatsPageComponent {}

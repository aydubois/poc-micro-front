import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

/**
 * Composant racine du shell moderne.
 * Ne contient qu'un router-outlet — toute la mise en page (layout, sidebar,
 * header) est gérée par le LayoutComponent monté sous le routing protégé.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}

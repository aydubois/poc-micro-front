import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

interface SettingsForm {
  appName: string
  language: 'fr' | 'en' | 'es'
  pageSize: number
  enableEmails: boolean
}

/**
 * Page Paramètres (lazy + standalone).
 * Formulaire reactive simple — démontre les MatFormField + MatSelect modernes.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private readonly formbuilder = inject(NonNullableFormBuilder)

  readonly languages: ReadonlyArray<{ value: SettingsForm['language']; label: string }> = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' }
  ]

  readonly pageSizes: ReadonlyArray<number> = [10, 25, 50, 100]

  readonly form = this.formbuilder.group({
    appName: this.formbuilder.control('POC Admin Legacy', [Validators.required, Validators.minLength(3)]),
    language: this.formbuilder.control<SettingsForm['language']>('fr', Validators.required),
    pageSize: this.formbuilder.control(25, Validators.required),
    enableEmails: this.formbuilder.control(true)
  })

  savedMessage = ''

  /**
   * Sauvegarde fictive : log la valeur du form et affiche un message éphémère.
   */
  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const value: SettingsForm = this.form.getRawValue()
    console.info('[SettingsComponent.onSave] valeurs sauvegardées (mock):', value)
    this.savedMessage = 'Paramètres enregistrés (mock).'
    setTimeout(() => (this.savedMessage = ''), 3000)
  }
}

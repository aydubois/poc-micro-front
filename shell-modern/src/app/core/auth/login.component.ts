import { Component, inject, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { AuthService } from './auth.service'

/**
 * Écran de connexion fake (admin/admin) — mock pour le POC.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formbuilder = inject(NonNullableFormBuilder)
  private readonly auth = inject(AuthService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  readonly errorMessage = signal('')

  readonly form = this.formbuilder.group({
    username: this.formbuilder.control('', [Validators.required]),
    password: this.formbuilder.control('', [Validators.required])
  })

  /**
   * Soumet le formulaire ; en cas de succès navigue vers l'URL redirect ou /.
   */
  onSubmit(): void {
    this.errorMessage.set('')
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const { username, password } = this.form.getRawValue()
    if (!this.auth.login(username, password)) {
      this.errorMessage.set('Identifiants incorrects (essayez admin / admin).')
      return
    }
    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/'
    this.router.navigateByUrl(redirect)
  }
}

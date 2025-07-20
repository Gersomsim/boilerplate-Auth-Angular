import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Notification } from '@infrastructure/libraries/notification.library'
import { AuthFacade } from '@infrastructure/states/facades/auth/auth.facade'
import { UiModule } from '@infrastructure/ui/ui.module'
import { ForgotPasswordLink } from '../forgot-password/forgot-password-link/forgot-password-link'

@Component({
	selector: 'app-sign-in-form',
	imports: [UiModule, ReactiveFormsModule, ForgotPasswordLink],
	templateUrl: './sign-in-form.html',
})
export class SignInForm {
	authFacade = inject(AuthFacade)
	router = inject(Router)
	fb = inject(FormBuilder)
	notify = inject(Notification)
	form = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	})
	isSubmitting = signal(false)

	async submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showWarning('Please fill in all fields')
			return
		}
		this.isSubmitting.set(true)
		await this.authFacade.signIn(this.form.getRawValue())
		this.form.reset()
		this.isSubmitting.set(false)
		this.navigateToApp()
	}
	navigateToApp() {
		this.router.navigate(['/app'])
	}
}

import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Notification } from '@infrastructure/libraries/notification.library'
import { AuthFacade } from '@infrastructure/states/facades/auth/auth.facade'
import { UiModule } from '@infrastructure/ui/ui.module'

@Component({
	selector: 'app-forgot-password-form',
	imports: [UiModule, ReactiveFormsModule],
	templateUrl: './forgot-password-form.html',
	styleUrl: './forgot-password-form.scss',
})
export class ForgotPasswordForm {
	authFacade = inject(AuthFacade)
	router = inject(Router)
	fb = inject(FormBuilder)
	notify = inject(Notification)
	isSubmitting = signal(false)
	form = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
	})

	async submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showWarning('Please fill in all fields')
			return
		}
		try {
			this.isSubmitting.set(true)
			const email = this.form.getRawValue().email
			await this.authFacade.forgotPassword(email)
			this.form.reset()
			this.isSubmitting.set(false)
			this.navigateToSignIn()
		} catch (error) {
			this.isSubmitting.set(false)
		}
	}
	navigateToSignIn() {
		this.router.navigate(['/'])
	}
}

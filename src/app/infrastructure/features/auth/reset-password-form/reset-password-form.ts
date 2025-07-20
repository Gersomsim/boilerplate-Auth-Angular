import { Component, inject, Input, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Notification } from '@infrastructure/libraries/notification.library'
import { AuthFacade } from '@infrastructure/states/facades/auth/auth.facade'
import { UiModule } from '@infrastructure/ui/ui.module'
import { passwordMatchValidator } from '@infrastructure/validators/password-match.validator'

@Component({
	selector: 'app-reset-password-form',
	imports: [UiModule, ReactiveFormsModule],
	templateUrl: './reset-password-form.html',
})
export class ResetPasswordForm {
	authFacade = inject(AuthFacade)
	router = inject(Router)
	notify = inject(Notification)
	@Input({ required: true }) token!: string
	isSubmitting = signal(false)

	fb = inject(FormBuilder)
	form = this.fb.nonNullable.group(
		{
			password: ['', [Validators.required, Validators.minLength(8)]],
			confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
		},
		{
			validators: [passwordMatchValidator('password', 'confirmPassword')],
		},
	)

	async submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showError('All fields are required')
			return
		}
		try {
			this.isSubmitting.set(true)
			const password = this.form.getRawValue().password
			await this.authFacade.resetPassword(password, this.token)
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

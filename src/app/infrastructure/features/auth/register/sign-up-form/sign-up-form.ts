import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Notification } from '@infrastructure/libraries/notification.library'
import { AuthFacade } from '@infrastructure/states/facades/auth/auth.facade'
import { UiModule } from '@infrastructure/ui/ui.module'
import { passwordMatchValidator } from '@infrastructure/validators/password-match.validator'
import { ForgotPasswordLink } from '../../forgot-password/forgot-password-link/forgot-password-link'

@Component({
	selector: 'app-sign-up-form',
	imports: [UiModule, ReactiveFormsModule, ForgotPasswordLink],
	templateUrl: './sign-up-form.html',
})
export class SignUpForm {
	authFacade = inject(AuthFacade)
	fb = inject(FormBuilder)
	notify = inject(Notification)
	form = this.fb.nonNullable.group(
		{
			email: ['', [Validators.required, Validators.email]],
			name: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
		},
		{
			validators: [passwordMatchValidator('password', 'confirmPassword')],
		},
	)
	isSubmitting = signal(false)

	async submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showWarning('Please fill in all fields')
			return
		}

		this.isSubmitting.set(true)
		await this.authFacade.signUp(this.form.getRawValue())
		this.isSubmitting.set(false)
	}
}

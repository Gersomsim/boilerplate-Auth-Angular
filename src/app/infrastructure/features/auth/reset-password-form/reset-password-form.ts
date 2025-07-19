import { Component, inject, Input } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Notification } from '@infrastructure/libraries/notification.library'
import { UiModule } from '@infrastructure/ui/ui.module'
import { passwordMatchValidator } from '@infrastructure/validators/password-match.validator'

@Component({
	selector: 'app-reset-password-form',
	imports: [UiModule, ReactiveFormsModule],
	templateUrl: './reset-password-form.html',
	styleUrl: './reset-password-form.scss',
})
export class ResetPasswordForm {
	notify = inject(Notification)
	@Input() token!: string

	fb = inject(FormBuilder)
	form = this.fb.group(
		{
			password: ['', [Validators.required, Validators.minLength(8)]],
			confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
		},
		{
			validators: [passwordMatchValidator('password', 'confirmPassword')],
		},
	)

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showError('All fields are required')
			return
		}
	}
}

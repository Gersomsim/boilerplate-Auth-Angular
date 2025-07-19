import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Notification } from '@infrastructure/libraries/notification.library'
import { UiModule } from '@infrastructure/ui/ui.module'
import { ForgotPasswordLink } from '../forgot-password/forgot-password-link/forgot-password-link'

@Component({
	selector: 'app-sign-in-form',
	imports: [UiModule, ReactiveFormsModule, ForgotPasswordLink],
	templateUrl: './sign-in-form.html',
	styleUrl: './sign-in-form.scss',
})
export class SignInForm {
	fb = inject(FormBuilder)
	notify = inject(Notification)
	form = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	})

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showWarning('Please fill in all fields')
			return
		}
	}
}

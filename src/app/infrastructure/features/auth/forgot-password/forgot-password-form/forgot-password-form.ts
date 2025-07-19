import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Notification } from '@infrastructure/libraries/notification.library'
import { UiModule } from '@infrastructure/ui/ui.module'

@Component({
	selector: 'app-forgot-password-form',
	imports: [UiModule, ReactiveFormsModule],
	templateUrl: './forgot-password-form.html',
	styleUrl: './forgot-password-form.scss',
})
export class ForgotPasswordForm {
	fb = inject(FormBuilder)
	notify = inject(Notification)
	form = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
	})

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showWarning('Please fill in all fields')
			return
		}

		console.log(this.form.value)
	}
}

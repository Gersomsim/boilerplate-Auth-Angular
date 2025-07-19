import { Component, inject, Input } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { UiModule } from '@infrastructure/ui/ui.module'
import { passwordMatchValidator } from '@infrastructure/validators/password-match.validator'

@Component({
	selector: 'app-reset-password-form',
	imports: [UiModule, ReactiveFormsModule],
	templateUrl: './reset-password-form.html',
	styleUrl: './reset-password-form.scss',
})
export class ResetPasswordForm {
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
			return
		}
		console.log(this.form.value)
	}
}

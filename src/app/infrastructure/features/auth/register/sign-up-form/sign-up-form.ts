import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Notification } from '@infrastructure/libraries/notification.library'
import { UiModule } from '@infrastructure/ui/ui.module'
import { passwordMatchValidator } from '@infrastructure/validators/password-match.validator'
import { debounceTime } from 'rxjs'
import { ForgotPasswordLink } from '../../forgot-password/forgot-password-link/forgot-password-link'

@Component({
	selector: 'app-sign-up-form',
	imports: [UiModule, ReactiveFormsModule, ForgotPasswordLink],
	templateUrl: './sign-up-form.html',
	styleUrl: './sign-up-form.scss',
})
export class SignUpForm implements OnInit {
	fb = inject(FormBuilder)
	notify = inject(Notification)
	form = this.fb.group(
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

	ngOnInit() {
		this.form
			.get('confirmPassword')
			?.valueChanges.pipe(debounceTime(600))
			.subscribe(value => {
				if (value !== this.form.get('password')?.value) {
					this.form.get('confirmPassword')?.setErrors({ mismatch: true })
					this.form.get('confirmPassword')?.updateValueAndValidity()
				}
			})
	}

	submit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched()
			this.notify.showWarning('Please fill in all fields')
			return
		}
		console.log(this.form.value)
	}
}

import { Component } from '@angular/core'
import { SignUpForm } from '@infrastructure/features/auth/register/sign-up-form/sign-up-form'

@Component({
	selector: 'app-register-page',
	imports: [SignUpForm],
	templateUrl: './register-page.html',
	styleUrl: './register-page.scss',
})
export class RegisterPage {}

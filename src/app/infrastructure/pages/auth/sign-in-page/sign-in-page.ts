import { Component } from '@angular/core'
import { RegisterLink } from '@infrastructure/features/auth/register/register-link/register-link'
import { SignInForm } from '@infrastructure/features/auth/sign-in-form/sign-in-form'

@Component({
	selector: 'app-sign-in-page',
	imports: [RegisterLink, SignInForm],
	templateUrl: './sign-in-page.html',
	styleUrl: './sign-in-page.scss',
})
export class SignInPage {}

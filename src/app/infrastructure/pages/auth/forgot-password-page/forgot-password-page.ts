import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ForgotPasswordForm } from '@infrastructure/features/auth/forgot-password/forgot-password-form/forgot-password-form'
import { RegisterLink } from '@infrastructure/features/auth/register/register-link/register-link'

@Component({
	selector: 'app-forgot-password-page',
	imports: [RouterModule, ForgotPasswordForm, RegisterLink],
	templateUrl: './forgot-password-page.html',
	styleUrl: './forgot-password-page.scss',
})
export class ForgotPasswordPage {}

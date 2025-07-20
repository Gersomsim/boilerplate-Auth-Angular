import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthFacade } from '@infrastructure/states/facades/auth/auth.facade'
import { UiModule } from '@infrastructure/ui/ui.module'

type VerificationState = 'loading' | 'success' | 'error'

@Component({
	selector: 'app-verified-email',
	imports: [CommonModule, UiModule],
	templateUrl: './verified-email.html',
})
export class VerifiedEmail implements OnInit {
	authFacade = inject(AuthFacade)
	private readonly route = inject(ActivatedRoute)
	private readonly router = inject(Router)
	@Input({ required: true }) token!: string

	verificationState: VerificationState = 'loading'
	errorMessage = ''

	ngOnInit(): void {
		this.verifyEmail()
	}

	private async verifyEmail(): Promise<void> {
		try {
			await this.authFacade.verifyEmail(this.token)
			this.verificationState = 'success'
		} catch (error) {
			this.verificationState = 'error'
			this.errorMessage = 'The verification link has expired or is invalid.'
		}
	}

	redirectToSignIn(): void {
		this.router.navigate(['/sign-in'])
	}

	resendVerification(): void {
		this.verificationState = 'loading'
		this.verifyEmail()
	}
}

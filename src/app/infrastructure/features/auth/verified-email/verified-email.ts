import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UiModule } from '@infrastructure/ui/ui.module'

type VerificationState = 'loading' | 'success' | 'error'

@Component({
	selector: 'app-verified-email',
	imports: [CommonModule, UiModule],
	templateUrl: './verified-email.html',
})
export class VerifiedEmail implements OnInit {
	private readonly route = inject(ActivatedRoute)
	private readonly router = inject(Router)

	verificationState: VerificationState = 'loading'
	errorMessage = ''

	ngOnInit(): void {
		this.verifyEmail()
	}

	private verifyEmail(): void {
		// Simular el proceso de verificación
		setTimeout(() => {
			// Aquí iría la lógica real de verificación
			// Por ahora simulamos diferentes resultados
			const random = Math.random()

			if (random > 0.7) {
				this.verificationState = 'success'
			} else {
				this.verificationState = 'error'
				this.errorMessage = 'El enlace de verificación ha expirado o es inválido.'
			}
		}, 2000)
	}

	redirectToSignIn(): void {
		this.router.navigate(['/sign-in'])
	}

	resendVerification(): void {
		this.verificationState = 'loading'
		this.verifyEmail()
	}
}

import { inject, Injectable } from '@angular/core'
import { AuthToken } from '@infrastructure/di/tokens'

@Injectable({
	providedIn: 'root',
})
export class RequestEmailVerificationUseCase {
	private readonly authRepository = inject(AuthToken)

	async execute(email: string): Promise<void> {
		return this.authRepository.requestEmailVerification(email)
	}
}

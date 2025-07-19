import { inject, Injectable } from '@angular/core'
import { AuthToken } from '@infrastructure/di/tokens'

@Injectable({
	providedIn: 'root',
})
export class VerifyEmailUseCase {
	private readonly authRepository = inject(AuthToken)

	async execute(token: string): Promise<void> {
		return this.authRepository.verifyEmail(token)
	}
}

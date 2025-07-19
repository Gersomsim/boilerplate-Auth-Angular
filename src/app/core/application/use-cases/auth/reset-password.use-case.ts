import { inject, Injectable } from '@angular/core'
import { AuthToken } from '@infrastructure/di/tokens'

@Injectable({
	providedIn: 'root',
})
export class ResetPasswordUseCase {
	private readonly authRepository = inject(AuthToken)

	async execute(token: string, password: string): Promise<void> {
		return this.authRepository.resetPassword(token, password)
	}
}

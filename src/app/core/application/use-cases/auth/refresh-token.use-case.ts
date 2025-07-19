import { inject, Injectable } from '@angular/core'
import { Auth } from '@domain/models'
import { AuthToken } from '@infrastructure/di/tokens'

@Injectable({
	providedIn: 'root',
})
export class RefreshTokenUseCase {
	private readonly authRepository = inject(AuthToken)

	async execute(token: string): Promise<Auth> {
		return this.authRepository.refreshToken(token)
	}
}

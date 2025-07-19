import { inject, Injectable } from '@angular/core'
import { Auth } from '@domain/models'
import { AuthToken } from '@infrastructure/di/tokens'

@Injectable({
	providedIn: 'root',
})
export class LoginUseCase {
	private readonly authRepository = inject(AuthToken)

	async execute(email: string, password: string): Promise<Auth> {
		return this.authRepository.login(email, password)
	}
}

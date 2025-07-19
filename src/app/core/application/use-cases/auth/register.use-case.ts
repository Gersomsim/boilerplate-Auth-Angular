import { inject, Injectable } from '@angular/core'
import { Auth, User } from '@domain/models'
import { AuthToken } from '@infrastructure/di/tokens'

@Injectable({
	providedIn: 'root',
})
export class RegisterUseCase {
	private readonly authRepository = inject(AuthToken)

	async execute(user: Partial<User>): Promise<Auth> {
		return this.authRepository.register(user)
	}
}

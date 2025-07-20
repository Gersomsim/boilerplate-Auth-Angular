import { inject, Injectable } from '@angular/core'
import { Auth, User } from '@domain/models'
import { AuthRepository } from '@domain/repositories'
import { AuthAdapter } from '@infrastructure/adapters/auth/auth.adapter'

@Injectable()
export class AuthImpRepository implements AuthRepository {
	private readonly authAdapter = inject(AuthAdapter)

	login(email: string, password: string): Promise<Auth> {
		return this.authAdapter.login(email, password)
	}

	register(user: Partial<User>): Promise<Auth> {
		return this.authAdapter.register(user)
	}

	forgotPassword(email: string): Promise<void> {
		return this.authAdapter.forgotPassword(email)
	}

	refreshToken(token: string): Promise<Auth> {
		return this.authAdapter.refreshToken(token)
	}

	resetPassword(token: string, password: string): Promise<void> {
		return this.authAdapter.resetPassword(token, password)
	}

	requestEmailVerification(): Promise<void> {
		return this.authAdapter.requestVerificationEmail()
	}

	verifyEmail(token: string): Promise<void> {
		return this.authAdapter.verifyEmail(token)
	}

	verifyToken(token: string): Promise<void> {
		return this.authAdapter.verifyToken(token)
	}
}

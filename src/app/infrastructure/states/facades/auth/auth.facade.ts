import { inject, Injectable } from '@angular/core'
import {
	ForgotPasswordUseCase,
	LoginUseCase,
	RefreshTokenUseCase,
	RegisterUseCase,
	RequestEmailVerificationUseCase,
	ResetPasswordUseCase,
	VerifyEmailUseCase,
	VerifyTokenUseCase,
} from '@application/use-cases'
import { Auth } from '@domain/models'

@Injectable({
	providedIn: 'root',
})
export class AuthFacade {
	private readonly loginUC = inject(LoginUseCase)
	private readonly registerUC = inject(RegisterUseCase)
	private readonly forgotPasswordUC = inject(ForgotPasswordUseCase)
	private readonly resetPasswordUC = inject(ResetPasswordUseCase)
	private readonly verifyEmailUC = inject(VerifyEmailUseCase)
	private readonly verifyTokenUC = inject(VerifyTokenUseCase)
	private readonly refreshTokenUC = inject(RefreshTokenUseCase)
	private readonly reqEmailVerifyUC = inject(RequestEmailVerificationUseCase)

	async signIn(form: { email: string; password: string }): Promise<Auth> {
		const { email, password } = form
		return this.loginUC.execute(email, password)
	}

	async signUp(payload: { email: string; password: string; name: string }): Promise<Auth> {
		return this.registerUC.execute(payload)
	}

	async forgotPassword(email: string): Promise<void> {
		return this.forgotPasswordUC.execute(email)
	}

	async resetPassword(payload: { password: string }, token: string): Promise<void> {
		return this.resetPasswordUC.execute(token, payload.password)
	}

	async verifyEmail(token: string): Promise<void> {
		return this.verifyEmailUC.execute(token)
	}

	async verifyToken(token: string): Promise<void> {
		return this.verifyTokenUC.execute(token)
	}

	async refreshToken(token: string): Promise<Auth> {
		return this.refreshTokenUC.execute(token)
	}

	async requestEmailVerification(email: string): Promise<void> {
		return this.reqEmailVerifyUC.execute(email)
	}
}

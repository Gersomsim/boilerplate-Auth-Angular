import { Auth, User } from '@domain/models'

export interface AuthRepository {
	login(email: string, password: string): Promise<Auth>
	register(user: Partial<User>): Promise<Auth>
	refreshToken(refreshToken: string): Promise<Auth>
	forgotPassword(email: string): Promise<void>
	resetPassword(token: string, password: string): Promise<void>
	verifyEmail(token: string): Promise<void>
	requestEmailVerification(email: string): Promise<void>
	verifyToken(token: string): Promise<void>
}

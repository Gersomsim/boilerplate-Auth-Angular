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
import { faker } from '@faker-js/faker'
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest'
import { mockAuth } from '../../../../core/domain/models/auth/auth.mock'
import { AuthFacade } from './auth.facade'

describe('AuthFacade', () => {
	let spectator: SpectatorService<AuthFacade>
	let loginUseCase: jest.Mocked<LoginUseCase>
	let registerUseCase: jest.Mocked<RegisterUseCase>
	let forgotPasswordUseCase: jest.Mocked<ForgotPasswordUseCase>
	let resetPasswordUseCase: jest.Mocked<ResetPasswordUseCase>
	let verifyEmailUseCase: jest.Mocked<VerifyEmailUseCase>
	let verifyTokenUseCase: jest.Mocked<VerifyTokenUseCase>
	let refreshTokenUseCase: jest.Mocked<RefreshTokenUseCase>
	let requestEmailVerificationUseCase: jest.Mocked<RequestEmailVerificationUseCase>

	const email = faker.internet.email()
	const password = faker.internet.password()
	const name = faker.person.fullName()
	const token = faker.string.alphanumeric(32)

	const createService = createServiceFactory({
		service: AuthFacade,
		providers: [
			{
				provide: LoginUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: RegisterUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: ForgotPasswordUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: ResetPasswordUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: VerifyEmailUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: VerifyTokenUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: RefreshTokenUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
			{
				provide: RequestEmailVerificationUseCase,
				useValue: {
					execute: jest.fn(),
				},
			},
		],
	})

	beforeEach(() => {
		spectator = createService()
		loginUseCase = spectator.inject(LoginUseCase) as jest.Mocked<LoginUseCase>
		registerUseCase = spectator.inject(RegisterUseCase) as jest.Mocked<RegisterUseCase>
		forgotPasswordUseCase = spectator.inject(ForgotPasswordUseCase) as jest.Mocked<ForgotPasswordUseCase>
		resetPasswordUseCase = spectator.inject(ResetPasswordUseCase) as jest.Mocked<ResetPasswordUseCase>
		verifyEmailUseCase = spectator.inject(VerifyEmailUseCase) as jest.Mocked<VerifyEmailUseCase>
		verifyTokenUseCase = spectator.inject(VerifyTokenUseCase) as jest.Mocked<VerifyTokenUseCase>
		refreshTokenUseCase = spectator.inject(RefreshTokenUseCase) as jest.Mocked<RefreshTokenUseCase>
		requestEmailVerificationUseCase = spectator.inject(
			RequestEmailVerificationUseCase,
		) as jest.Mocked<RequestEmailVerificationUseCase>
	})

	it('should be defined', () => {
		expect(spectator).toBeDefined()
	})

	describe('signIn', () => {
		it('should return the correct auth', async () => {
			loginUseCase.execute.mockResolvedValue(mockAuth)
			const result = await spectator.service.signIn({ email, password })
			expect(loginUseCase.execute).toHaveBeenCalledWith(email, password)
			expect(loginUseCase.execute).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockAuth)
		})
	})

	describe('signUp', () => {
		it('should return the correct auth', async () => {
			const payload = { email, password, name }
			registerUseCase.execute.mockResolvedValue(mockAuth)
			const result = await spectator.service.signUp(payload)
			expect(registerUseCase.execute).toHaveBeenCalledWith(payload)
			expect(registerUseCase.execute).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockAuth)
		})
	})

	describe('forgotPassword', () => {
		it('should call forgot password use case', async () => {
			forgotPasswordUseCase.execute.mockResolvedValue()
			await spectator.service.forgotPassword(email)
			expect(forgotPasswordUseCase.execute).toHaveBeenCalledWith(email)
			expect(forgotPasswordUseCase.execute).toHaveBeenCalledTimes(1)
		})
	})

	describe('resetPassword', () => {
		it('should call reset password use case', async () => {
			const payload = { password }
			resetPasswordUseCase.execute.mockResolvedValue()
			await spectator.service.resetPassword(payload, token)
			expect(resetPasswordUseCase.execute).toHaveBeenCalledWith(token, password)
			expect(resetPasswordUseCase.execute).toHaveBeenCalledTimes(1)
		})
	})

	describe('verifyEmail', () => {
		it('should call verify email use case', async () => {
			verifyEmailUseCase.execute.mockResolvedValue()
			await spectator.service.verifyEmail(token)
			expect(verifyEmailUseCase.execute).toHaveBeenCalledWith(token)
			expect(verifyEmailUseCase.execute).toHaveBeenCalledTimes(1)
		})
	})

	describe('verifyToken', () => {
		it('should call verify token use case', async () => {
			verifyTokenUseCase.execute.mockResolvedValue()
			await spectator.service.verifyToken(token)
			expect(verifyTokenUseCase.execute).toHaveBeenCalledWith(token)
			expect(verifyTokenUseCase.execute).toHaveBeenCalledTimes(1)
		})
	})

	describe('refreshToken', () => {
		it('should return the correct auth', async () => {
			refreshTokenUseCase.execute.mockResolvedValue(mockAuth)
			const result = await spectator.service.refreshToken(token)
			expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(token)
			expect(refreshTokenUseCase.execute).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockAuth)
		})
	})

	describe('requestEmailVerification', () => {
		it('should call request email verification use case', async () => {
			requestEmailVerificationUseCase.execute.mockResolvedValue()
			await spectator.service.requestEmailVerification(email)
			expect(requestEmailVerificationUseCase.execute).toHaveBeenCalledWith(email)
			expect(requestEmailVerificationUseCase.execute).toHaveBeenCalledTimes(1)
		})
	})
})

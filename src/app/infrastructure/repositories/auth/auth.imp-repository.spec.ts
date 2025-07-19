import { faker } from '@faker-js/faker'
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest'
import { mockAuth } from '../../../core/domain/models/auth/auth.mock'
import { mockUser } from '../../../core/domain/models/auth/user.mock'
import { AuthAdapter } from '../../adapters/auth/auth.adapter'
import { AuthImpRepository } from './auth.imp-repository'

describe('AuthImpRepository', () => {
	let spectator: SpectatorService<AuthImpRepository>
	const createService = createServiceFactory(AuthImpRepository)
	let mockAdapter: jest.Mocked<AuthAdapter>
	const mockAuthResponse = mockAuth()
	const user = mockUser()
	const email = user.email
	const password = faker.internet.password()
	const token = faker.string.alphanumeric(32)

	beforeEach(() => {
		mockAdapter = {
			login: jest.fn(),
			register: jest.fn(),
			forgotPassword: jest.fn(),
			refreshToken: jest.fn(),
			resetPassword: jest.fn(),
			requestVerificationEmail: jest.fn(),
			verifyEmail: jest.fn(),
			verifyToken: jest.fn(),
		} as unknown as jest.Mocked<AuthAdapter>

		spectator = createService({
			providers: [
				{
					provide: AuthAdapter,
					useValue: mockAdapter,
				},
			],
		})
	})

	it('should be defined', () => {
		expect(spectator).toBeDefined()
	})

	describe('login', () => {
		it('should call authAdapter.login with correct parameters', async () => {
			mockAdapter.login.mockResolvedValue(mockAuthResponse)
			const result = await spectator.service.login(email, password)
			expect(mockAdapter.login).toHaveBeenCalledWith(email, password)
			expect(mockAdapter.login).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockAuthResponse)
		})
	})

	describe('register', () => {
		it('should call authAdapter.register with correct parameters', async () => {
			const userData = { email, password, name: user.name }
			mockAdapter.register.mockResolvedValue(mockAuthResponse)
			const result = await spectator.service.register(userData)
			expect(mockAdapter.register).toHaveBeenCalledWith(userData)
			expect(mockAdapter.register).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockAuthResponse)
		})
	})

	describe('forgotPassword', () => {
		it('should call authAdapter.forgotPassword with correct parameters', async () => {
			mockAdapter.forgotPassword.mockResolvedValue()
			await spectator.service.forgotPassword(email)
			expect(mockAdapter.forgotPassword).toHaveBeenCalledWith(email)
			expect(mockAdapter.forgotPassword).toHaveBeenCalledTimes(1)
		})
	})

	describe('refreshToken', () => {
		it('should call authAdapter.refreshToken with correct parameters', async () => {
			mockAdapter.refreshToken.mockResolvedValue(mockAuthResponse)
			const result = await spectator.service.refreshToken(token)
			expect(mockAdapter.refreshToken).toHaveBeenCalledWith(token)
			expect(mockAdapter.refreshToken).toHaveBeenCalledTimes(1)
			expect(result).toEqual(mockAuthResponse)
		})
	})

	describe('resetPassword', () => {
		it('should call authAdapter.resetPassword with correct parameters', async () => {
			const newPassword = faker.internet.password()
			mockAdapter.resetPassword.mockResolvedValue()
			await spectator.service.resetPassword(token, newPassword)
			expect(mockAdapter.resetPassword).toHaveBeenCalledWith(token, newPassword)
			expect(mockAdapter.resetPassword).toHaveBeenCalledTimes(1)
		})
	})

	describe('requestEmailVerification', () => {
		it('should call authAdapter.requestVerificationEmail', async () => {
			mockAdapter.requestVerificationEmail.mockResolvedValue()
			await spectator.service.requestEmailVerification()
			expect(mockAdapter.requestVerificationEmail).toHaveBeenCalledTimes(1)
		})
	})

	describe('verifyEmail', () => {
		it('should call authAdapter.verifyEmail with correct parameters', async () => {
			mockAdapter.verifyEmail.mockResolvedValue()
			await spectator.service.verifyEmail(token)
			expect(mockAdapter.verifyEmail).toHaveBeenCalledWith(token)
			expect(mockAdapter.verifyEmail).toHaveBeenCalledTimes(1)
		})
	})

	describe('verifyToken', () => {
		it('should call authAdapter.verifyToken with correct parameters', async () => {
			mockAdapter.verifyToken.mockResolvedValue()
			await spectator.service.verifyToken(token)
			expect(mockAdapter.verifyToken).toHaveBeenCalledWith(token)
			expect(mockAdapter.verifyToken).toHaveBeenCalledTimes(1)
		})
	})
})

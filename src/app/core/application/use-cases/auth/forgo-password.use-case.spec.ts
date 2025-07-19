import { TestBed } from '@angular/core/testing'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { AuthRepository } from '../../../domain/repositories'
import { ForgotPasswordUseCase } from './forgot-password.use-case'

describe('ForgotPasswordUseCase', () => {
	let useCase: ForgotPasswordUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockEmail = 'test@example.com'

	beforeEach(() => {
		mockAuthRepository = {
			forgotPassword: jest.fn(),
			login: jest.fn(),
			register: jest.fn(),
			refreshToken: jest.fn(),
			resetPassword: jest.fn(),
			verifyToken: jest.fn(),
			verifyEmail: jest.fn(),
			requestEmailVerification: jest.fn(),
		}
		TestBed.configureTestingModule({
			providers: [
				{
					provide: AuthToken,
					useValue: mockAuthRepository,
				},
			],
		})
		useCase = TestBed.inject(ForgotPasswordUseCase)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	it('should call forgotPassword with the correct email', async () => {
		mockAuthRepository.forgotPassword.mockResolvedValue()
		await useCase.execute(mockEmail)
		expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith(mockEmail)
		expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(1)
	})

	it('should complete successfully when repository succeeds', async () => {
		mockAuthRepository.forgotPassword.mockResolvedValue()
		await expect(useCase.execute(mockEmail)).resolves.toBeUndefined()
	})

	it('should throw error when repository throws error', async () => {
		const mockError = new Error('Network error')
		mockAuthRepository.forgotPassword.mockRejectedValue(mockError)
		await expect(useCase.execute(mockEmail)).rejects.toThrow('Network error')
	})

	it('should handle empty email string', async () => {
		mockAuthRepository.forgotPassword.mockResolvedValue()
		await useCase.execute('')
		expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith('')
	})

	it('should handle email with whitespace', async () => {
		mockAuthRepository.forgotPassword.mockResolvedValue()
		await useCase.execute('  test@example.com  ')
		expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith('  test@example.com  ')
	})

	it('should propagate repository errors without modification', async () => {
		const mockError = new Error('Invalid email format')
		mockAuthRepository.forgotPassword.mockRejectedValue(mockError)
		await expect(useCase.execute(mockEmail)).rejects.toEqual(mockError)
	})

	it('should call repository only once per execution', async () => {
		mockAuthRepository.forgotPassword.mockResolvedValue()
		await useCase.execute(mockEmail)
		expect(mockAuthRepository.forgotPassword).toHaveBeenCalledTimes(1)
	})

	it('should handle different email formats', async () => {
		const testEmails = ['user@domain.com', 'user.name@domain.co.uk', 'user+tag@domain.org', '123@domain.net']

		mockAuthRepository.forgotPassword.mockResolvedValue()

		for (const email of testEmails) {
			await useCase.execute(email)
			expect(mockAuthRepository.forgotPassword).toHaveBeenCalledWith(email)
		}
	})
})

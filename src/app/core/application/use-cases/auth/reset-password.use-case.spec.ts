import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { AuthRepository } from '../../../domain/repositories'
import { ResetPasswordUseCase } from './reset-password.use-case'

describe('ResetPasswordUseCase', () => {
	let useCase: ResetPasswordUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockToken = faker.string.uuid()
	const mockPassword = faker.internet.password()

	beforeEach(() => {
		mockAuthRepository = {
			forgotPassword: jest.fn(),
			login: jest.fn(),
			register: jest.fn(),
			refreshToken: jest.fn(),
			resetPassword: jest.fn(),
			verifyEmail: jest.fn(),
			requestEmailVerification: jest.fn(),
			verifyToken: jest.fn(),
		}
		TestBed.configureTestingModule({
			providers: [
				{
					provide: AuthToken,
					useValue: mockAuthRepository,
				},
			],
		})
		useCase = TestBed.inject(ResetPasswordUseCase)
	})

	describe('Inicialización', () => {
		it('should be defined', () => {
			expect(useCase).toBeDefined()
		})

		it('should inject AuthRepository correctly', () => {
			expect(mockAuthRepository).toBeDefined()
			expect(mockAuthRepository.resetPassword).toBeDefined()
		})
	})

	describe('execute', () => {
		describe('Casos exitosos', () => {
			it('should call repository with valid token and password successfully', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, mockPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, mockPassword)
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledTimes(1)
			})

			it('should return void when password reset is successful', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				const result = await useCase.execute(mockToken, mockPassword)

				// Assert
				expect(result).toBeUndefined()
			})

			it('should handle different token formats', async () => {
				// Arrange
				const testTokens = [
					faker.string.uuid(),
					faker.string.alphanumeric(32),
					faker.string.alphanumeric(64),
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
				]
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act & Assert
				for (const token of testTokens) {
					await useCase.execute(token, mockPassword)
					expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(token, mockPassword)
				}
			})

			it('should handle different password formats', async () => {
				// Arrange
				const testPasswords = [
					'simple',
					'Complex123!',
					'very-long-password-with-special-chars@#$%',
					'123456789',
					'P@ssw0rd!',
					'MySecurePassword123',
				]
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act & Assert
				for (const password of testPasswords) {
					await useCase.execute(mockToken, password)
					expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, password)
				}
			})

			it('should handle special characters in password', async () => {
				// Arrange
				const specialPassword = 'P@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?'
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, specialPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, specialPassword)
			})

			it('should handle unicode characters in password', async () => {
				// Arrange
				const unicodePassword = 'P@ssw0rdñáéíóúü'
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, unicodePassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, unicodePassword)
			})
		})

		describe('Casos de error', () => {
			it('should propagate repository errors', async () => {
				// Arrange
				const errorMessage = 'Invalid or expired token'
				const mockError = new Error(errorMessage)
				mockAuthRepository.resetPassword.mockRejectedValue(mockError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow(errorMessage)
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, mockPassword)
			})

			it('should handle invalid token errors', async () => {
				// Arrange
				const invalidTokenError = new Error('Invalid token format')
				mockAuthRepository.resetPassword.mockRejectedValue(invalidTokenError)

				// Act & Assert
				await expect(useCase.execute('invalid-token', mockPassword)).rejects.toThrow('Invalid token format')
			})

			it('should handle expired token errors', async () => {
				// Arrange
				const expiredTokenError = new Error('Token has expired')
				mockAuthRepository.resetPassword.mockRejectedValue(expiredTokenError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Token has expired')
			})

			it('should handle weak password errors', async () => {
				// Arrange
				const weakPassword = '123'
				const weakPasswordError = new Error('Password does not meet security requirements')
				mockAuthRepository.resetPassword.mockRejectedValue(weakPasswordError)

				// Act & Assert
				await expect(useCase.execute(mockToken, weakPassword)).rejects.toThrow(
					'Password does not meet security requirements',
				)
			})

			it('should handle network errors', async () => {
				// Arrange
				const networkError = new Error('Network error')
				mockAuthRepository.resetPassword.mockRejectedValue(networkError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Network error')
			})

			it('should handle server errors', async () => {
				// Arrange
				const serverError = new Error('Internal server error')
				mockAuthRepository.resetPassword.mockRejectedValue(serverError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Internal server error')
			})

			it('should handle timeout errors', async () => {
				// Arrange
				const timeoutError = new Error('Request timeout')
				mockAuthRepository.resetPassword.mockRejectedValue(timeoutError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Request timeout')
			})

			it('should handle rate limiting errors', async () => {
				// Arrange
				const rateLimitError = new Error('Too many requests')
				mockAuthRepository.resetPassword.mockRejectedValue(rateLimitError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Too many requests')
			})
		})

		describe('Validación de parámetros', () => {
			it('should handle empty token', async () => {
				// Arrange
				const emptyToken = ''
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Token is required'))

				// Act & Assert
				await expect(useCase.execute(emptyToken, mockPassword)).rejects.toThrow('Token is required')
			})

			it('should handle empty password', async () => {
				// Arrange
				const emptyPassword = ''
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockToken, emptyPassword)).rejects.toThrow('Password is required')
			})

			it('should handle null token', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Token is required'))

				// Act & Assert
				await expect(useCase.execute(null as unknown as string, mockPassword)).rejects.toThrow(
					'Token is required',
				)
			})

			it('should handle null password', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockToken, null as unknown as string)).rejects.toThrow(
					'Password is required',
				)
			})

			it('should handle undefined token', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Token is required'))

				// Act & Assert
				await expect(useCase.execute(undefined as unknown as string, mockPassword)).rejects.toThrow(
					'Token is required',
				)
			})

			it('should handle undefined password', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockToken, undefined as unknown as string)).rejects.toThrow(
					'Password is required',
				)
			})

			it('should handle whitespace-only token', async () => {
				// Arrange
				const whitespaceToken = '   '
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Token is required'))

				// Act & Assert
				await expect(useCase.execute(whitespaceToken, mockPassword)).rejects.toThrow('Token is required')
			})

			it('should handle whitespace-only password', async () => {
				// Arrange
				const whitespacePassword = '   '
				mockAuthRepository.resetPassword.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockToken, whitespacePassword)).rejects.toThrow('Password is required')
			})
		})

		describe('Comportamiento del repositorio', () => {
			it('should call repository only once per execution', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, mockPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledTimes(1)
			})

			it('should not call other repository methods', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, mockPassword)

				// Assert
				expect(mockAuthRepository.login).not.toHaveBeenCalled()
				expect(mockAuthRepository.register).not.toHaveBeenCalled()
				expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled()
				expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled()
				expect(mockAuthRepository.verifyToken).not.toHaveBeenCalled()
				expect(mockAuthRepository.verifyEmail).not.toHaveBeenCalled()
				expect(mockAuthRepository.requestEmailVerification).not.toHaveBeenCalled()
			})

			it('should maintain call order with multiple executions', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockResolvedValue()
				const token1 = faker.string.uuid()
				const token2 = faker.string.uuid()
				const password1 = faker.internet.password()
				const password2 = faker.internet.password()

				// Act
				await useCase.execute(token1, password1)
				await useCase.execute(token2, password2)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenNthCalledWith(1, token1, password1)
				expect(mockAuthRepository.resetPassword).toHaveBeenNthCalledWith(2, token2, password2)
			})

			it('should handle concurrent executions', async () => {
				// Arrange
				mockAuthRepository.resetPassword.mockResolvedValue()
				const token1 = faker.string.uuid()
				const token2 = faker.string.uuid()
				const password1 = faker.internet.password()
				const password2 = faker.internet.password()

				// Act
				const promises = [useCase.execute(token1, password1), useCase.execute(token2, password2)]
				await Promise.all(promises)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledTimes(2)
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(token1, password1)
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(token2, password2)
			})
		})

		describe('Casos edge', () => {
			it('should handle very long tokens', async () => {
				// Arrange
				const longToken = 'a'.repeat(1000)
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(longToken, mockPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(longToken, mockPassword)
			})

			it('should handle very long passwords', async () => {
				// Arrange
				const longPassword = 'a'.repeat(1000)
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, longPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, longPassword)
			})

			it('should handle single character token', async () => {
				// Arrange
				const singleCharToken = 'a'
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(singleCharToken, mockPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(singleCharToken, mockPassword)
			})

			it('should handle single character password', async () => {
				// Arrange
				const singleCharPassword = 'a'
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(mockToken, singleCharPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(mockToken, singleCharPassword)
			})

			it('should handle tokens with special characters', async () => {
				// Arrange
				const specialToken = 'token-with-special-chars!@#$%^&*()_+-=[]{}|;:,.<>?'
				mockAuthRepository.resetPassword.mockResolvedValue()

				// Act
				await useCase.execute(specialToken, mockPassword)

				// Assert
				expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(specialToken, mockPassword)
			})
		})

		describe('Manejo de errores específicos', () => {
			it('should handle token already used error', async () => {
				// Arrange
				const alreadyUsedError = new Error('Token has already been used')
				mockAuthRepository.resetPassword.mockRejectedValue(alreadyUsedError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Token has already been used')
			})

			it('should handle password history error', async () => {
				// Arrange
				const passwordHistoryError = new Error('Password cannot be the same as previous passwords')
				mockAuthRepository.resetPassword.mockRejectedValue(passwordHistoryError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow(
					'Password cannot be the same as previous passwords',
				)
			})

			it('should handle account locked error', async () => {
				// Arrange
				const accountLockedError = new Error('Account is locked')
				mockAuthRepository.resetPassword.mockRejectedValue(accountLockedError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('Account is locked')
			})

			it('should handle maintenance mode error', async () => {
				// Arrange
				const maintenanceError = new Error('System is under maintenance')
				mockAuthRepository.resetPassword.mockRejectedValue(maintenanceError)

				// Act & Assert
				await expect(useCase.execute(mockToken, mockPassword)).rejects.toThrow('System is under maintenance')
			})
		})
	})
})

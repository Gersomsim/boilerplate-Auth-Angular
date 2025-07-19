import { TestBed } from '@angular/core/testing'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { mockAuth } from '../../../domain/models/auth/auth.mock'
import { AuthRepository } from '../../../domain/repositories'
import { LoginUseCase } from './login.use-case'

describe('LoginUseCase', () => {
	let useCase: LoginUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockEmail = 'test@example.com'
	const mockPassword = 'password'
	const mockAuthResponse = mockAuth()

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
		useCase = TestBed.inject(LoginUseCase)
	})

	describe('Inicialización', () => {
		it('should be defined', () => {
			expect(useCase).toBeDefined()
		})

		it('should inject AuthRepository correctly', () => {
			expect(mockAuthRepository).toBeDefined()
			expect(mockAuthRepository.login).toBeDefined()
		})
	})

	describe('execute', () => {
		describe('Casos exitosos', () => {
			it('should call login with correct email and password', async () => {
				// Arrange
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act
				await useCase.execute(mockEmail, mockPassword)

				// Assert
				expect(mockAuthRepository.login).toHaveBeenCalledWith(mockEmail, mockPassword)
				expect(mockAuthRepository.login).toHaveBeenCalledTimes(1)
			})

			it('should return auth response with user, token and refreshToken', async () => {
				// Arrange
				const expectedAuth = mockAuth({
					user: {
						id: '1',
						email: mockEmail,
						name: 'Test User',
						roles: ['user'],
					},
					token: 'jwt-token-123',
					refreshToken: 'refresh-token-456',
				})
				mockAuthRepository.login.mockResolvedValue(expectedAuth)

				// Act
				const result = await useCase.execute(mockEmail, mockPassword)

				// Assert
				expect(result).toEqual(expectedAuth)
				expect(result.user).toBeDefined()
				expect(result.token).toBeDefined()
				expect(result.refreshToken).toBeDefined()
			})

			it('should handle different email formats', async () => {
				// Arrange
				const testEmails = [
					'user@domain.com',
					'user.name@domain.com',
					'user+tag@domain.com',
					'user@subdomain.domain.com',
				]
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act & Assert
				for (const email of testEmails) {
					await useCase.execute(email, mockPassword)
					expect(mockAuthRepository.login).toHaveBeenCalledWith(email, mockPassword)
				}
			})

			it('should handle different password formats', async () => {
				// Arrange
				const testPasswords = [
					'simple',
					'Complex123!',
					'very-long-password-with-special-chars@#$%',
					'123456789',
				]
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act & Assert
				for (const password of testPasswords) {
					await useCase.execute(mockEmail, password)
					expect(mockAuthRepository.login).toHaveBeenCalledWith(mockEmail, password)
				}
			})
		})

		describe('Casos de error', () => {
			it('should propagate repository errors', async () => {
				// Arrange
				const errorMessage = 'Invalid credentials'
				const mockError = new Error(errorMessage)
				mockAuthRepository.login.mockRejectedValue(mockError)

				// Act & Assert
				await expect(useCase.execute(mockEmail, mockPassword)).rejects.toThrow(errorMessage)
				expect(mockAuthRepository.login).toHaveBeenCalledWith(mockEmail, mockPassword)
			})

			it('should handle network errors', async () => {
				// Arrange
				const networkError = new Error('Network error')
				mockAuthRepository.login.mockRejectedValue(networkError)

				// Act & Assert
				await expect(useCase.execute(mockEmail, mockPassword)).rejects.toThrow('Network error')
			})

			it('should handle server errors', async () => {
				// Arrange
				const serverError = new Error('Internal server error')
				mockAuthRepository.login.mockRejectedValue(serverError)

				// Act & Assert
				await expect(useCase.execute(mockEmail, mockPassword)).rejects.toThrow('Internal server error')
			})

			it('should handle timeout errors', async () => {
				// Arrange
				const timeoutError = new Error('Request timeout')
				mockAuthRepository.login.mockRejectedValue(timeoutError)

				// Act & Assert
				await expect(useCase.execute(mockEmail, mockPassword)).rejects.toThrow('Request timeout')
			})
		})

		describe('Validación de parámetros', () => {
			it('should handle empty email', async () => {
				// Arrange
				const emptyEmail = ''
				mockAuthRepository.login.mockRejectedValue(new Error('Email is required'))

				// Act & Assert
				await expect(useCase.execute(emptyEmail, mockPassword)).rejects.toThrow('Email is required')
			})

			it('should handle empty password', async () => {
				// Arrange
				const emptyPassword = ''
				mockAuthRepository.login.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockEmail, emptyPassword)).rejects.toThrow('Password is required')
			})

			it('should handle null email', async () => {
				// Arrange
				mockAuthRepository.login.mockRejectedValue(new Error('Email is required'))

				// Act & Assert
				await expect(useCase.execute(null as unknown as string, mockPassword)).rejects.toThrow(
					'Email is required',
				)
			})

			it('should handle null password', async () => {
				// Arrange
				mockAuthRepository.login.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockEmail, null as unknown as string)).rejects.toThrow(
					'Password is required',
				)
			})

			it('should handle undefined email', async () => {
				// Arrange
				mockAuthRepository.login.mockRejectedValue(new Error('Email is required'))

				// Act & Assert
				await expect(useCase.execute(undefined as unknown as string, mockPassword)).rejects.toThrow(
					'Email is required',
				)
			})

			it('should handle undefined password', async () => {
				// Arrange
				mockAuthRepository.login.mockRejectedValue(new Error('Password is required'))

				// Act & Assert
				await expect(useCase.execute(mockEmail, undefined as unknown as string)).rejects.toThrow(
					'Password is required',
				)
			})
		})

		describe('Comportamiento del repositorio', () => {
			it('should call repository only once per execution', async () => {
				// Arrange
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act
				await useCase.execute(mockEmail, mockPassword)

				// Assert
				expect(mockAuthRepository.login).toHaveBeenCalledTimes(1)
			})

			it('should not call other repository methods', async () => {
				// Arrange
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act
				await useCase.execute(mockEmail, mockPassword)

				// Assert
				expect(mockAuthRepository.register).not.toHaveBeenCalled()
				expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled()
				expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled()
				expect(mockAuthRepository.resetPassword).not.toHaveBeenCalled()
				expect(mockAuthRepository.verifyToken).not.toHaveBeenCalled()
				expect(mockAuthRepository.verifyEmail).not.toHaveBeenCalled()
				expect(mockAuthRepository.requestEmailVerification).not.toHaveBeenCalled()
			})

			it('should maintain call order with multiple executions', async () => {
				// Arrange
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act
				await useCase.execute('user1@test.com', 'pass1')
				await useCase.execute('user2@test.com', 'pass2')
				await useCase.execute('user3@test.com', 'pass3')

				// Assert
				expect(mockAuthRepository.login).toHaveBeenNthCalledWith(1, 'user1@test.com', 'pass1')
				expect(mockAuthRepository.login).toHaveBeenNthCalledWith(2, 'user2@test.com', 'pass2')
				expect(mockAuthRepository.login).toHaveBeenNthCalledWith(3, 'user3@test.com', 'pass3')
				expect(mockAuthRepository.login).toHaveBeenCalledTimes(3)
			})
		})

		describe('Tipos de respuesta', () => {
			it('should handle response with minimal auth data', async () => {
				// Arrange
				const minimalAuth = mockAuth({
					user: { id: '1', email: mockEmail, name: 'User', roles: ['user'] },
					token: 'token',
					refreshToken: 'refresh',
				})
				mockAuthRepository.login.mockResolvedValue(minimalAuth)

				// Act
				const result = await useCase.execute(mockEmail, mockPassword)

				// Assert
				expect(result).toEqual(minimalAuth)
			})

			it('should handle response with complete auth data', async () => {
				// Arrange
				const completeAuth = mockAuth({
					user: {
						id: '1',
						email: mockEmail,
						name: 'Complete User',
						roles: ['admin'],
					},
					token: 'complete-jwt-token',
					refreshToken: 'complete-refresh-token',
				})
				mockAuthRepository.login.mockResolvedValue(completeAuth)

				// Act
				const result = await useCase.execute(mockEmail, mockPassword)

				// Assert
				expect(result).toEqual(completeAuth)
			})
		})

		describe('Concurrencia', () => {
			it('should handle multiple concurrent executions', async () => {
				// Arrange
				mockAuthRepository.login.mockResolvedValue(mockAuthResponse)

				// Act
				const promises = [
					useCase.execute('user1@test.com', 'pass1'),
					useCase.execute('user2@test.com', 'pass2'),
					useCase.execute('user3@test.com', 'pass3'),
				]

				// Assert
				await expect(Promise.all(promises)).resolves.toHaveLength(3)
				expect(mockAuthRepository.login).toHaveBeenCalledTimes(3)
			})

			it('should handle concurrent executions with different responses', async () => {
				// Arrange
				const auth1 = mockAuth({ user: { id: '1', email: 'user1@test.com', name: 'User 1', roles: ['user'] } })
				const auth2 = mockAuth({ user: { id: '2', email: 'user2@test.com', name: 'User 2', roles: ['admin'] } })
				const auth3 = mockAuth({
					user: { id: '3', email: 'user3@test.com', name: 'User 3', roles: ['moderator'] },
				})

				mockAuthRepository.login
					.mockResolvedValueOnce(auth1)
					.mockResolvedValueOnce(auth2)
					.mockResolvedValueOnce(auth3)

				// Act
				const [result1, result2, result3] = await Promise.all([
					useCase.execute('user1@test.com', 'pass1'),
					useCase.execute('user2@test.com', 'pass2'),
					useCase.execute('user3@test.com', 'pass3'),
				])

				// Assert
				expect(result1).toEqual(auth1)
				expect(result2).toEqual(auth2)
				expect(result3).toEqual(auth3)
			})
		})
	})
})

import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { AuthRepository } from '../../../domain/repositories'
import { VerifyEmailUseCase } from './verify-email.use-case'

describe('VerifyEmailUseCase', () => {
	let useCase: VerifyEmailUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockToken = faker.string.alphanumeric(64)
	const mockInvalidToken = 'invalid-token'
	const mockEmptyToken = ''

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
		useCase = TestBed.inject(VerifyEmailUseCase)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('execute', () => {
		describe('casos exitosos', () => {
			it('should be defined', () => {
				expect(useCase).toBeDefined()
			})

			it('should verify email successfully with valid token', async () => {
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const result = await useCase.execute(mockToken)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledTimes(1)
				expect(result).toBeUndefined()
			})

			it('should verify email with different token formats', async () => {
				const tokens = [
					faker.string.alphanumeric(32),
					faker.string.alphanumeric(128),
					faker.string.uuid(),
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
				]

				for (const token of tokens) {
					mockAuthRepository.verifyEmail.mockResolvedValue()
					await useCase.execute(token)

					expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(token)
				}

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledTimes(tokens.length)
			})
		})

		describe('casos de error', () => {
			it('should throw error when repository throws error', async () => {
				const errorMessage = 'Token inválido o expirado'
				const mockError = new Error(errorMessage)
				mockAuthRepository.verifyEmail.mockRejectedValue(mockError)

				await expect(useCase.execute(mockToken)).rejects.toThrow(errorMessage)
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledTimes(1)
			})

			it('should handle network errors', async () => {
				const networkError = new Error('Network Error')
				mockAuthRepository.verifyEmail.mockRejectedValue(networkError)

				await expect(useCase.execute(mockToken)).rejects.toThrow('Network Error')
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
			})

			it('should handle server errors (500)', async () => {
				const serverError = new Error('Internal Server Error')
				mockAuthRepository.verifyEmail.mockRejectedValue(serverError)

				await expect(useCase.execute(mockToken)).rejects.toThrow('Internal Server Error')
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
			})

			it('should handle unauthorized errors (401)', async () => {
				const unauthorizedError = new Error('Unauthorized')
				mockAuthRepository.verifyEmail.mockRejectedValue(unauthorizedError)

				await expect(useCase.execute(mockToken)).rejects.toThrow('Unauthorized')
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
			})

			it('should handle forbidden errors (403)', async () => {
				const forbiddenError = new Error('Forbidden')
				mockAuthRepository.verifyEmail.mockRejectedValue(forbiddenError)

				await expect(useCase.execute(mockToken)).rejects.toThrow('Forbidden')
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
			})

			it('should handle not found errors (404)', async () => {
				const notFoundError = new Error('Token not found')
				mockAuthRepository.verifyEmail.mockRejectedValue(notFoundError)

				await expect(useCase.execute(mockToken)).rejects.toThrow('Token not found')
				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockToken)
			})
		})

		describe('casos edge y validaciones', () => {
			it('should handle empty token', async () => {
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const result = await useCase.execute(mockEmptyToken)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(mockEmptyToken)
				expect(result).toBeUndefined()
			})

			it('should handle very long token', async () => {
				const longToken = faker.string.alphanumeric(1000)
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const result = await useCase.execute(longToken)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(longToken)
				expect(result).toBeUndefined()
			})

			it('should handle token with special characters', async () => {
				const specialToken = 'token-with-special-chars!@#$%^&*()_+-=[]{}|;:,.<>?'
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const result = await useCase.execute(specialToken)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(specialToken)
				expect(result).toBeUndefined()
			})

			it('should handle token with spaces', async () => {
				const tokenWithSpaces = 'token with spaces'
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const result = await useCase.execute(tokenWithSpaces)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(tokenWithSpaces)
				expect(result).toBeUndefined()
			})
		})

		describe('comportamiento del repositorio', () => {
			it('should call repository only once per execution', async () => {
				mockAuthRepository.verifyEmail.mockResolvedValue()
				await useCase.execute(mockToken)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledTimes(1)
			})

			it('should not call repository until execute is called', () => {
				expect(mockAuthRepository.verifyEmail).not.toHaveBeenCalled()
			})

			it('should pass token exactly as received to repository', async () => {
				const exactToken = 'exact-token-value'
				mockAuthRepository.verifyEmail.mockResolvedValue()
				await useCase.execute(exactToken)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledWith(exactToken)
			})

			it('should handle multiple consecutive calls', async () => {
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const tokens = [mockToken, faker.string.alphanumeric(32), faker.string.alphanumeric(64)]

				for (const token of tokens) {
					await useCase.execute(token)
				}

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledTimes(tokens.length)
				tokens.forEach((token, index) => {
					expect(mockAuthRepository.verifyEmail).toHaveBeenNthCalledWith(index + 1, token)
				})
			})
		})

		describe('tipos de respuesta', () => {
			it('should handle when repository returns void', async () => {
				mockAuthRepository.verifyEmail.mockResolvedValue(undefined)
				const result = await useCase.execute(mockToken)

				expect(result).toBeUndefined()
			})
		})

		describe('concurrencia', () => {
			it('should handle concurrent executions', async () => {
				mockAuthRepository.verifyEmail.mockResolvedValue()
				const tokens = [mockToken, faker.string.alphanumeric(32), faker.string.alphanumeric(64)]

				const promises = tokens.map(token => useCase.execute(token))
				await Promise.all(promises)

				expect(mockAuthRepository.verifyEmail).toHaveBeenCalledTimes(tokens.length)
			})

			it('should handle concurrent executions with errors', async () => {
				const successToken = mockToken
				const errorToken = mockInvalidToken
				const error = new Error('Token inválido')

				mockAuthRepository.verifyEmail.mockResolvedValueOnce().mockRejectedValueOnce(error)

				const successPromise = useCase.execute(successToken)
				const errorPromise = useCase.execute(errorToken)

				await expect(successPromise).resolves.toBeUndefined()
				await expect(errorPromise).rejects.toThrow('Token inválido')
			})
		})
	})
})

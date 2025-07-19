import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { AuthRepository } from '../../../domain/repositories'
import { VerifyTokenUseCase } from './verify-token.use-case'

describe('VerifyTokenUseCase', () => {
	let useCase: VerifyTokenUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockToken = faker.string.alphanumeric(64)

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
		useCase = TestBed.inject(VerifyTokenUseCase)
	})

	describe('Inicialización', () => {
		it('should be defined', () => {
			expect(useCase).toBeDefined()
		})

		it('should inject AuthRepository correctly', () => {
			expect(mockAuthRepository).toBeDefined()
			expect(mockAuthRepository.verifyToken).toBeDefined()
		})
	})

	describe('Casos de éxito', () => {
		it('should verify token successfully when token is valid', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const result = await useCase.execute(mockToken)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(mockToken)
			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(1)
			expect(result).toBeUndefined()
		})

		it('should verify token with different token formats', async () => {
			const tokens = [
				faker.string.alphanumeric(32),
				faker.string.alphanumeric(128),
				faker.string.alphanumeric(256),
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
			]

			for (const token of tokens) {
				mockAuthRepository.verifyToken.mockResolvedValue()
				await useCase.execute(token)

				expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)
			}

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(tokens.length)
		})

		it('should handle empty string token', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const result = await useCase.execute('')

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith('')
			expect(result).toBeUndefined()
		})
	})

	describe('Casos de error', () => {
		it('should throw error when repository throws error', async () => {
			const errorMessage = 'Token inválido'
			const error = new Error(errorMessage)
			mockAuthRepository.verifyToken.mockRejectedValue(error)

			await expect(useCase.execute(mockToken)).rejects.toThrow(errorMessage)
			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(mockToken)
		})

		it('should handle network errors', async () => {
			const networkError = new Error('Network Error')
			mockAuthRepository.verifyToken.mockRejectedValue(networkError)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Network Error')
		})

		it('should handle server errors', async () => {
			const serverError = new Error('Internal Server Error')
			mockAuthRepository.verifyToken.mockRejectedValue(serverError)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Internal Server Error')
		})

		it('should handle timeout errors', async () => {
			const timeoutError = new Error('Request timeout')
			mockAuthRepository.verifyToken.mockRejectedValue(timeoutError)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Request timeout')
		})

		it('should handle authentication errors', async () => {
			const authError = new Error('Unauthorized')
			mockAuthRepository.verifyToken.mockRejectedValue(authError)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Unauthorized')
		})

		it('should handle token expired errors', async () => {
			const expiredError = new Error('Token expired')
			mockAuthRepository.verifyToken.mockRejectedValue(expiredError)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Token expired')
		})

		it('should handle malformed token errors', async () => {
			const malformedError = new Error('Malformed token')
			mockAuthRepository.verifyToken.mockRejectedValue(malformedError)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Malformed token')
		})
	})

	describe('Validaciones de entrada', () => {
		it('should handle null token', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const result = await useCase.execute(null as unknown as string)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(null)
			expect(result).toBeUndefined()
		})

		it('should handle undefined token', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const result = await useCase.execute(undefined as unknown as string)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(undefined)
			expect(result).toBeUndefined()
		})

		it('should handle non-string token types', async () => {
			const invalidTokens: unknown[] = [123, true, false, {}, [], null, undefined]

			for (const token of invalidTokens) {
				mockAuthRepository.verifyToken.mockResolvedValue()
				await useCase.execute(token as string)

				expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)
			}

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(invalidTokens.length)
		})

		it('should handle special characters in token', async () => {
			const specialTokens = [
				'token-with-dashes',
				'token_with_underscores',
				'token.with.dots',
				'token+with+plus',
				'token/with/slashes',
				'token=with=equals',
				'token?with?question',
				'token#with#hash',
				'token@with@at',
				'token!with!exclamation',
			]

			for (const token of specialTokens) {
				mockAuthRepository.verifyToken.mockResolvedValue()
				await useCase.execute(token)

				expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)
			}

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(specialTokens.length)
		})
	})

	describe('Comportamiento asíncrono', () => {
		it('should handle concurrent token verifications', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const tokens = [
				faker.string.alphanumeric(32),
				faker.string.alphanumeric(64),
				faker.string.alphanumeric(128),
			]

			const promises = tokens.map(token => useCase.execute(token))
			await Promise.all(promises)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(tokens.length)
			tokens.forEach(token => {
				expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)
			})
		})

		it('should handle repository delays', async () => {
			mockAuthRepository.verifyToken.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

			const startTime = Date.now()
			await useCase.execute(mockToken)
			const endTime = Date.now()

			expect(endTime - startTime).toBeGreaterThanOrEqual(100)
			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(mockToken)
		})

		it('should handle repository that throws after delay', async () => {
			mockAuthRepository.verifyToken.mockImplementation(
				() => new Promise((_, reject) => setTimeout(() => reject(new Error('Delayed error')), 50)),
			)

			await expect(useCase.execute(mockToken)).rejects.toThrow('Delayed error')
		})
	})

	describe('Edge cases', () => {
		it('should handle very long tokens', async () => {
			const longToken = faker.string.alphanumeric(1000)
			mockAuthRepository.verifyToken.mockResolvedValue()

			const result = await useCase.execute(longToken)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(longToken)
			expect(result).toBeUndefined()
		})

		it('should handle tokens with unicode characters', async () => {
			const unicodeTokens = [
				'token-ñ-á-é-í-ó-ú',
				'token-🚀-🌟-💻',
				'token-中文-日本語-한국어',
				'token-привет-мир',
			]

			for (const token of unicodeTokens) {
				mockAuthRepository.verifyToken.mockResolvedValue()
				await useCase.execute(token)

				expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)
			}
		})

		it('should handle tokens with whitespace', async () => {
			const tokensWithWhitespace = [' token ', '\ttoken\t', '\ntoken\n', '  token  ']

			for (const token of tokensWithWhitespace) {
				mockAuthRepository.verifyToken.mockResolvedValue()
				await useCase.execute(token)

				expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)
			}
		})

		it('should handle repository method being called multiple times', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()

			await useCase.execute(mockToken)
			await useCase.execute(mockToken)
			await useCase.execute(mockToken)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(3)
			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(mockToken)
		})
	})

	describe('Integración con el repositorio', () => {
		it('should pass token exactly as received to repository', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const originalToken = mockToken

			await useCase.execute(originalToken)

			expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(originalToken)
			expect(mockAuthRepository.verifyToken).toHaveBeenCalledTimes(1)
		})

		it('should propagate repository errors without modification', async () => {
			const originalError = new Error('Original repository error')
			mockAuthRepository.verifyToken.mockRejectedValue(originalError)

			await expect(useCase.execute(mockToken)).rejects.toBe(originalError)
		})
	})

	describe('Limpieza y teardown', () => {
		afterEach(() => {
			jest.clearAllMocks()
		})

		it('should not have side effects after execution', async () => {
			mockAuthRepository.verifyToken.mockResolvedValue()
			const initialCallCount = mockAuthRepository.verifyToken.mock.calls.length

			await useCase.execute(mockToken)

			expect(mockAuthRepository.verifyToken.mock.calls.length).toBe(initialCallCount + 1)
		})
	})
})

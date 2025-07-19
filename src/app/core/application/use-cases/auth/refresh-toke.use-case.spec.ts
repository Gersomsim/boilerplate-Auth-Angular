import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { mockAuth } from '../../../domain/models/auth/auth.mock'
import { AuthRepository } from '../../../domain/repositories'
import { RefreshTokenUseCase } from './refresh-token.use-case'

describe('RefreshTokenUseCase', () => {
	let useCase: RefreshTokenUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockRefreshToken = faker.string.uuid()
	const mockAuthResponse = mockAuth()

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
		useCase = TestBed.inject(RefreshTokenUseCase)
	})

	it('should be defined', () => {
		expect(useCase).toBeDefined()
	})

	it('should call refreshToken with the correct refresh token', async () => {
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)
		const result = await useCase.execute(mockRefreshToken)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken)
		expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(1)
		expect(result).toEqual(mockAuthResponse)
	})

	it('should handle empty token string', async () => {
		const emptyToken = ''
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)

		const result = await useCase.execute(emptyToken)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(emptyToken)
		expect(result).toEqual(mockAuthResponse)
	})

	it('should handle whitespace-only token', async () => {
		const whitespaceToken = '   '
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)

		const result = await useCase.execute(whitespaceToken)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(whitespaceToken)
		expect(result).toEqual(mockAuthResponse)
	})

	it('should handle very long token', async () => {
		const longToken = faker.string.alphanumeric(1000)
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)

		const result = await useCase.execute(longToken)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(longToken)
		expect(result).toEqual(mockAuthResponse)
	})

	it('should handle special characters in token', async () => {
		const specialToken = 'token-with-special-chars!@#$%^&*()_+-=[]{}|;:,.<>?'
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)

		const result = await useCase.execute(specialToken)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(specialToken)
		expect(result).toEqual(mockAuthResponse)
	})

	it('should propagate repository errors', async () => {
		const errorMessage = 'Invalid refresh token'
		const mockError = new Error(errorMessage)
		mockAuthRepository.refreshToken.mockRejectedValue(mockError)

		await expect(useCase.execute(mockRefreshToken)).rejects.toThrow(errorMessage)
		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken)
		expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(1)
	})

	it('should handle network errors from repository', async () => {
		const networkError = new Error('Network error')
		mockAuthRepository.refreshToken.mockRejectedValue(networkError)

		await expect(useCase.execute(mockRefreshToken)).rejects.toThrow('Network error')
		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken)
	})

	it('should handle authentication errors from repository', async () => {
		const authError = new Error('Token expired')
		mockAuthRepository.refreshToken.mockRejectedValue(authError)

		await expect(useCase.execute(mockRefreshToken)).rejects.toThrow('Token expired')
		expect(mockAuthRepository.refreshToken).toHaveBeenCalledWith(mockRefreshToken)
	})

	it('should return correct Auth object structure', async () => {
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)

		const result = await useCase.execute(mockRefreshToken)

		expect(result).toHaveProperty('user')
		expect(result).toHaveProperty('token')
		expect(result).toHaveProperty('refreshToken')
		expect(typeof result.token).toBe('string')
		expect(typeof result.refreshToken).toBe('string')
		expect(typeof result.user).toBe('object')
	})

	it('should call repository only once per execution', async () => {
		mockAuthRepository.refreshToken.mockResolvedValue(mockAuthResponse)

		await useCase.execute(mockRefreshToken)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(1)
	})

	it('should handle multiple consecutive calls', async () => {
		const token1 = faker.string.uuid()
		const token2 = faker.string.uuid()
		const authResponse1 = mockAuth()
		const authResponse2 = mockAuth()

		mockAuthRepository.refreshToken.mockResolvedValueOnce(authResponse1).mockResolvedValueOnce(authResponse2)

		const result1 = await useCase.execute(token1)
		const result2 = await useCase.execute(token2)

		expect(mockAuthRepository.refreshToken).toHaveBeenCalledTimes(2)
		expect(mockAuthRepository.refreshToken).toHaveBeenNthCalledWith(1, token1)
		expect(mockAuthRepository.refreshToken).toHaveBeenNthCalledWith(2, token2)
		expect(result1).toEqual(authResponse1)
		expect(result2).toEqual(authResponse2)
	})
})

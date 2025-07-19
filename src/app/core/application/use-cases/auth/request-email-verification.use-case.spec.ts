import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { AuthRepository } from '../../../domain/repositories'
import { RequestEmailVerificationUseCase } from './request-email-verification.use-case'

describe('RequestEmailVerificationUseCase', () => {
	let useCase: RequestEmailVerificationUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>
	const mockEmail = faker.internet.email()

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
		useCase = TestBed.inject(RequestEmailVerificationUseCase)
	})

	describe('execute', () => {
		it('should be defined', () => {
			expect(useCase).toBeDefined()
		})

		it('should call repository with valid email successfully', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()
			const result = await useCase.execute(mockEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(mockEmail)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(1)
			expect(result).toBeUndefined()
		})

		it('should handle different email formats', async () => {
			const testEmails = [
				'test@example.com',
				'user.name@domain.co.uk',
				'user+tag@example.org',
				'123@test.com',
				'UPPERCASE@EXAMPLE.COM',
			]

			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			for (const email of testEmails) {
				await useCase.execute(email)
				expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(email)
			}

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(testEmails.length)
		})

		it('should handle empty string email', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()
			const emptyEmail = ''

			await useCase.execute(emptyEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(emptyEmail)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(1)
		})

		it('should handle whitespace-only email', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()
			const whitespaceEmail = '   '

			await useCase.execute(whitespaceEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(whitespaceEmail)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(1)
		})

		it('should propagate repository errors', async () => {
			const errorMessage = 'Network error'
			const mockError = new Error(errorMessage)
			mockAuthRepository.requestEmailVerification.mockRejectedValue(mockError)

			await expect(useCase.execute(mockEmail)).rejects.toThrow(errorMessage)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(mockEmail)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(1)
		})

		it('should handle repository timeout errors', async () => {
			const timeoutError = new Error('Request timeout')
			mockAuthRepository.requestEmailVerification.mockRejectedValue(timeoutError)

			await expect(useCase.execute(mockEmail)).rejects.toThrow('Request timeout')
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(mockEmail)
		})

		it('should handle server errors from repository', async () => {
			const serverError = new Error('Internal server error')
			mockAuthRepository.requestEmailVerification.mockRejectedValue(serverError)

			await expect(useCase.execute(mockEmail)).rejects.toThrow('Internal server error')
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(mockEmail)
		})

		it('should handle multiple consecutive calls', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()
			const emails = ['test1@example.com', 'test2@example.com', 'test3@example.com']

			const promises = emails.map(email => useCase.execute(email))
			await Promise.all(promises)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(3)
			emails.forEach(email => {
				expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(email)
			})
		})

		it('should handle repository returning void promise', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue(undefined)
			const result = await useCase.execute(mockEmail)

			expect(result).toBeUndefined()
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(mockEmail)
		})

		it('should handle very long email addresses', async () => {
			const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(50) + '.com'
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(longEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(longEmail)
		})

		it('should handle special characters in email', async () => {
			const specialEmail = 'test.email+tag!#$%&*()=@example-domain.com'
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(specialEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(specialEmail)
		})

		it('should handle unicode characters in email', async () => {
			const unicodeEmail = 'tëst@exämple.com'
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(unicodeEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(unicodeEmail)
		})

		it('should handle repository method being called multiple times with same email', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(mockEmail)
			await useCase.execute(mockEmail)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(2)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenNthCalledWith(1, mockEmail)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenNthCalledWith(2, mockEmail)
		})

		it('should handle repository method being called with different emails', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()
			const email1 = 'test1@example.com'
			const email2 = 'test2@example.com'

			await useCase.execute(email1)
			await useCase.execute(email2)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledTimes(2)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenNthCalledWith(1, email1)
			expect(mockAuthRepository.requestEmailVerification).toHaveBeenNthCalledWith(2, email2)
		})
	})

	describe('edge cases', () => {
		it('should handle null email parameter', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(null as unknown as string)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(null)
		})

		it('should handle undefined email parameter', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(undefined as unknown as string)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(undefined)
		})

		it('should handle non-string email parameter', async () => {
			mockAuthRepository.requestEmailVerification.mockResolvedValue()

			await useCase.execute(123 as unknown as string)

			expect(mockAuthRepository.requestEmailVerification).toHaveBeenCalledWith(123)
		})
	})
})

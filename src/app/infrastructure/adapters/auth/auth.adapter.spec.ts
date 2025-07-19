import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { of } from 'rxjs'
import { mockAuth } from '../../../core/domain/models/auth/auth.mock'
import { HttpService } from '../../http/http.service'
import { AuthAdapter } from './auth.adapter'

describe('AuthAdapter', () => {
	let spectator: AuthAdapter
	let mockHttp: jest.Mocked<HttpService>
	const mockUser = {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	}
	const mockAuthResponse = mockAuth()

	beforeEach(() => {
		mockHttp = {
			baseUrl: 'http://localhost:3000',
			get: jest.fn(),
			post: jest.fn(),
			put: jest.fn(),
			patch: jest.fn(),
			delete: jest.fn(),
			postWithHeaders: jest.fn(),
		} as unknown as jest.Mocked<HttpService>

		TestBed.configureTestingModule({
			providers: [
				{
					provide: HttpService,
					useValue: mockHttp,
				},
			],
		})

		spectator = TestBed.inject(AuthAdapter)
	})

	it('should be defined', () => {
		expect(spectator).toBeDefined()
	})

	describe('login', () => {
		it('should call http.post with correct parameters', async () => {
			// Arrange
			const email = faker.internet.email()
			const password = faker.internet.password()
			mockHttp.post.mockReturnValue(of(mockAuthResponse))

			// Act
			const result = await spectator.login(email, password)

			// Assert
			expect(result).toEqual(mockAuthResponse)
			expect(mockHttp.post).toHaveBeenCalledWith('/auth/login', { email, password })
			expect(mockHttp.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('register', () => {
		it('should call http.post with correct parameters', async () => {
			// Arrange
			mockHttp.post.mockReturnValue(of(mockAuthResponse))

			// Act
			const result = await spectator.register(mockUser)

			// Assert
			expect(result).toEqual(mockAuthResponse)
			expect(mockHttp.post).toHaveBeenCalledWith('/auth/register', mockUser)
			expect(mockHttp.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('forgotPassword', () => {
		it('should call http.post with correct parameters', async () => {
			// Arrange
			const email = faker.internet.email()
			mockHttp.post.mockReturnValue(of(undefined))

			// Act
			await spectator.forgotPassword(email)

			// Assert
			expect(mockHttp.post).toHaveBeenCalledWith('/auth/forgot-password', { email })
			expect(mockHttp.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('resetPassword', () => {
		it('should call http.postWithHeaders with correct parameters', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			const password = faker.internet.password()
			mockHttp.postWithHeaders.mockReturnValue(of(undefined))

			// Act
			await spectator.resetPassword(token, password)

			// Assert
			expect(mockHttp.postWithHeaders).toHaveBeenCalledWith(
				'/auth/reset-password',
				{ password },
				expect.objectContaining({
					get: expect.any(Function),
				}),
			)
			expect(mockHttp.postWithHeaders).toHaveBeenCalledTimes(1)
		})

		it('should set Authorization header with Bearer token', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			const password = faker.internet.password()
			mockHttp.postWithHeaders.mockReturnValue(of(undefined))

			// Act
			await spectator.resetPassword(token, password)

			// Assert
			const headers = mockHttp.postWithHeaders.mock.calls[0][2]
			expect(headers.get('Authorization')).toBe(`Bearer ${token}`)
		})
	})

	describe('refreshToken', () => {
		it('should call http.postWithHeaders with correct parameters', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			mockHttp.postWithHeaders.mockReturnValue(of(mockAuthResponse))

			// Act
			const result = await spectator.refreshToken(token)

			// Assert
			expect(result).toEqual(mockAuthResponse)
			expect(mockHttp.postWithHeaders).toHaveBeenCalledWith(
				'/auth/refresh-token',
				{},
				expect.objectContaining({
					get: expect.any(Function),
				}),
			)
			expect(mockHttp.postWithHeaders).toHaveBeenCalledTimes(1)
		})

		it('should set Authorization header with Bearer token', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			mockHttp.postWithHeaders.mockReturnValue(of(mockAuthResponse))

			// Act
			await spectator.refreshToken(token)

			// Assert
			const headers = mockHttp.postWithHeaders.mock.calls[0][2]
			expect(headers.get('Authorization')).toBe(`Bearer ${token}`)
		})
	})

	describe('requestVerificationEmail', () => {
		it('should call http.post with correct parameters', async () => {
			// Arrange
			mockHttp.post.mockReturnValue(of(undefined))

			// Act
			await spectator.requestVerificationEmail()

			// Assert
			expect(mockHttp.post).toHaveBeenCalledWith('/auth/resend-verification-email', {})
			expect(mockHttp.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('verifyEmail', () => {
		it('should call http.get with correct parameters', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			mockHttp.get.mockReturnValue(of(undefined))

			// Act
			await spectator.verifyEmail(token)

			// Assert
			expect(mockHttp.get).toHaveBeenCalledWith('/auth/verify-email', expect.any(Object), { token })
			expect(mockHttp.get).toHaveBeenCalledTimes(1)
		})

		it('should create HttpContext for the request', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			mockHttp.get.mockReturnValue(of(undefined))

			// Act
			await spectator.verifyEmail(token)

			// Assert
			const context = mockHttp.get.mock.calls[0][1]
			expect(context).toBeInstanceOf(Object)
		})
	})

	describe('verifyToken', () => {
		it('should call http.get with correct parameters', async () => {
			// Arrange
			const token = faker.string.alphanumeric(32)
			mockHttp.get.mockReturnValue(of(undefined))

			// Act
			await spectator.verifyToken(token)

			// Assert
			expect(mockHttp.get).toHaveBeenCalledWith(`/auth/verify-token/${token}`)
			expect(mockHttp.get).toHaveBeenCalledTimes(1)
		})
	})
})

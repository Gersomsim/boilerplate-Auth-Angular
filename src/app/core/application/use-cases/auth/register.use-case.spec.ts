import { TestBed } from '@angular/core/testing'
import { faker } from '@faker-js/faker'
import { AuthToken } from '../../../../infrastructure/di/tokens'
import { User } from '../../../domain/models'
import { mockAuth } from '../../../domain/models/auth/auth.mock'
import { AuthRepository } from '../../../domain/repositories'
import { RegisterUseCase } from './register.use-case'

describe('RegisterUseCase', () => {
	let useCase: RegisterUseCase
	let mockAuthRepository: jest.Mocked<AuthRepository>

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

		useCase = TestBed.inject(RegisterUseCase)
	})

	describe('Instanciación', () => {
		it('should be defined', () => {
			expect(useCase).toBeDefined()
		})

		it('should be an instance of RegisterUseCase', () => {
			expect(useCase).toBeInstanceOf(RegisterUseCase)
		})
	})

	describe('Casos exitosos', () => {
		it('should register user with complete user data', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(mockAuthRepository.register).toHaveBeenCalledTimes(1)
			expect(result).toEqual(expectedAuth)
		})

		it('should register user with minimal required data', async () => {
			// Arrange
			const mockUserData = {
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should register user with only email and password', async () => {
			// Arrange
			const mockUserData = {
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with special characters in name', async () => {
			// Arrange
			const mockUserData = {
				name: 'José María García-López',
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with complex email', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: 'user.name+tag@domain.co.uk',
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})
	})

	describe('Manejo de errores', () => {
		it('should propagate repository errors', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedError = new Error('Network error')
			mockAuthRepository.register.mockRejectedValue(expectedError)

			// Act & Assert
			await expect(useCase.execute(mockUserData)).rejects.toThrow('Network error')
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
		})

		it('should handle authentication errors', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const authError = new Error('Invalid credentials')
			mockAuthRepository.register.mockRejectedValue(authError)

			// Act & Assert
			await expect(useCase.execute(mockUserData)).rejects.toThrow('Invalid credentials')
		})

		it('should handle server errors', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const serverError = new Error('Internal server error')
			mockAuthRepository.register.mockRejectedValue(serverError)

			// Act & Assert
			await expect(useCase.execute(mockUserData)).rejects.toThrow('Internal server error')
		})

		it('should handle timeout errors', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const timeoutError = new Error('Request timeout')
			mockAuthRepository.register.mockRejectedValue(timeoutError)

			// Act & Assert
			await expect(useCase.execute(mockUserData)).rejects.toThrow('Request timeout')
		})
	})

	describe('Casos edge y límites', () => {
		it('should handle empty user object', async () => {
			// Arrange
			const mockUserData = {}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with very long name', async () => {
			// Arrange
			const mockUserData = {
				name: 'A'.repeat(100),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with very long email', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: `${'a'.repeat(50)}@${'domain'.repeat(20)}.com`,
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with special characters in password', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: 'P@ssw0rd!@#$%^&*()',
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with unicode characters', async () => {
			// Arrange
			const mockUserData = {
				name: 'José María García-López 中文',
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})
	})

	describe('Validación de parámetros', () => {
		it('should handle null user data', async () => {
			// Arrange
			const mockUserData = null as unknown as Partial<User>
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle undefined user data', async () => {
			// Arrange
			const mockUserData = undefined as unknown as Partial<User>
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with only name', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})

		it('should handle user with only email', async () => {
			// Arrange
			const mockUserData = {
				email: faker.internet.email(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})
	})

	describe('Comportamiento asíncrono', () => {
		it('should handle multiple concurrent registrations', async () => {
			// Arrange
			const mockUserData1 = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const mockUserData2 = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth1 = mockAuth()
			const expectedAuth2 = mockAuth()
			mockAuthRepository.register.mockResolvedValueOnce(expectedAuth1).mockResolvedValueOnce(expectedAuth2)

			// Act
			const [result1, result2] = await Promise.all([
				useCase.execute(mockUserData1),
				useCase.execute(mockUserData2),
			])

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledTimes(2)
			expect(result1).toEqual(expectedAuth1)
			expect(result2).toEqual(expectedAuth2)
		})

		it('should handle delayed response', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockImplementation(
				() => new Promise(resolve => setTimeout(() => resolve(expectedAuth), 100)),
			)

			// Act
			const result = await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledWith(mockUserData)
			expect(result).toEqual(expectedAuth)
		})
	})

	describe('Verificación de llamadas al repositorio', () => {
		it('should call repository register method exactly once', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.register).toHaveBeenCalledTimes(1)
		})

		it('should not call other repository methods', async () => {
			// Arrange
			const mockUserData = {
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
			}
			const expectedAuth = mockAuth()
			mockAuthRepository.register.mockResolvedValue(expectedAuth)

			// Act
			await useCase.execute(mockUserData)

			// Assert
			expect(mockAuthRepository.login).not.toHaveBeenCalled()
			expect(mockAuthRepository.refreshToken).not.toHaveBeenCalled()
			expect(mockAuthRepository.forgotPassword).not.toHaveBeenCalled()
			expect(mockAuthRepository.resetPassword).not.toHaveBeenCalled()
			expect(mockAuthRepository.verifyEmail).not.toHaveBeenCalled()
			expect(mockAuthRepository.requestEmailVerification).not.toHaveBeenCalled()
			expect(mockAuthRepository.verifyToken).not.toHaveBeenCalled()
		})
	})
})

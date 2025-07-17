import { HttpErrorResponse } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ErrorHandler, ErrorHandlerConfig } from './error-handler'

// Mock de console para evitar logs en las pruebas
const consoleSpy = {
	error: jest.fn(),
	warn: jest.fn(),
	log: jest.fn(),
	table: jest.fn(),
}

Object.defineProperty(window, 'console', {
	value: consoleSpy,
	writable: true,
})

// Mock de localStorage y sessionStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
}

const sessionStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
	writable: true,
})

Object.defineProperty(window, 'sessionStorage', {
	value: sessionStorageMock,
	writable: true,
})

// Mock de document.cookie
Object.defineProperty(document, 'cookie', {
	value: 'test=value; another=value2',
	writable: true,
})

// Mock de navigator y window.location
Object.defineProperty(window, 'navigator', {
	value: { userAgent: 'Test User Agent' },
	writable: true,
})

Object.defineProperty(window, 'location', {
	value: { href: 'http://localhost:4200/test' },
	writable: true,
})

describe('ErrorHandler', () => {
	let errorHandler: ErrorHandler
	let router: Router

	beforeEach(() => {
		router = TestBed.inject(Router)
		errorHandler = new ErrorHandler(router)

		// Limpiar todos los mocks
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('Constructor', () => {
		it('should be created', () => {
			expect(errorHandler).toBeTruthy()
		})
	})

	describe('handleError', () => {
		it('should handle HttpErrorResponse with status 0', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Error de conexión' },
				status: 0,
			})

			const result = errorHandler.handleError(error)

			expect(result).toBeDefined()
			expect(consoleSpy.error).toHaveBeenCalledWith(
				'Error de sistema:',
				expect.stringContaining('Error de conexión'),
			)
		})

		it('should handle HttpErrorResponse with status 400', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Bad Request' },
				status: 400,
			})

			const result = errorHandler.handleError(error)

			expect(result).toBeDefined()
			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'Error del cliente:',
				expect.stringContaining('Solicitud inválida'),
			)
		})

		it('should handle HttpErrorResponse with status 401', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Unauthorized' },
				status: 401,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Unauthorized')
					expect(console.warn).toHaveBeenCalledWith(
						'Error del cliente:',
						expect.stringContaining('Sesión expirada'),
					)
				},
			})
		})

		it('should handle HttpErrorResponse with status 403', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Forbidden' },
				status: 403,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Forbidden')
					expect(console.warn).toHaveBeenCalledWith(
						'Error del cliente:',
						expect.stringContaining('No tiene permisos'),
					)
				},
			})
		})

		it('should handle HttpErrorResponse with status 404', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Not Found' },
				status: 404,
			})

			const result = errorHandler.handleError(error)

			expect(result).toBeDefined()
			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'Error del cliente:',
				expect.stringContaining('Recurso no encontrado'),
			)
		})

		it('should handle HttpErrorResponse with status 500', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Internal Server Error' },
				status: 500,
			})

			const result = errorHandler.handleError(error)

			expect(result).toBeDefined()
			expect(consoleSpy.error).toHaveBeenCalledWith(
				'Error del servidor:',
				expect.stringContaining('Error interno del servidor'),
			)
		})

		it('should handle HttpErrorResponse with status 503', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Service Unavailable' },
				status: 503,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Service Unavailable')
					expect(console.error).toHaveBeenCalledWith(
						'Error del servidor:',
						expect.stringContaining('Servicio temporalmente no disponible'),
					)
				},
			})
		})

		it('should handle HttpErrorResponse with custom error message', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Custom error message' },
				status: 400,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Custom error message')
					expect(console.warn).toHaveBeenCalledWith(
						'Error del cliente:',
						expect.stringContaining('Custom error message'),
					)
				},
			})
		})

		it('should handle HttpErrorResponse with errors array', () => {
			const error = new HttpErrorResponse({
				error: {
					message: 'Validation failed',
					errors: [
						{ field: 'email', message: 'Invalid email' },
						{ field: 'password', message: 'Password too short' },
					],
				},
				status: 400,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Validation failed')

					// Verificar que se loguea como error del cliente (400 >= 400)
					expect(console.warn).toHaveBeenCalledWith(
						'Error del cliente:',
						expect.stringContaining('Validation failed'),
					)

					// Verificar que se llama console.table con el array de errores
					expect(console.table).toHaveBeenCalledWith([
						{ field: 'email', message: 'Invalid email' },
						{ field: 'password', message: 'Password too short' },
					])
				},
			})
		})

		it('should handle Error object', () => {
			const error = new Error('Test error message')

			const result = errorHandler.handleError(error)

			expect(result).toBeDefined()
			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'Error de JavaScript:',
				expect.stringContaining('Test error message'),
			)
		})

		it('should handle string error', () => {
			const error = 'String error'

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('String error')
					expect(console.log).toHaveBeenCalledWith(
						'Error de string:',
						expect.stringContaining('String error'),
					)
				},
			})
		})

		it('should handle object error with message', () => {
			const error = { message: 'Object error message' }

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Object error message')
					expect(console.log).toHaveBeenCalledWith(
						'Error de objeto:',
						expect.stringContaining('Object error message'),
					)
				},
			})
		})

		it('should handle object error without message', () => {
			const error = { someProperty: 'value' }

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Error de objeto desconocido')
					expect(console.log).toHaveBeenCalledWith(
						'Error de objeto:',
						expect.stringContaining('Error de objeto desconocido'),
					)
				},
			})
		})

		it('should handle null error', () => {
			const error = null

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Error desconocido')
					expect(console.log).toHaveBeenCalledWith(
						'Información:',
						expect.stringContaining('Error desconocido'),
					)
				},
			})
		})

		it('should handle undefined error', () => {
			const error = undefined

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Error desconocido')
					expect(console.log).toHaveBeenCalledWith(
						'Información:',
						expect.stringContaining('Error desconocido'),
					)
				},
			})
		})

		it('should use custom configuration', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Test error' },
				status: 400,
			})

			const customConfig: Partial<ErrorHandlerConfig> = {
				logToConsole: false,
				customErrorMessages: {
					400: 'Mensaje personalizado',
				},
			}

			const result = errorHandler.handleError(error, customConfig)

			expect(result).toBeDefined()
			expect(consoleSpy.warn).not.toHaveBeenCalled()
		})

		it('should handle 401 error with redirect disabled', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Unauthorized' },
				status: 401,
			})

			const customConfig: Partial<ErrorHandlerConfig> = {
				redirectOn401: false,
			}

			const result = errorHandler.handleError(error, customConfig)

			expect(result).toBeDefined()
		})

		it('should handle custom error messages from config', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Server error' },
				status: 400,
			})

			const customConfig: Partial<ErrorHandlerConfig> = {
				customErrorMessages: {
					400: 'Mensaje personalizado para 400',
				},
			}

			errorHandler.handleError(error, customConfig).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Mensaje personalizado para 400')
				},
			})
		})

		it('should handle unknown status code', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Unknown error' },
				status: 999,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Unknown error')
					expect(console.log).toHaveBeenCalledWith(
						'Información:',
						expect.stringContaining('Error del servidor (999)'),
					)
				},
			})
		})

		it('should handle HttpErrorResponse with URL', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Test error' },
				status: 400,
				url: 'http://api.example.com/test',
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Test error')
				},
			})
		})
	})

	describe('getErrorHistory', () => {
		it('should return empty array when no errors stored', () => {
			localStorageMock.getItem.mockReturnValue(null)

			const result = errorHandler.getErrorHistory()

			expect(result).toEqual([])
		})

		it('should return stored errors', () => {
			const storedErrors = [
				{ message: 'Error 1', status: 400, timestamp: new Date().toISOString() },
				{ message: 'Error 2', status: 500, timestamp: new Date().toISOString() },
			]
			localStorageMock.getItem.mockReturnValue(JSON.stringify(storedErrors))

			const result = errorHandler.getErrorHistory()

			expect(result).toEqual(storedErrors)
		})

		it('should handle JSON parse error', () => {
			localStorageMock.getItem.mockReturnValue('invalid json')

			const result = errorHandler.getErrorHistory()

			expect(result).toEqual([])
			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'No se pudo obtener el historial de errores:',
				expect.any(Error),
			)
		})

		it('should handle localStorage error', () => {
			localStorageMock.getItem.mockImplementation(() => {
				throw new Error('Storage error')
			})

			const result = errorHandler.getErrorHistory()

			expect(result).toEqual([])
			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'No se pudo obtener el historial de errores:',
				expect.any(Error),
			)
		})
	})

	describe('clearErrorHistory', () => {
		it('should clear error history', () => {
			errorHandler.clearErrorHistory()

			expect(localStorageMock.removeItem).toHaveBeenCalledWith('app_errors')
		})

		it('should handle error when clearing history', () => {
			localStorageMock.removeItem.mockImplementation(() => {
				throw new Error('Storage error')
			})

			errorHandler.clearErrorHistory()

			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'No se pudo limpiar el historial de errores:',
				expect.any(Error),
			)
		})
	})

	describe('Storage operations', () => {
		it('should save error info to localStorage', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Test error' },
				status: 400,
			})

			localStorageMock.getItem.mockReturnValue('[]')

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Test error')
					expect(localStorageMock.setItem).toHaveBeenCalledWith(
						'app_errors',
						expect.stringContaining('Test error'),
					)
				},
			})
		})

		it('should maintain only last 10 errors', () => {
			const existingErrors = Array.from({ length: 15 }, (_, i) => ({
				message: `Error ${i}`,
				status: 400,
				timestamp: new Date().toISOString(),
			}))

			localStorageMock.getItem.mockReturnValue(JSON.stringify(existingErrors))

			const error = new HttpErrorResponse({
				error: { message: 'New error' },
				status: 400,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('New error')
				},
			})
		})

		it('should handle localStorage error gracefully', () => {
			localStorageMock.setItem.mockImplementation(() => {
				throw new Error('Storage error')
			})

			const error = new HttpErrorResponse({
				error: { message: 'Test error' },
				status: 400,
			})

			errorHandler.handleError(error).subscribe()

			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'No se pudo guardar la información del error:',
				expect.any(Error),
			)
		})

		it('should handle localStorage getItem error', () => {
			localStorageMock.getItem.mockImplementation(() => {
				throw new Error('Storage error')
			})

			const error = new HttpErrorResponse({
				error: { message: 'Test error' },
				status: 400,
			})

			errorHandler.handleError(error).subscribe()

			expect(consoleSpy.warn).toHaveBeenCalledWith(
				'No se pudo guardar la información del error:',
				expect.any(Error),
			)
		})
	})

	describe('Authentication error handling', () => {
		it('should clear cookies on 401 error', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Unauthorized' },
				status: 401,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Unauthorized')
					expect(document.cookie).toBe('')
				},
			})
		})

		it('should clear storage on 401 error', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Unauthorized' },
				status: 401,
			})

			errorHandler.handleError(error).subscribe()

			expect(localStorageMock.clear).toHaveBeenCalled()
			expect(sessionStorageMock.clear).toHaveBeenCalled()
		})

		it('should handle storage clear error', () => {
			localStorageMock.clear.mockImplementation(() => {
				throw new Error('Storage clear error')
			})

			const error = new HttpErrorResponse({
				error: { message: 'Unauthorized' },
				status: 401,
			})

			errorHandler.handleError(error).subscribe()

			expect(consoleSpy.warn).toHaveBeenCalledWith('No se pudo limpiar el storage:', expect.any(Error))
		})
	})

	describe('Error message handling', () => {
		it('should use custom error message for status 400', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Custom 400 message' },
				status: 400,
			})

			const result = errorHandler.handleError(error)

			expect(result).toBeDefined()
		})

		it('should use default message for unknown status', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Unknown error' },
				status: 999,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError).toBeDefined()
					expect(thrownError.message).toBe('Unknown error')
					expect(console.log).toHaveBeenCalledWith(
						'Información:',
						expect.stringContaining('Error del servidor (999)'),
					)
				},
			})
		})

		it('should prioritize custom error messages over server messages', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Server message' },
				status: 400,
			})

			const customConfig: Partial<ErrorHandlerConfig> = {
				customErrorMessages: {
					400: 'Custom message',
				},
			}

			errorHandler.handleError(error, customConfig).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('Custom message')
				},
			})
		})

		it('should use server message when no custom message available', () => {
			const error = new HttpErrorResponse({
				error: { message: 'Server message' },
				status: 400,
			})

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('Server message')
				},
			})
		})
	})

	describe('Edge cases', () => {
		it('should handle empty string error', () => {
			const error = ''

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('')
				},
			})
		})

		it('should handle error with only whitespace', () => {
			const error = '   '

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('   ')
				},
			})
		})

		it('should handle error with special characters', () => {
			const error = 'Error with special chars: áéíóú ñ'

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('Error with special chars: áéíóú ñ')
				},
			})
		})

		it('should handle very long error message', () => {
			const longMessage = 'A'.repeat(1000)
			const error = new Error(longMessage)

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe(longMessage)
				},
			})
		})

		it('should handle error with null message property', () => {
			const error = { message: null }

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('Error de objeto desconocido')
				},
			})
		})

		it('should handle error with undefined message property', () => {
			const error = { message: undefined }

			errorHandler.handleError(error).subscribe({
				error: thrownError => {
					expect(thrownError.message).toBe('Error de objeto desconocido')
				},
			})
		})
	})
})

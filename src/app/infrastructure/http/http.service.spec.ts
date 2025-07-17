import { HttpContext } from '@angular/common/http'
import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator/jest'
import { HttpService } from './http.service'

window.console = jest.fn() as unknown as Console

describe('HttpService', () => {
	let spectator: SpectatorHttp<HttpService>
	const createHttp = createHttpFactory(HttpService)
	const testUrl = '/users'
	const testData = { name: 'Test User', email: 'test@example.com' }
	const testFilters = { page: 1, limit: 10, search: 'test' }

	beforeEach(() => {
		spectator = createHttp()
		spectator.service.baseUrl = 'https://api.example.com'
	})

	describe('Creación del servicio', () => {
		it('debería crear el servicio correctamente', () => {
			expect(spectator.service).toBeTruthy()
		})
	})

	describe('Método GET', () => {
		it('debería realizar una petición GET sin parámetros', () => {
			spectator.service.get(testUrl).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición GET con filtros', () => {
			spectator.service.get(testUrl, undefined, testFilters).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}?page=1&limit=10&search=test`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			expect(req.request.params.get('page')).toBe('1')
			expect(req.request.params.get('limit')).toBe('10')
			expect(req.request.params.get('search')).toBe('test')
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición GET con contexto HTTP', () => {
			const context = new HttpContext()
			spectator.service.get(testUrl, context).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			expect(req.request.context).toBe(context)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar errores en petición GET', () => {
			spectator.service.get(testUrl).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Not Found')
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			req.flush('', { status: 404, statusText: 'Not Found' })
		})

		it('debería manejar errores de red en petición GET', () => {
			spectator.service.get(testUrl).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Error desconocido')
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			req.flush('', { status: 0, statusText: 'Network Error' })
		})

		it('debería manejar error 401 y limpiar sesión', () => {
			// Mock localStorage y sessionStorage
			const localStorageSpy = jest.spyOn(Storage.prototype, 'clear')
			const sessionStorageSpy = jest.spyOn(sessionStorage, 'clear')

			spectator.service.get(testUrl).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Unauthorized')
					expect(localStorageSpy).toHaveBeenCalled()
					expect(sessionStorageSpy).toHaveBeenCalled()
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			req.flush('', { status: 401, statusText: 'Unauthorized' })
		})
	})

	describe('Método POST', () => {
		it('debería realizar una petición POST sin parámetros', () => {
			spectator.service.post(testUrl, testData).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.POST)
			expect(req.request.body).toEqual(testData)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición POST con filtros', () => {
			spectator.service.post(testUrl, testData, undefined, testFilters).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}?page=1&limit=10&search=test`
			const req = spectator.expectOne(mainUrl, HttpMethod.POST)
			expect(req.request.body).toEqual(testData)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición POST con contexto HTTP', () => {
			const context = new HttpContext()
			spectator.service.post(testUrl, testData, context).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.POST)
			expect(req.request.context).toBe(context)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar errores en petición POST', () => {
			spectator.service.post(testUrl, testData).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Bad Request')
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.POST)
			req.flush('', { status: 400, statusText: 'Bad Request' })
		})
	})

	describe('Método PUT', () => {
		it('debería realizar una petición PUT sin parámetros', () => {
			spectator.service.put(testUrl, testData).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.PUT)
			expect(req.request.body).toEqual(testData)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición PUT con filtros', () => {
			spectator.service.put(testUrl, testData, undefined, testFilters).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}?page=1&limit=10&search=test`
			const req = spectator.expectOne(mainUrl, HttpMethod.PUT)
			expect(req.request.body).toEqual(testData)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición PUT con contexto HTTP', () => {
			const context = new HttpContext()
			spectator.service.put(testUrl, testData, context).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.PUT)
			expect(req.request.context).toBe(context)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar errores en petición PUT', () => {
			spectator.service.put(testUrl, testData).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Internal Server Error')
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.PUT)
			req.flush('', { status: 500, statusText: 'Internal Server Error' })
		})
	})

	describe('Método PATCH', () => {
		it('debería realizar una petición PATCH sin parámetros', () => {
			spectator.service.patch(testUrl, testData).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.PATCH)
			expect(req.request.body).toEqual(testData)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición PATCH con filtros', () => {
			spectator.service.patch(testUrl, testData, undefined, testFilters).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}?page=1&limit=10&search=test`
			const req = spectator.expectOne(mainUrl, HttpMethod.PATCH)
			expect(req.request.body).toEqual(testData)
			expect(req.request.params.get('search')).toBe('test')
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición PATCH con contexto HTTP', () => {
			const context = new HttpContext()
			spectator.service.patch(testUrl, testData, context).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.PATCH)
			expect(req.request.context).toBe(context)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar errores en petición PATCH', () => {
			spectator.service.patch(testUrl, testData).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Unprocessable Entity')
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.PATCH)
			req.flush('', { status: 422, statusText: 'Unprocessable Entity' })
		})
	})

	describe('Método DELETE', () => {
		it('debería realizar una petición DELETE sin parámetros', () => {
			spectator.service.delete(testUrl).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.DELETE)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición DELETE con filtros', () => {
			spectator.service.delete(testUrl, undefined, testFilters).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}?page=1&limit=10&search=test`
			const req = spectator.expectOne(mainUrl, HttpMethod.DELETE)
			expect(req.request.params.get('page')).toBe('1')
			expect(req.request.params.get('limit')).toBe('10')
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería realizar una petición DELETE con contexto HTTP', () => {
			const context = new HttpContext()
			spectator.service.delete(testUrl, context).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.DELETE)
			expect(req.request.context).toBe(context)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar errores en petición DELETE', () => {
			spectator.service.delete(testUrl).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Forbidden')
				},
			})

			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.DELETE)
			req.flush('', { status: 403, statusText: 'Forbidden' })
		})
	})

	describe('Manejo de filtros', () => {
		it('debería manejar filtros con valores undefined y null', () => {
			const filtersWithNulls = {
				page: 1,
				limit: undefined,
				search: null,
				active: true,
			}

			spectator.service.get(testUrl, undefined, filtersWithNulls).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}?page=1&active=true`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)

			expect(req.request.params.get('page')).toBe('1')
			expect(req.request.params.get('active')).toBe('true')
			expect(req.request.params.keys().length).toBe(2)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar filtros vacíos', () => {
			spectator.service.get(testUrl, undefined, {}).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			expect(req.request.params.keys().length).toBe(0)
			req.flush('', { status: 200, statusText: 'OK' })
		})

		it('debería manejar filtros undefined', () => {
			spectator.service.get(testUrl, undefined, undefined).subscribe()
			const mainUrl = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(mainUrl, HttpMethod.GET)
			expect(req.request.params.keys().length).toBe(0)
			req.flush('', { status: 200, statusText: 'OK' })
		})
	})

	describe('Manejo de errores con errores anidados', () => {
		it('debería manejar errores con errores anidados', () => {
			const errorWithNestedErrors = {
				message: 'Validation Error',
				errors: {
					email: ['Email is invalid'],
					name: ['Name is required'],
				},
			}

			const localStorageSpy = jest.spyOn(localStorage, 'setItem')
			spectator.service.post(testUrl, testData).subscribe({
				next: () => fail('Debería haber fallado'),
				error: error => {
					expect(error.message).toBe('Validation Error')
					expect(localStorageSpy).toHaveBeenCalledWith('errors', JSON.stringify(errorWithNestedErrors.errors))
				},
			})
			const url = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(url, HttpMethod.POST)
			req.flush('', { status: 422, statusText: 'Unprocessable Entity' })
		})
	})

	describe('Casos de éxito', () => {
		it('debería manejar respuesta exitosa en GET', () => {
			const mockResponse = { id: 1, name: 'Test User' }

			spectator.service.get(testUrl).subscribe({
				next: response => {
					expect(response).toEqual(mockResponse)
				},
				error: () => fail('Debería haber fallado'),
			})
			const url = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(url, HttpMethod.GET)
			req.flush(mockResponse, { status: 200, statusText: 'OK' })
		})

		it('debería manejar respuesta exitosa en POST', () => {
			const mockResponse = { id: 1, ...testData }

			spectator.service.post(testUrl, testData).subscribe({
				next: response => {
					expect(response).toEqual(mockResponse)
				},
				error: () => fail('Debería haber fallado'),
			})
			const url = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(url, HttpMethod.POST)
			req.flush(mockResponse, { status: 200, statusText: 'OK' })
		})

		it('debería manejar respuesta exitosa en PUT', () => {
			const mockResponse = { id: 1, ...testData }

			spectator.service.put(testUrl, testData).subscribe({
				next: response => {
					expect(response).toEqual(mockResponse)
				},
				error: () => fail('Debería haber fallado'),
			})
			const url = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(url, HttpMethod.PUT)
			req.flush(mockResponse, { status: 200, statusText: 'OK' })
		})

		it('debería manejar respuesta exitosa en PATCH', () => {
			const mockResponse = { id: 1, name: 'Updated User' }

			spectator.service.patch(testUrl, { name: 'Updated User' }).subscribe({
				next: response => {
					expect(response).toEqual(mockResponse)
				},
				error: () => fail('Debería haber fallado'),
			})
			const url = `${spectator.service.baseUrl}${testUrl}`
			const req = spectator.expectOne(url, HttpMethod.PATCH)
			req.flush(mockResponse, { status: 200, statusText: 'OK' })
		})

		it('debería manejar respuesta exitosa en DELETE', async () => {
			const mockResponse = { success: true }
			const deleteUrl = `${testUrl}/1`

			spectator.service.delete(deleteUrl).subscribe({
				next: response => {
					expect(response).toEqual(mockResponse)
				},
				error: () => fail('Debería haber fallado'),
			})
			const url = `${spectator.service.baseUrl}${deleteUrl}`
			const req = spectator.expectOne(url, HttpMethod.DELETE)
			req.flush(mockResponse, { status: 200, statusText: 'OK' })
		})
	})
})

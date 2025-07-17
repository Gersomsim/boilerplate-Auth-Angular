import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'

export interface ErrorInfo {
	message: string
	status: number
	timestamp: Date
	url?: string
	errors?: any[]
}

export interface ErrorHandlerConfig {
	logToConsole?: boolean
	redirectOn401?: boolean
	loginRoute?: string
	showUserFriendlyMessages?: boolean
	customErrorMessages?: Record<number, string>
}
export class ErrorHandler {
	private defaultConfig: ErrorHandlerConfig = {
		logToConsole: true,
		redirectOn401: true,
		loginRoute: '/login',
		showUserFriendlyMessages: true,
		customErrorMessages: {
			400: 'Solicitud inválida',
			401: 'No autorizado',
			403: 'Acceso prohibido',
			404: 'Recurso no encontrado',
			500: 'Error interno del servidor',
			503: 'Servicio no disponible',
		},
	}

	constructor(private router: Router) {}

	/**
	 * Maneja errores HTTP de forma centralizada
	 */
	handleError(error: HttpErrorResponse | any, config?: Partial<ErrorHandlerConfig>): Observable<never> {
		const finalConfig = { ...this.defaultConfig, ...config }
		const errorInfo = this.processError(error, finalConfig)

		// Ejecutar acciones según el tipo de error
		this.executeErrorActions(errorInfo, finalConfig)

		return throwError(() => new Error(errorInfo.message))
	}

	/**
	 * Procesa el error y extrae información relevante
	 */
	private processError(error: HttpErrorResponse | any, config: ErrorHandlerConfig): ErrorInfo {
		let errorInfo: ErrorInfo = {
			message: 'Error desconocido',
			status: 0,
			timestamp: new Date(),
		}

		if (error instanceof HttpErrorResponse) {
			errorInfo = {
				message: this.getErrorMessage(error, config),
				status: error.status,
				timestamp: new Date(),
				url: error.url || undefined,
				errors: error.error?.errors || undefined,
			}
		} else if (error instanceof Error) {
			errorInfo.message = error.message
			errorInfo.status = -1 // Distinguir errores de JavaScript
		} else if (typeof error === 'string') {
			errorInfo.message = error
			errorInfo.status = -2 // Distinguir errores de string
		} else if (error && typeof error === 'object') {
			errorInfo.message = error.message || 'Error de objeto desconocido'
			errorInfo.status = -3 // Distinguir errores de objeto
		}

		return errorInfo
	}

	/**
	 * Obtiene el mensaje de error apropiado
	 */
	private getErrorMessage(error: HttpErrorResponse, config: ErrorHandlerConfig): string {
		// Mensaje personalizado según el código de estado
		if (config.customErrorMessages && config.customErrorMessages[error.status]) {
			return config.customErrorMessages[error.status]
		}

		// Mensaje del servidor si está disponible
		if (error.error?.message) {
			return error.error.message
		}

		// Mensaje por defecto según el código de estado
		return this.getDefaultErrorMessage(error.status)
	}

	/**
	 * Obtiene mensajes de error por defecto
	 */
	private getDefaultErrorMessage(status: number): string {
		switch (status) {
			case 0:
				return 'Error de conexión - Verifique su conexión a internet'
			case 400:
				return 'Solicitud inválida'
			case 401:
				return 'Sesión expirada - Inicie sesión nuevamente'
			case 403:
				return 'No tiene permisos para realizar esta acción'
			case 404:
				return 'Recurso no encontrado'
			case 500:
				return 'Error interno del servidor'
			case 503:
				return 'Servicio temporalmente no disponible'
			default:
				return `Error del servidor (${status})`
		}
	}

	/**
	 * Ejecuta acciones específicas según el tipo de error
	 */
	private executeErrorActions(errorInfo: ErrorInfo, config: ErrorHandlerConfig): void {
		// Logging
		if (config.logToConsole) {
			this.logError(errorInfo)
		}

		// Manejo de errores de autenticación
		if (errorInfo.status === 401 && config.redirectOn401) {
			this.handleAuthenticationError(config.loginRoute!)
		}

		// Guardar información del error para debugging
		this.saveErrorInfo(errorInfo)
	}

	/**
	 * Registra el error en la consola
	 */
	private logError(errorInfo: ErrorInfo): void {
		const logMessage = `[${errorInfo.timestamp.toISOString()}] Error ${errorInfo.status}: ${errorInfo.message}`

		if (errorInfo.status === 0) {
			console.error('Error de sistema:', logMessage)
		} else if (errorInfo.status >= 500) {
			console.error('Error del servidor:', logMessage)
		} else if (errorInfo.status >= 400) {
			console.warn('Error del cliente:', logMessage)
		} else if (errorInfo.status === -1) {
			console.warn('Error de JavaScript:', logMessage)
		} else if (errorInfo.status === -2) {
			console.log('Error de string:', logMessage)
		} else if (errorInfo.status === -3) {
			console.log('Error de objeto:', logMessage)
		} else {
			console.log('Información:', logMessage)
		}

		if (errorInfo.errors) {
			console.table(errorInfo.errors)
		}
	}

	/**
	 * Maneja errores de autenticación (401)
	 */
	private handleAuthenticationError(loginRoute: string): void {
		// Limpiar cookies
		this.clearCookies()

		// Limpiar storage (si es necesario)
		this.clearStorage()

		// Redireccionar al login
		this.router.navigate([loginRoute])
	}

	/**
	 * Limpia todas las cookies
	 */
	private clearCookies(): void {
		document.cookie.split(';').forEach(cookie => {
			const eqPos = cookie.indexOf('=')
			const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
		})
	}

	/**
	 * Limpia el almacenamiento local y de sesión
	 */
	private clearStorage(): void {
		try {
			localStorage.clear()
			sessionStorage.clear()
		} catch (e) {
			console.warn('No se pudo limpiar el storage:', e)
		}
	}

	/**
	 * Guarda información del error para debugging
	 */
	private saveErrorInfo(errorInfo: ErrorInfo): void {
		try {
			const errorLog = {
				...errorInfo,
				userAgent: navigator.userAgent,
				url: window.location.href,
			}

			// Guardar en localStorage para debugging
			const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]')
			existingErrors.push(errorLog)

			// Mantener solo los últimos 10 errores
			if (existingErrors.length > 10) {
				existingErrors.splice(0, existingErrors.length - 10)
			}

			localStorage.setItem('app_errors', JSON.stringify(existingErrors))
		} catch (e) {
			console.warn('No se pudo guardar la información del error:', e)
		}
	}

	/**
	 * Obtiene el historial de errores
	 */
	getErrorHistory(): ErrorInfo[] {
		try {
			return JSON.parse(localStorage.getItem('app_errors') || '[]')
		} catch (e) {
			console.warn('No se pudo obtener el historial de errores:', e)
			return []
		}
	}

	/**
	 * Limpia el historial de errores
	 */
	clearErrorHistory(): void {
		try {
			localStorage.removeItem('app_errors')
		} catch (e) {
			console.warn('No se pudo limpiar el historial de errores:', e)
		}
	}
}

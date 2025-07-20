import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, tap, throwError } from 'rxjs'
import { Notification } from '../libraries/notification.library'

export const launchNotificationInterceptor: HttpInterceptorFn = (req, next) => {
	const notification = inject(Notification)
	return next(req).pipe(
		tap(event => {
			if (event instanceof HttpResponse) {
				handleSuccessResponse(event, req, notification)
			}
		}),
		catchError(error => {
			handleErrorResponse(error, req, notification)
			return throwError(() => error)
		}),
	)
}

const handleSuccessResponse = (
	response: HttpResponse<any>,
	request: HttpRequest<any>,
	notification: Notification,
): void => {
	const method = request.method
	const url = request.url

	if (response.body.message) {
		notification.showSuccess(response.body.message)
		return
	}

	// Puedes personalizar los mensajes según el método HTTP
	switch (method) {
		case 'POST':
			notification.showSuccess('Elemento creado exitosamente', 'Creación exitosa')
			return
		case 'PUT':
		case 'PATCH':
			notification.showSuccess('Elemento actualizado exitosamente', 'Actualización exitosa')
			return
		case 'DELETE':
			notification.showSuccess('Elemento eliminado exitosamente', 'Eliminación exitosa')
			return
		case 'GET':
			// Opcional: puedes mostrar notificaciones para GET o no
			// Notification.showInfo('Datos cargados exitosamente', 'Carga exitosa');
			return
		default:
			notification.showSuccess('Operación completada exitosamente')
			return
	}

	// También puedes verificar el contenido de la respuesta
	if (response.body && response.body.message) {
		notification.showSuccess(response.body.message)
	}
}
const handleErrorResponse = (error: HttpErrorResponse, request: HttpRequest<any>, notification: Notification): void => {
	let errorMessage = 'Ha ocurrido un error'
	let errorTitle = 'Error'

	// Manejo de errores según código de estado
	switch (error.status) {
		case 400:
			errorMessage = 'Solicitud incorrecta'
			errorTitle = 'Error de validación'
			break
		case 401:
			errorMessage = 'No autorizado. Por favor, inicia sesión'
			errorTitle = 'Error de autenticación'
			break
		case 403:
			errorMessage = 'No tienes permisos para realizar esta acción'
			errorTitle = 'Error de permisos'
			break
		case 404:
			errorMessage = 'Recurso no encontrado'
			errorTitle = 'Error 404'
			break
		case 500:
			errorMessage = 'Error interno del servidor'
			errorTitle = 'Error del servidor'
			break
		default:
			errorMessage = `Error: ${error.status} - ${error.statusText}`
	}

	// Si la respuesta del servidor incluye un mensaje personalizado
	if (error.error && error.error.message) {
		errorMessage = error.error.message
	}

	notification.showError(errorMessage, errorTitle)
}

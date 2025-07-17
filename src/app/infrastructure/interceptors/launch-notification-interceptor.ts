import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http'
import { catchError, tap, throwError } from 'rxjs'
import { Notification } from '../libraries/notification.library'

export const launchNotificationInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		tap(event => {
			if (event instanceof HttpResponse) {
				handleSuccessResponse(event, req)
			}
		}),
		catchError(error => {
			handleErrorResponse(error, req)
			return throwError(() => error)
		}),
	)
}

const handleSuccessResponse = (response: HttpResponse<any>, request: HttpRequest<any>): void => {
	const method = request.method
	const url = request.url

	// Puedes personalizar los mensajes según el método HTTP
	switch (method) {
		case 'POST':
			Notification.showSuccess('Elemento creado exitosamente', 'Creación exitosa')
			break
		case 'PUT':
		case 'PATCH':
			Notification.showSuccess('Elemento actualizado exitosamente', 'Actualización exitosa')
			break
		case 'DELETE':
			Notification.showSuccess('Elemento eliminado exitosamente', 'Eliminación exitosa')
			break
		case 'GET':
			// Opcional: puedes mostrar notificaciones para GET o no
			// Notification.showInfo('Datos cargados exitosamente', 'Carga exitosa');
			break
		default:
			Notification.showSuccess('Operación completada exitosamente')
	}

	// También puedes verificar el contenido de la respuesta
	if (response.body && response.body.message) {
		Notification.showSuccess(response.body.message)
	}
}
const handleErrorResponse = (error: HttpErrorResponse, request: HttpRequest<any>): void => {
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

	Notification.showError(errorMessage, errorTitle)
}

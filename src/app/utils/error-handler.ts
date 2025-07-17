import { throwError } from 'rxjs'

export class ErrorHandler {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleError(error: any) {
		let mensaje = 'Error desconocido'
		if (error.status === 0) {
			console.error('Error dentro del sistema:', error.error)
		} else {
			console.warn('Error del servidor código: ' + error.status + ', mensaje: ', error.error)
			localStorage.setItem('errorMessage', error.error.message)
			if (error.error.errors) {
				localStorage.setItem('errors', JSON.stringify(error.error.errors))
			}
			// Si no tiene sesión iniciada entonces redireccionar a inicio
			if (error.status == 401) {
				document.cookie.split(';').forEach(c => {
					document.cookie = c
						.replace(/^ +/, '')
						.replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
				})
				// Limpar localstorage
				localStorage.clear()
				sessionStorage.clear()
				// Redireccionar a inicio
				window.location.href = '/'
			}
			mensaje = error.error.message
		}
		return throwError(() => new Error(mensaje))
	}
}

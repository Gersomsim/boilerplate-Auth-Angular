export class Notification {
	static showSuccess(message: string, title?: string): void {
		// Implementa aquí tu lógica de notificación exitosa
		// Ejemplo con alert (reemplaza con tu librería de notificaciones)
		console.log('✅ SUCCESS:', title || 'Éxito', message)
		// Ejemplo: this.toastr.success(message, title);
	}

	static showError(message: string, title?: string): void {
		// Implementa aquí tu lógica de notificación de error
		console.log('❌ ERROR:', title || 'Error', message)
		// Ejemplo: this.toastr.error(message, title);
	}

	static showWarning(message: string, title?: string): void {
		// Implementa aquí tu lógica de notificación de advertencia
		console.log('⚠️ WARNING:', title || 'Advertencia', message)
		// Ejemplo: this.toastr.warning(message, title);
	}

	static showInfo(message: string, title?: string): void {
		// Implementa aquí tu lógica de notificación informativa
		console.log('ℹ️ INFO:', title || 'Información', message)
		// Ejemplo: this.toastr.info(message, title);
	}
}

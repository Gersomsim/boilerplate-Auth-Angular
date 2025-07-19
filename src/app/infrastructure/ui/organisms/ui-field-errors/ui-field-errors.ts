import { Component, Input } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({
	selector: 'app-ui-field-errors',
	imports: [],
	templateUrl: './ui-field-errors.html',
})
export class UiFieldErrors {
	@Input({ required: true }) control!: AbstractControl | null

	/**
	 * Retorna el mensaje de error para una clave de error específica.
	 * @param errorKey La clave del error (ej. 'required', 'email').
	 * @returns El mensaje de error o null si no hay error.
	 */
	getErrorMessage(errorKey: string): string | null {
		if (this.control?.touched && this.control?.errors?.[errorKey]) {
			switch (errorKey) {
				case 'required':
					return 'Field is required.'
				case 'email':
					return 'Invalid email address.'
				case 'minlength':
					return `Minimum length not reached. Must have at least ${this.control?.errors?.[errorKey]?.requiredLength} characters.`
				case 'maxlength':
					return 'Maximum length exceeded.'
				case 'passwordMismatch':
					return 'Passwords do not match.'
				default:
					return 'Validation error.'
			}
		}
		return null
	}
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function passwordMatchValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const passwordControl = control.get(passwordControlName)
		const confirmPasswordControl = control.get(confirmPasswordControlName)

		if (!passwordControl || !confirmPasswordControl) {
			return null
		}

		if (
			confirmPasswordControl.errors &&
			confirmPasswordControl.errors['passwordMismatch'] &&
			passwordControl.value === confirmPasswordControl.value
		) {
			confirmPasswordControl.setErrors(null)
		}

		// Realiza la validación
		if (passwordControl.value !== confirmPasswordControl.value) {
			confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, passwordMismatch: true })
			return { passwordMismatch: true }
		} else {
			if (confirmPasswordControl.errors && confirmPasswordControl.errors['passwordMismatch']) {
				const restErrors = { ...confirmPasswordControl.errors }
				delete restErrors['passwordMismatch']
				confirmPasswordControl.setErrors(Object.keys(restErrors).length > 0 ? restErrors : null)
			}
		}

		return null
	}
}

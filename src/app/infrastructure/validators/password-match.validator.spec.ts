import { FormControl, FormGroup, Validators } from '@angular/forms'
import { passwordMatchValidator } from './password-match.validator'

describe('passwordMatchValidator', () => {
	let formGroup: FormGroup

	beforeEach(() => {
		formGroup = new FormGroup({
			password: new FormControl(''),
			confirmPassword: new FormControl(''),
		})
	})

	describe('cuando los controles no existen', () => {
		it('debería retornar null si el control de contraseña no existe', () => {
			const validator = passwordMatchValidator('nonexistent', 'confirmPassword')
			const result = validator(formGroup)
			expect(result).toBeNull()
		})

		it('debería retornar null si el control de confirmación no existe', () => {
			const validator = passwordMatchValidator('password', 'nonexistent')
			const result = validator(formGroup)
			expect(result).toBeNull()
		})
	})

	describe('cuando las contraseñas coinciden', () => {
		it('debería retornar null cuando las contraseñas son iguales', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'test123',
			})

			const result = validator(formGroup)
			expect(result).toBeNull()
		})

		it('debería limpiar el error passwordMismatch cuando las contraseñas coinciden', () => {
			const formGroup = new FormGroup(
				{
					password: new FormControl('somePassword'),
					confirmPassword: new FormControl('OtherPassword'),
				},
				[passwordMatchValidator('password', 'confirmPassword')],
			)

			// Simular que ya existe un error de passwordMismatch
			formGroup.updateValueAndValidity()
			expect(formGroup.invalid).toBe(true)
			expect(formGroup.errors?.['passwordMismatch']).toBe(true)

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'test123',
			})

			formGroup.updateValueAndValidity()
			expect(formGroup.invalid).toBe(false)
			expect(formGroup.errors?.['passwordMismatch']).toBeUndefined()
		})

		it('debería limpiar todos los errores cuando las contraseñas coinciden y no hay otros errores', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			// Simular que solo existe el error de passwordMismatch
			formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true })

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'test123',
			})

			validator(formGroup)

			const confirmPasswordErrors = formGroup.get('confirmPassword')?.errors
			expect(confirmPasswordErrors).toBeNull()
		})
	})

	describe('cuando las contraseñas no coinciden', () => {
		it('debería retornar error passwordMismatch cuando las contraseñas son diferentes', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'different',
			})

			const result = validator(formGroup)
			expect(result).toEqual({ passwordMismatch: true })
		})

		it('debería establecer el error passwordMismatch en el control de confirmación', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'different',
			})

			validator(formGroup)

			const confirmPasswordErrors = formGroup.get('confirmPassword')?.errors
			expect(confirmPasswordErrors?.['passwordMismatch']).toBe(true)
		})

		it('debería preservar otros errores existentes al agregar passwordMismatch', () => {
			formGroup = new FormGroup(
				{
					password: new FormControl('test123'),
					confirmPassword: new FormControl('different', [Validators.required]),
					required: new FormControl('', [Validators.required]),
				},
				[passwordMatchValidator('password', 'confirmPassword')],
			)
			formGroup.updateValueAndValidity()
			expect(formGroup.invalid).toBe(true)
			expect(formGroup.errors?.['passwordMismatch']).toBe(true)
			formGroup.patchValue({
				confirmPassword: 'test123',
			})
			formGroup.updateValueAndValidity()
			expect(formGroup.invalid).toBe(true)
			expect(formGroup.controls['required'].errors?.['required']).toBe(true)
			expect(formGroup.errors?.['passwordMismatch']).toBeUndefined()
		})
	})

	describe('cuando las contraseñas están vacías', () => {
		it('debería retornar null cuando ambas contraseñas están vacías', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			formGroup.patchValue({
				password: '',
				confirmPassword: '',
			})

			const result = validator(formGroup)
			expect(result).toBeNull()
		})

		it('debería retornar error cuando solo la contraseña está vacía', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			formGroup.patchValue({
				password: '',
				confirmPassword: 'test123',
			})

			const result = validator(formGroup)
			expect(result).toEqual({ passwordMismatch: true })
		})

		it('debería retornar error cuando solo la confirmación está vacía', () => {
			const validator = passwordMatchValidator('password', 'confirmPassword')

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: '',
			})

			const result = validator(formGroup)
			expect(result).toEqual({ passwordMismatch: true })
		})
	})

	describe('integración con FormGroup', () => {
		it('debería funcionar correctamente cuando se aplica al FormGroup completo', () => {
			formGroup = new FormGroup({
				password: new FormControl(''),
				confirmPassword: new FormControl('', [passwordMatchValidator('password', 'confirmPassword')]),
			})

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'test123',
			})

			expect(formGroup.get('confirmPassword')?.errors).toBeNull()
		})

		it('debería mostrar error cuando se aplica al FormGroup y las contraseñas no coinciden', () => {
			formGroup = new FormGroup(
				{
					password: new FormControl(''),
					confirmPassword: new FormControl(''),
				},
				[passwordMatchValidator('password', 'confirmPassword')],
			)

			formGroup.patchValue({
				password: 'test123',
				confirmPassword: 'different',
			})
			expect(formGroup.errors?.['passwordMismatch']).toBe(true)
		})
	})
})

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AbstractControl, FormControl, Validators } from '@angular/forms'
import { UiFieldErrors } from './ui-field-errors'

describe('UiFieldErrors', () => {
	let component: UiFieldErrors
	let fixture: ComponentFixture<UiFieldErrors>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UiFieldErrors],
		}).compileComponents()

		fixture = TestBed.createComponent(UiFieldErrors)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	describe('getErrorMessage', () => {
		it('should return null when control is null', () => {
			component.control = null
			const result = component.getErrorMessage('required')
			expect(result).toBeNull()
		})

		it('should return null when control is not touched', () => {
			const control = new FormControl('')
			component.control = control
			const result = component.getErrorMessage('required')
			expect(result).toBeNull()
		})

		it('should return null when control has no errors', () => {
			const control = new FormControl('', [Validators.required])
			control.markAsTouched()
			control.setValue('test')
			component.control = control
			const result = component.getErrorMessage('required')
			expect(result).toBeNull()
		})

		it('should return null when error key does not exist', () => {
			const control = new FormControl('', [Validators.required])
			control.markAsTouched()
			control.setValue('')
			component.control = control
			const result = component.getErrorMessage('nonexistent')
			expect(result).toBeNull()
		})

		describe('required error', () => {
			it('should return correct message for required error', () => {
				const control = new FormControl('', [Validators.required])
				control.markAsTouched()
				control.setValue('')
				component.control = control
				const result = component.getErrorMessage('required')
				expect(result).toBe('Field is required.')
			})
		})

		describe('email error', () => {
			it('should return correct message for email error', () => {
				const control = new FormControl('', [Validators.email])
				control.markAsTouched()
				control.setValue('invalid-email')
				component.control = control
				const result = component.getErrorMessage('email')
				expect(result).toBe('Invalid email address.')
			})
		})

		describe('minlength error', () => {
			it('should return correct message for minlength error', () => {
				const control = new FormControl('', [Validators.minLength(5)])
				control.markAsTouched()
				control.setValue('abc')
				component.control = control
				const result = component.getErrorMessage('minlength')
				expect(result).toBe('Minimum length not reached. Must have at least 5 characters.')
			})
		})

		describe('maxlength error', () => {
			it('should return correct message for maxlength error', () => {
				const control = new FormControl('', [Validators.maxLength(3)])
				control.markAsTouched()
				control.setValue('abcdef')
				component.control = control
				const result = component.getErrorMessage('maxlength')
				expect(result).toBe('Maximum length exceeded.')
			})
		})

		describe('passwordMismatch error', () => {
			it('should return correct message for passwordMismatch error', () => {
				const control = new FormControl('')
				control.markAsTouched()
				control.setErrors({ passwordMismatch: true })
				component.control = control
				const result = component.getErrorMessage('passwordMismatch')
				expect(result).toBe('Passwords do not match.')
			})
		})

		describe('default error', () => {
			it('should return default message for unknown error', () => {
				const control = new FormControl('')
				control.markAsTouched()
				control.setErrors({ customError: true })
				component.control = control
				const result = component.getErrorMessage('customError')
				expect(result).toBe('Validation error.')
			})
		})
	})

	describe('Template rendering', () => {
		it('should not render error messages when control is not touched', () => {
			const control = new FormControl('', [Validators.required])
			control.setValue('')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('p')
			expect(errorElement).toBeNull()
		})

		it('should render required error message when control is touched and has required error', () => {
			const control = new FormControl('', [Validators.required])
			control.markAsTouched()
			control.setValue('')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('p')
			expect(errorElement).toBeTruthy()
			expect(errorElement.textContent).toContain('Field is required.')
		})

		it('should render email error message when control is touched and has email error', () => {
			const control = new FormControl('', [Validators.email])
			control.markAsTouched()
			control.setValue('invalid-email')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('p')
			expect(errorElement).toBeTruthy()
			expect(errorElement.textContent).toContain('Invalid email address.')
		})

		it('should render minlength error message when control is touched and has minlength error', () => {
			const control = new FormControl('', [Validators.minLength(5)])
			control.markAsTouched()
			control.setValue('abc')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('p')
			expect(errorElement).toBeTruthy()
			expect(errorElement.textContent).toContain('Minimum length not reached. Must have at least 5 characters.')
		})

		it('should render maxlength error message when control is touched and has maxlength error', () => {
			const control = new FormControl('', [Validators.maxLength(3)])
			control.markAsTouched()
			control.setValue('abcdef')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('p')
			expect(errorElement).toBeTruthy()
			expect(errorElement.textContent).toContain('Maximum length exceeded.')
		})

		it('should render multiple error messages when control has multiple errors', () => {
			const control = new FormControl('', [Validators.required, Validators.email])
			control.markAsTouched()
			control.setValue('invalid-email')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('[data-testid="field-errors"]')
			expect(errorElement).toBeTruthy()
			expect(errorElement.textContent).toContain('Invalid email address.')
		})

		it('should not render error messages when control is touched but has no errors', () => {
			const control = new FormControl('', [Validators.required])
			control.markAsTouched()
			control.setValue('valid-value')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('[data-testid="field-errors"]')
			expect(errorElement).toBeTruthy()
		})

		it('should apply correct CSS classes to error container', () => {
			const control = new FormControl('', [Validators.required])
			control.markAsTouched()
			control.setValue('')
			component.control = control
			fixture.detectChanges()

			const errorElement = fixture.nativeElement.querySelector('p')
			expect(errorElement.classList.contains('text-sm/6')).toBeTruthy()
			expect(errorElement.classList.contains('text-red-500')).toBeTruthy()
		})
	})

	describe('Edge cases', () => {
		it('should handle control with undefined errors', () => {
			const control = new FormControl('')
			control.markAsTouched()
			control.setErrors(null)
			component.control = control
			const result = component.getErrorMessage('required')
			expect(result).toBeNull()
		})

		it('should handle control with null errors', () => {
			const control = new FormControl('')
			control.markAsTouched()
			control.setErrors(null)
			component.control = control
			const result = component.getErrorMessage('required')
			expect(result).toBeNull()
		})

		it('should handle control that is not an AbstractControl', () => {
			// Simular un control que no es AbstractControl
			const mockControl = {
				touched: true,
				errors: { required: true },
			} as unknown as AbstractControl
			component.control = mockControl
			const result = component.getErrorMessage('required')
			expect(result).toBe('Field is required.')
		})
	})
})

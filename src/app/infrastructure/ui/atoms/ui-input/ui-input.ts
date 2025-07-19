import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, signal, ViewChild } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { distinctUntilChanged, fromEvent, map, Subject, takeUntil } from 'rxjs'
import { InputType } from './input.type'

@Component({
	selector: 'app-ui-input',
	templateUrl: './ui-input.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => UiInput),
			multi: true,
		},
	],
	imports: [ReactiveFormsModule],
})
export class UiInput implements ControlValueAccessor, AfterViewInit, OnDestroy {
	@ViewChild('UIInput') input!: ElementRef<HTMLInputElement>
	@Input() type: InputType = 'text'
	@Input({ required: true }) id = ''
	@Input({ required: true }) name = ''
	@Input() required = false
	@Input() autocomplete: 'on' | 'off' = 'off'
	@Input() placeholder = ''
	@Input() isDisabled = false
	@Input() readonly = false

	public valueChanges = new Subject<string>()
	public destroy$ = new Subject<void>()

	touched = signal<boolean>(false)
	currentValue = signal<string>('')

	ngAfterViewInit(): void {
		this.updateInputValue(this.currentValue())
		// Configura el observable de cambios
		this.setupValueChanges()
	}
	setupValueChanges(): void {
		fromEvent(this.input.nativeElement, 'input')
			.pipe(
				map((event: Event) => (event.target as HTMLInputElement).value),
				distinctUntilChanged(),
				takeUntil(this.destroy$),
			)
			.subscribe(value => {
				this.currentValue.set(value)
				this.valueChanges.next(value)
				this._onChange(value)
			})
	}
	private updateInputValue(value: any): void {
		if (this.input && this.input.nativeElement) {
			this.input.nativeElement.value = value
		}
	}

	//ControlValueAccessor
	_onChange: (value: string) => void = () => {}
	_onTouched: () => void = () => {}

	writeValue(value: string): void {
		this.currentValue.set(value)
		this.updateInputValue(value)
	}

	registerOnChange(fn: (value: string) => void): void {
		this._onChange = fn
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn
	}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled
		if (this.input && this.input.nativeElement) {
			this.input.nativeElement.disabled = isDisabled
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next()
		this.destroy$.complete()
		this.valueChanges.complete()
		this.currentValue.set('')
	}
}

import { Component, Input } from '@angular/core'
import { ButtonType } from './button.type'

@Component({
	selector: 'app-ui-button',
	imports: [],
	templateUrl: './ui-button.html',
})
export class UiButton {
	@Input({ required: true }) type: ButtonType = 'submit'
	@Input() disabled = false
}

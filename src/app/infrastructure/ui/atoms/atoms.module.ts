import { NgModule } from '@angular/core'
import { UiButton } from './ui-button/ui-button'
import { UiInput } from './ui-input/ui-input'
import { UiLogo } from './ui-logo/ui-logo'

@NgModule({
	imports: [UiInput, UiLogo, UiButton],
	exports: [UiInput, UiLogo, UiButton],
})
export class AtomsModule {}

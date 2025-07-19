import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
	selector: 'app-forgot-password-link',
	imports: [RouterModule],
	template: `
		<a [routerLink]="['/forgot-password']" class="font-semibold text-indigo-600 hover:text-indigo-500">
			Forgot password?
		</a>
	`,
})
export class ForgotPasswordLink {}

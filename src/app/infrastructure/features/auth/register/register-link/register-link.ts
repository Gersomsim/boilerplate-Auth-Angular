import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
	selector: 'app-register-link',
	imports: [RouterModule],
	template: `
		<p class="mt-2 text-sm/6 text-gray-500">
			Not a member?
			<a [routerLink]="['/sign-up']" class="font-semibold text-indigo-600 hover:text-indigo-500">
				Start a 14 day free trial
			</a>
		</p>
	`,
})
export class RegisterLink {}

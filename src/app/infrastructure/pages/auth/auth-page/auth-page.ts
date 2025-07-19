import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { UiModule } from '@infrastructure/ui/ui.module'

@Component({
	selector: 'app-auth-page',
	imports: [RouterOutlet, UiModule],
	templateUrl: './auth-page.html',
})
export class AuthPage {}

import { Component } from '@angular/core'
import { RouterLinkWithHref, RouterOutlet } from '@angular/router'
import { UiModule } from '@infrastructure/ui/ui.module'

@Component({
	selector: 'app-auth-page',
	imports: [RouterOutlet, UiModule, RouterLinkWithHref],
	templateUrl: './auth-page.html',
})
export class AuthPage {}

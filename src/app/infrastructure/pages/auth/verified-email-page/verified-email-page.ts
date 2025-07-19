import { Component } from '@angular/core'
import { VerifiedEmail } from '@infrastructure/features/auth/verified-email/verified-email'

@Component({
	selector: 'app-verified-email-page',
	imports: [VerifiedEmail],
	templateUrl: './verified-email-page.html',
	styleUrl: './verified-email-page.scss',
})
export class VerifiedEmailPage {}

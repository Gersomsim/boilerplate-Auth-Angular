import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { VerifiedEmail } from '@infrastructure/features/auth/verified-email/verified-email'

@Component({
	selector: 'app-verified-email-page',
	imports: [VerifiedEmail],
	templateUrl: './verified-email-page.html',
})
export class VerifiedEmailPage implements OnInit {
	route = inject(ActivatedRoute)
	router = inject(Router)
	token = this.route.snapshot.queryParamMap.get('token')

	ngOnInit() {
		if (!this.token) {
			this.router.navigate(['/'])
		}
	}
}

import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ResetPasswordForm } from '@infrastructure/features/auth/reset-password-form/reset-password-form'

@Component({
	selector: 'app-reset-password-page',
	imports: [ResetPasswordForm],
	templateUrl: './reset-password-page.html',
})
export class ResetPasswordPage implements OnInit {
	route = inject(ActivatedRoute)
	router = inject(Router)
	token = this.route.snapshot.queryParamMap.get('token')

	ngOnInit() {
		if (!this.token) {
			this.router.navigate(['/'])
		}
	}
}
